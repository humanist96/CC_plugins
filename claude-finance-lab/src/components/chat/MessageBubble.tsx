"use client"

import { Bot, User } from "lucide-react"
import ReactMarkdown from "react-markdown"
import type { ChatMessage } from "@/types/conversation"
import { ComplianceBanner } from "@/components/compliance/ComplianceBanner"

interface MessageBubbleProps {
  readonly message: ChatMessage
  readonly isStreaming?: boolean
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === "user"

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
          <Bot className="h-4 w-4 text-purple-400" />
        </div>
      )}

      <div className={`max-w-[80%] space-y-2 ${isUser ? "order-first" : ""}`}>
        {message.complianceTriggered && !isUser && (
          <ComplianceBanner />
        )}

        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-muted rounded-bl-md"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
              <ReactMarkdown>{message.content}</ReactMarkdown>
              {isStreaming && (
                <span className="inline-block w-2 h-4 bg-purple-400 animate-pulse ml-1 align-middle" />
              )}
            </div>
          )}
        </div>

        <div className={`text-[10px] text-muted-foreground px-1 ${isUser ? "text-right" : "text-left"}`}>
          {new Date(message.timestamp).toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <User className="h-4 w-4 text-primary" />
        </div>
      )}
    </div>
  )
}
