import { describe, it, expect } from "vitest"
import { serializeHistory, buildConversationSystemPrompt } from "@/lib/conversationManager"
import type { ChatMessage } from "@/types/conversation"

function makeMessage(role: "user" | "assistant", content: string): ChatMessage {
  return {
    id: `msg-${Math.random()}`,
    role,
    content,
    timestamp: Date.now(),
  }
}

describe("conversationManager", () => {
  describe("serializeHistory", () => {
    it("빈 히스토리 → 빈 문자열", () => {
      expect(serializeHistory([])).toBe("")
    })

    it("메시지를 User/Assistant 포맷으로 직렬화", () => {
      const messages = [
        makeMessage("user", "삼성전자 실적 알려줘"),
        makeMessage("assistant", "삼성전자의 최근 실적은..."),
      ]

      const result = serializeHistory(messages)
      expect(result).toContain("User: 삼성전자 실적 알려줘")
      expect(result).toContain("Assistant: 삼성전자의 최근 실적은...")
    })

    it("최대 10개 메시지만 포함", () => {
      const messages = Array.from({ length: 15 }, (_, i) =>
        makeMessage("user", `메시지 ${i}`)
      )

      const result = serializeHistory(messages)
      // 마지막 10개만 포함 (5~14)
      expect(result).toContain("메시지 5")
      expect(result).toContain("메시지 14")
      expect(result).not.toContain("메시지 4")
    })

    it("4000자 초과 시 잘림", () => {
      const longMsg = "A".repeat(2000)
      const messages = [
        makeMessage("user", longMsg),
        makeMessage("assistant", longMsg),
        makeMessage("user", longMsg), // 이 메시지는 4000자 초과로 포함 안 됨
      ]

      const result = serializeHistory(messages)
      const occurrences = (result.match(/A{2000}/g) ?? []).length
      expect(occurrences).toBeLessThanOrEqual(2)
    })
  })

  describe("buildConversationSystemPrompt", () => {
    it("히스토리가 없으면 base prompt 그대로 반환", () => {
      const base = "You are a finance assistant."
      const result = buildConversationSystemPrompt(base, [])
      expect(result).toBe(base)
    })

    it("히스토리가 있으면 Conversation History 섹션 추가", () => {
      const base = "You are a finance assistant."
      const messages = [makeMessage("user", "안녕")]

      const result = buildConversationSystemPrompt(base, messages)
      expect(result).toContain(base)
      expect(result).toContain("[Conversation History]")
      expect(result).toContain("User: 안녕")
    })
  })
})
