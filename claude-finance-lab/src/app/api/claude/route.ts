import { spawn, type ChildProcess } from "child_process"
import { NextRequest } from "next/server"
import { parseDartCommand, buildDartEnrichedPrompt, buildAutoDetectPrompt } from "@/lib/dartCommand"
import { parseReportCommand, buildReportEnrichedPrompt } from "@/lib/reportCommand"
import type { ResolvedCompany } from "@/lib/reportCompanyResolver"
import type { ChatMessage } from "@/types/conversation"
import { buildConversationSystemPrompt } from "@/lib/conversationManager"
import { detectAdvisoryIntent } from "@/lib/complianceFilter"
import { buildComplianceInstruction } from "@/lib/compliancePromptBuilder"
import { logAnalyticsEvent } from "@/lib/db/repositories/analytics"
import { getLevelInstruction } from "@/lib/levelInstruction"

// Allow long-running responses (up to 5 minutes)
export const maxDuration = 300

const RATE_LIMIT = 10
const WINDOW_MS = 60_000
const MAX_MAP_SIZE = 10_000
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

// Periodic cleanup to prevent memory leak
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(key)
  }
}, WINDOW_MS)

function isRateLimited(ip: string): boolean {
  // Hard cap to prevent memory exhaustion from spoofed IPs
  if (rateLimitMap.size > MAX_MAP_SIZE) {
    rateLimitMap.clear()
  }

  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  return ++entry.count > RATE_LIMIT
}

interface StreamJsonMessage {
  readonly type: string
  readonly subtype?: string
  readonly message?: {
    readonly content?: ReadonlyArray<{ readonly type: string; readonly text?: string }>
  }
  readonly result?: string
  readonly total_cost_usd?: number
  readonly is_error?: boolean
}

const BASE_SYSTEM_PROMPT =
  "You are a finance assistant for Korean financial sales departments. " +
  "Answer directly from your knowledge. Do NOT attempt to use any tools. " +
  "Answer concisely in Korean when asked in Korean. " +
  "Focus on financial analysis, market insights, and sales support. " +
  "Use standard Korean financial terminology (매출액, 영업이익, 당기순이익, 자산총계 등)."

/**
 * Resolve system prompt and user prompt based on input.
 * 1. /dart: command → enriched prompt with DART data
 * 2. Auto-detect Korean company → brief DART context
 * 3. Default → base system prompt
 */
async function resolvePrompts(
  prompt: string
): Promise<{
  systemPrompt: string
  userPrompt: string
  dartCompany: string | null
  reportCompany: ResolvedCompany | null
}> {
  // 0. /report 커맨드 처리
  const reportQuery = parseReportCommand(prompt)
  if (reportQuery) {
    const enriched = await buildReportEnrichedPrompt(reportQuery)
    return {
      systemPrompt: enriched.systemPrompt,
      userPrompt: enriched.userPrompt,
      dartCompany: enriched.resolvedCompany?.region === "KR"
        ? enriched.resolvedCompany.displayName : null,
      reportCompany: enriched.resolvedCompany ?? null,
    }
  }

  // 1. /dart: 커맨드 처리
  const parsed = parseDartCommand(prompt)
  if (parsed) {
    const enriched = await buildDartEnrichedPrompt(parsed)
    return {
      systemPrompt: enriched.systemPrompt,
      userPrompt: enriched.userPrompt,
      dartCompany: enriched.detectedCompany?.result.corp_name ?? null,
      reportCompany: null,
    }
  }

  // 2. 일반 텍스트에서 한국 기업 자동 감지
  const autoDetected = await buildAutoDetectPrompt(prompt)
  if (autoDetected) {
    return {
      systemPrompt: autoDetected.systemPrompt,
      userPrompt: autoDetected.userPrompt,
      dartCompany: autoDetected.detectedCompany?.result.corp_name ?? null,
      reportCompany: null,
    }
  }

  // 3. 기본 프롬프트
  return {
    systemPrompt: BASE_SYSTEM_PROMPT,
    userPrompt: prompt,
    dartCompany: null,
    reportCompany: null,
  }
}

export async function POST(request: NextRequest) {
  // Auth check — protect Claude CLI from unauthorized usage
  const { requireAuth } = await import("@/lib/auth")
  const authError = await requireAuth(request)
  if (authError) return authError

  const clientIp = request.headers.get("x-forwarded-for") ?? "unknown"
  if (isRateLimited(clientIp)) {
    return Response.json(
      { error: "Rate limit exceeded. Please wait and try again." },
      { status: 429 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const parsed = typeof body === "object" && body !== null ? body as Record<string, unknown> : {}

  const prompt = typeof parsed.prompt === "string" ? parsed.prompt.trim() : ""

  if (!prompt) {
    return Response.json({ error: "prompt is required" }, { status: 400 })
  }

  if (prompt.length > 2000) {
    return Response.json(
      { error: "prompt must be 2000 characters or less" },
      { status: 400 }
    )
  }

  // Parse optional conversation history and user level
  const history: ChatMessage[] = Array.isArray(parsed.history) ? parsed.history as ChatMessage[] : []
  const investmentLevel = typeof parsed.investmentLevel === "string" ? parsed.investmentLevel : null

  // Resolve DART-enriched prompts before spawning Claude
  const resolved = await resolvePrompts(prompt)

  // Compliance check
  const complianceResult = detectAdvisoryIntent(prompt)
  const complianceInstruction = buildComplianceInstruction(complianceResult.category)

  // Build system prompt with optional history, compliance, and user level
  let systemPrompt = resolved.systemPrompt

  // Add level-based instruction (beginner/intermediate/advanced)
  if (investmentLevel) {
    const instruction = getLevelInstruction(investmentLevel)
    if (instruction) {
      systemPrompt += `\n\n${instruction}`
    }
  }

  if (complianceInstruction) {
    systemPrompt = `${systemPrompt}\n\n${complianceInstruction}`
  }
  if (history.length > 0) {
    systemPrompt = buildConversationSystemPrompt(systemPrompt, history)
  }
  const { userPrompt, dartCompany, reportCompany } = resolved

  const startTime = Date.now()

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      // Send compliance signal to UI
      if (complianceResult.triggered) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ complianceTriggered: true })}\n\n`)
        )
      }

      // Send dartCompany hint to UI if detected
      if (dartCompany) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ dartCompany })}\n\n`)
        )
      }

      // Send reportCompany hint to UI if detected
      if (reportCompany) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ reportCompany })}\n\n`)
        )
      }

      const child: ChildProcess = spawn(
        "claude",
        [
          "-p", userPrompt,
          "--output-format", "stream-json",
          "--verbose",
          "--max-turns", "1",
          "--model", "sonnet",
          "--tools", "",
          "--system-prompt", systemPrompt,
        ],
        {
          env: {
            ...filterSafeEnv(process.env),
            CLAUDECODE: "",
          } as unknown as NodeJS.ProcessEnv,
          stdio: ["ignore", "pipe", "pipe"],
        }
      )

      let killed = false

      const cleanup = () => {
        if (!killed && !child.killed) {
          killed = true
          child.kill("SIGTERM")
        }
      }

      request.signal.addEventListener("abort", cleanup)

      let buffer = ""

      // Send heartbeat every 10s to keep connection alive
      const heartbeat = setInterval(() => {
        if (request.signal.aborted) return
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ heartbeat: true })}\n\n`)
          )
        } catch {
          // controller may be closed
        }
      }, 10_000)

      child.stdout!.on("data", (chunk: Buffer) => {
        if (request.signal.aborted) return

        buffer += chunk.toString()
        const lines = buffer.split("\n")
        buffer = lines.pop() ?? ""

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed) continue

          try {
            const msg: StreamJsonMessage = JSON.parse(trimmed)

            if (msg.type === "assistant" && msg.message?.content) {
              const text = msg.message.content
                .filter((b) => b.type === "text" && b.text)
                .map((b) => b.text)
                .join("")
              if (text) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
                )
              }
            }

            if (msg.type === "result") {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    done: true,
                    result: msg.subtype === "success" ? msg.result : undefined,
                    cost: msg.total_cost_usd,
                  })}\n\n`
                )
              )

              // Log analytics event
              try {
                logAnalyticsEvent({
                  eventType: "chat",
                  queryType: reportCompany ? "report" : dartCompany ? "dart" : "general",
                  detectedTicker: reportCompany?.ticker ?? dartCompany ?? undefined,
                  complianceCategory: complianceResult.category,
                  responseTimeMs: Date.now() - startTime,
                  costUsd: msg.total_cost_usd,
                })
              } catch {
                // Analytics logging should not break the response
              }
            }
          } catch {
            // skip non-JSON lines
          }
        }
      })

      child.stderr!.on("data", () => {
        // ignore stderr
      })

      child.on("error", (err: Error) => {
        clearInterval(heartbeat)
        if (!request.signal.aborted) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: err.message })}\n\n`
            )
          )
        }
        controller.close()
      })

      child.on("close", () => {
        clearInterval(heartbeat)
        // Flush remaining buffer
        if (buffer.trim()) {
          try {
            const msg: StreamJsonMessage = JSON.parse(buffer.trim())
            if (msg.type === "assistant" && msg.message?.content) {
              const text = msg.message.content
                .filter((b) => b.type === "text" && b.text)
                .map((b) => b.text)
                .join("")
              if (text) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
                )
              }
            }
            if (msg.type === "result") {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    done: true,
                    result: msg.subtype === "success" ? msg.result : undefined,
                    cost: msg.total_cost_usd,
                  })}\n\n`
                )
              )
            }
          } catch {
            // skip
          }
        }
        request.signal.removeEventListener("abort", cleanup)
        if (!request.signal.aborted) {
          controller.close()
        }
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}

function filterSafeEnv(
  env: NodeJS.ProcessEnv
): Record<string, string | undefined> {
  return {
    PATH: env.PATH,
    HOME: env.HOME,
    USER: env.USER,
    SHELL: env.SHELL,
    LANG: env.LANG,
    TERM: env.TERM,
    NODE_ENV: env.NODE_ENV,
    ANTHROPIC_API_KEY: env.ANTHROPIC_API_KEY,
  }
}
