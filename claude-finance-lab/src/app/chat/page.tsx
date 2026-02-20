"use client"

import { ConversationSidebar } from "@/components/chat/ConversationSidebar"
import { ChatInterface } from "@/components/chat/ChatInterface"

export default function ChatPage() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 border-r border-border shrink-0">
        <ConversationSidebar />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 min-w-0">
        <ChatInterface />
      </div>
    </div>
  )
}
