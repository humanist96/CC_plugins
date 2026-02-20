import type { ChatMessage } from "@/types/conversation"

export interface ClaudeStreamCallbacks {
  readonly onText: (text: string) => void
  readonly onDone: (result: { text?: string; cost?: number }) => void
  readonly onError: (error: string) => void
  readonly onCompliance?: (triggered: boolean) => void
}

export interface FetchClaudeOptions {
  readonly prompt: string
  readonly history?: readonly ChatMessage[]
  readonly investmentLevel?: string
  readonly callbacks: ClaudeStreamCallbacks
  readonly signal?: AbortSignal
}

export async function fetchClaudeResponse(
  options: FetchClaudeOptions
): Promise<void> {
  const { prompt, history, investmentLevel, callbacks, signal } = options

  const response = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, history: history ?? [], investmentLevel }),
    signal,
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    const message =
      (errorBody as { error?: string } | null)?.error ??
      `HTTP ${response.status}`
    callbacks.onError(message)
    return
  }

  const reader = response.body?.getReader()
  if (!reader) {
    callbacks.onError("No response stream")
    return
  }

  const decoder = new TextDecoder()
  let buffer = ""

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split("\n")
      buffer = lines.pop() ?? ""

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue
        const jsonStr = line.slice(6)

        try {
          const data = JSON.parse(jsonStr) as {
            text?: string
            done?: boolean
            result?: string
            cost?: number
            error?: string
            complianceTriggered?: boolean
          }

          if ((data as { heartbeat?: boolean }).heartbeat) {
            continue
          }

          if (data.complianceTriggered !== undefined) {
            callbacks.onCompliance?.(data.complianceTriggered)
            continue
          }

          if (data.error) {
            callbacks.onError(data.error)
            return
          }

          if (data.text) {
            callbacks.onText(data.text)
          }

          if (data.done) {
            callbacks.onDone({ text: data.result, cost: data.cost })
            return
          }
        } catch {
          // skip malformed JSON lines
        }
      }
    }

    callbacks.onDone({ text: undefined, cost: undefined })
  } finally {
    reader.releaseLock()
  }
}
