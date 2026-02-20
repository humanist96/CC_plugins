"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ChatMessage, Conversation } from "@/types/conversation"

const MAX_CONVERSATIONS = 50

interface ConversationState {
  readonly conversations: readonly Conversation[]
  readonly activeConversationId: string | null

  createConversation: () => string
  deleteConversation: (id: string) => void
  setActiveConversation: (id: string | null) => void
  addMessage: (conversationId: string, message: ChatMessage) => void
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Pick<ChatMessage, "content" | "complianceTriggered">>) => void
  getActiveConversation: () => Conversation | undefined
  clearAllConversations: () => void
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function generateTitle(firstMessage: string): string {
  const trimmed = firstMessage.trim()
  if (trimmed.length <= 30) return trimmed
  return `${trimmed.slice(0, 30)}...`
}

export const useConversationStore = create<ConversationState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,

      createConversation: () => {
        const id = generateId()
        const now = Date.now()
        const conversation: Conversation = {
          id,
          title: "새 대화",
          messages: [],
          createdAt: now,
          updatedAt: now,
        }

        set((state) => {
          const updated = [conversation, ...state.conversations].slice(0, MAX_CONVERSATIONS)
          return {
            conversations: updated,
            activeConversationId: id,
          }
        })

        return id
      },

      deleteConversation: (id) => {
        set((state) => {
          const filtered = state.conversations.filter((c) => c.id !== id)
          const newActiveId = state.activeConversationId === id
            ? (filtered[0]?.id ?? null)
            : state.activeConversationId
          return {
            conversations: filtered,
            activeConversationId: newActiveId,
          }
        })
      },

      setActiveConversation: (id) => {
        set({ activeConversationId: id })
      },

      addMessage: (conversationId, message) => {
        set((state) => {
          const conversations = state.conversations.map((conv) => {
            if (conv.id !== conversationId) return conv

            const messages = [...conv.messages, message]
            const title = conv.messages.length === 0 && message.role === "user"
              ? generateTitle(message.content)
              : conv.title

            return {
              ...conv,
              messages,
              title,
              updatedAt: Date.now(),
            }
          })

          return { conversations }
        })
      },

      updateMessage: (conversationId, messageId, updates) => {
        set((state) => {
          const conversations = state.conversations.map((conv) => {
            if (conv.id !== conversationId) return conv

            const messages = conv.messages.map((msg) => {
              if (msg.id !== messageId) return msg
              return { ...msg, ...updates }
            })

            return { ...conv, messages, updatedAt: Date.now() }
          })

          return { conversations }
        })
      },

      getActiveConversation: () => {
        const { conversations, activeConversationId } = get()
        return conversations.find((c) => c.id === activeConversationId)
      },

      clearAllConversations: () => {
        set({ conversations: [], activeConversationId: null })
      },
    }),
    {
      name: "claude-finance-conversations",
    }
  )
)
