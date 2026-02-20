"use client"

import { Suspense, useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { ConversationSidebar } from "@/components/chat/ConversationSidebar"
import { ChatInterface } from "@/components/chat/ChatInterface"

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 border-r border-border shrink-0">
        <ConversationSidebar />
      </div>

      {/* Mobile Sidebar Drawer */}
      <div className="md:hidden absolute top-[3.75rem] left-2 z-40">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="대화 목록 열기">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 bg-background border-border">
            <SheetTitle className="sr-only">대화 목록</SheetTitle>
            <div onClick={() => setSidebarOpen(false)}>
              <ConversationSidebar />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 min-w-0">
        <Suspense>
          <ChatInterface />
        </Suspense>
      </div>
    </div>
  )
}
