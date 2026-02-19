"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Bot } from "lucide-react"
import { fetchClaudeResponse } from "@/lib/fetchClaudeResponse"

interface ClaudeTerminalProps {
  readonly command: string
  readonly onComplete?: (text: string) => void
}

export function ClaudeTerminal({ command, onComplete }: ClaudeTerminalProps) {
  const [phase, setPhase] = useState<"typing" | "streaming" | "done" | "error">("typing")
  const [streamedText, setStreamedText] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [cost, setCost] = useState<number | undefined>()
  const [elapsed, setElapsed] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const streamedTextRef = useRef("")

  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [])

  // Elapsed time counter
  useEffect(() => {
    if (phase === "done" || phase === "error") return
    const tick = setInterval(() => setElapsed((prev) => prev + 1), 1_000)
    return () => clearInterval(tick)
  }, [phase])

  useEffect(() => {
    let cancelled = false
    const abortController = new AbortController()

    const timer = setTimeout(async () => {
      if (cancelled) return
      setPhase("streaming")

      await fetchClaudeResponse(
        command,
        {
          onText: (text) => {
            if (cancelled) return
            streamedTextRef.current += text
            setStreamedText((prev) => prev + text)
            scrollToBottom()
          },
          onDone: (result) => {
            if (cancelled) return
            setCost(result.cost)
            setPhase("done")
            onComplete?.(streamedTextRef.current)
            scrollToBottom()
          },
          onError: (error) => {
            if (cancelled) return
            setErrorMessage(error)
            setPhase("error")
            scrollToBottom()
          },
        },
        abortController.signal
      )
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timer)
      abortController.abort()
    }
  // Run only on mount - parent uses key={...} for re-mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="rounded-lg border border-border bg-slate-950 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border-b border-border">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Bot className="h-3 w-3" />
          Claude Terminal
        </div>
        {(phase === "typing" || phase === "streaming") && (
          <div className="ml-auto flex items-center gap-1.5 text-xs text-amber-400">
            <span className="animate-pulse">●</span>
            {phase === "typing" ? "연결 중" : "응답 생성 중"}... {elapsed}s
          </div>
        )}
      </div>

      <div ref={containerRef} className="p-4 max-h-[500px] overflow-y-auto space-y-2 font-mono text-sm">
        {/* Command */}
        <div>
          <span className="text-purple-400">claude &gt; </span>
          <span className="text-green-400">{command}</span>
        </div>

        {/* Loading indicator */}
        {phase === "typing" && (
          <div className="text-amber-400 flex items-center gap-2">
            <span className="animate-pulse">...</span>
            Claude에 연결 중...
          </div>
        )}

        {/* Streamed response */}
        {streamedText && (
          <div className="mt-3">
            <div className="text-slate-500 mb-2">{"═".repeat(40)}</div>
            <div className="text-slate-200 whitespace-pre-wrap leading-relaxed">
              {streamedText}
            </div>
          </div>
        )}

        {/* Error */}
        {phase === "error" && errorMessage && (
          <div className="text-red-400 mt-2">
            Claude 응답 실패: {errorMessage}
          </div>
        )}

        {/* Done indicator */}
        {phase === "done" && typeof cost === "number" && (
          <div className="mt-3 text-xs text-slate-500">
            Cost: ${cost.toFixed(4)}
          </div>
        )}

        {/* Cursor */}
        {phase !== "done" && phase !== "error" && (
          <span className="inline-block w-2 h-4 bg-purple-400 animate-blink" />
        )}
      </div>
    </div>
  )
}
