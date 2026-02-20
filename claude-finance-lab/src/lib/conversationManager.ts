import type { ChatMessage } from "@/types/conversation"

const MAX_HISTORY_MESSAGES = 10
const MAX_HISTORY_CHARS = 4000

/**
 * 대화 히스토리를 system prompt에 주입할 문자열로 직렬화.
 * 슬라이딩 윈도우: 최근 MAX_HISTORY_MESSAGES개, 최대 MAX_HISTORY_CHARS자.
 */
export function serializeHistory(messages: readonly ChatMessage[]): string {
  if (messages.length === 0) return ""

  const recent = messages.slice(-MAX_HISTORY_MESSAGES)
  const lines: string[] = []
  let totalChars = 0

  for (const msg of recent) {
    const role = msg.role === "user" ? "User" : "Assistant"
    const line = `${role}: ${msg.content}`

    if (totalChars + line.length > MAX_HISTORY_CHARS) {
      break
    }

    lines.push(line)
    totalChars += line.length
  }

  return lines.join("\n\n")
}

/**
 * 히스토리를 포함한 system prompt 생성.
 * 기존 base system prompt에 대화 맥락을 추가.
 */
export function buildConversationSystemPrompt(
  baseSystemPrompt: string,
  messages: readonly ChatMessage[]
): string {
  const serialized = serializeHistory(messages)

  if (!serialized) return baseSystemPrompt

  return `${baseSystemPrompt}

---
[Conversation History]
The following is the conversation so far. Continue naturally from this context.
Maintain consistency with your previous answers.

${serialized}
---`
}
