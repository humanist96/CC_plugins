"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Bot, Sparkles } from "lucide-react"
import { useConversationStore } from "@/stores/useConversationStore"
import { fetchClaudeResponse } from "@/lib/fetchClaudeResponse"
import { MessageBubble } from "@/components/chat/MessageBubble"
import { ChatInput } from "@/components/chat/ChatInput"
import type { ChatMessage } from "@/types/conversation"
import { useUserProfileStore } from "@/stores/useUserProfileStore"

function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

const SUGGESTED_PROMPTS = [
  "삼성전자 최근 실적 분석해줘",
  "PER, PBR이 뭔가요?",
  "/report AAPL",
  "반도체 업종 전망은?",
  "/dart:재무제표 SK하이닉스",
  "금리 인상이 주식시장에 미치는 영향은?",
]

export function ChatInterface() {
  const [isLoading, setIsLoading] = useState(false)
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const investmentLevel = useUserProfileStore((s) => s.investmentLevel)
  const activeConversation = useConversationStore((s) => s.getActiveConversation())
  const activeConversationId = useConversationStore((s) => s.activeConversationId)
  const createConversation = useConversationStore((s) => s.createConversation)
  const addMessage = useConversationStore((s) => s.addMessage)
  const updateMessage = useConversationStore((s) => s.updateMessage)

  const messages = activeConversation?.messages ?? []

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages.length, scrollToBottom])

  const handleSend = useCallback(
    async (content: string) => {
      let conversationId = activeConversationId

      // Auto-create conversation if none active
      if (!conversationId) {
        conversationId = createConversation()
      }

      // Add user message
      const userMessage: ChatMessage = {
        id: generateMessageId(),
        role: "user",
        content,
        timestamp: Date.now(),
      }
      addMessage(conversationId, userMessage)

      // Create placeholder assistant message
      const assistantId = generateMessageId()
      const assistantMessage: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      }
      addMessage(conversationId, assistantMessage)

      setIsLoading(true)
      setStreamingMessageId(assistantId)

      const abortController = new AbortController()
      abortRef.current = abortController

      // Build history from existing messages (exclude the placeholder)
      const currentConv = useConversationStore.getState().conversations.find(
        (c) => c.id === conversationId
      )
      const historyMessages = (currentConv?.messages ?? []).filter(
        (m) => m.id !== assistantId && m.content.length > 0
      )

      let accumulatedText = ""
      let complianceTriggered = false

      await fetchClaudeResponse({
        prompt: content,
        history: historyMessages.slice(0, -1), // exclude current user message (sent as prompt)
        investmentLevel,
        callbacks: {
          onText: (text) => {
            accumulatedText += text
            updateMessage(conversationId!, assistantId, { content: accumulatedText })
            scrollToBottom()
          },
          onDone: () => {
            updateMessage(conversationId!, assistantId, {
              content: accumulatedText || "(응답 없음)",
              complianceTriggered,
            })
            setIsLoading(false)
            setStreamingMessageId(null)
            abortRef.current = null
          },
          onError: (error) => {
            updateMessage(conversationId!, assistantId, {
              content: `오류가 발생했습니다: ${error}`,
            })
            setIsLoading(false)
            setStreamingMessageId(null)
            abortRef.current = null
          },
          onCompliance: (triggered) => {
            complianceTriggered = triggered
          },
        },
        signal: abortController.signal,
      })
    },
    [activeConversationId, createConversation, addMessage, updateMessage, scrollToBottom]
  )

  const handleStop = useCallback(() => {
    abortRef.current?.abort()
    setIsLoading(false)
    setStreamingMessageId(null)
  }, [])

  const handleSuggestionClick = useCallback(
    (prompt: string) => {
      handleSend(prompt)
    },
    [handleSend]
  )

  // Empty state
  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-4">
            <Bot className="h-7 w-7 text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Claude Finance Assistant</h2>
          <p className="text-muted-foreground text-sm text-center mb-8 max-w-md">
            금융 분석, 시장 전망, 기업 리서치 등 자유롭게 질문하세요.
            대화 맥락을 유지하며 연속 질문이 가능합니다.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSuggestionClick(prompt)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border hover:bg-muted/60 transition-colors text-sm text-left group"
              >
                <Sparkles className="h-3.5 w-3.5 text-purple-400 shrink-0 opacity-60 group-hover:opacity-100" />
                <span className="truncate">{prompt}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          <ChatInput onSubmit={handleSend} isLoading={isLoading} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isStreaming={msg.id === streamingMessageId}
          />
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <ChatInput
          onSubmit={handleSend}
          onStop={handleStop}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
