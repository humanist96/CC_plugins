"use client"

import { useMemo } from "react"
import { Plus, Trash2, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useConversationStore } from "@/stores/useConversationStore"
import { cn } from "@/lib/utils"

type ConvItem = { id: string; title: string; updatedAt: number }

function groupByDate(conversations: readonly ConvItem[]) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const yesterday = today - 86_400_000
  const lastWeek = today - 7 * 86_400_000

  const groups: { label: string; items: ConvItem[] }[] = [
    { label: "오늘", items: [] },
    { label: "어제", items: [] },
    { label: "지난 7일", items: [] },
    { label: "이전", items: [] },
  ]

  for (const conv of conversations) {
    if (conv.updatedAt >= today) {
      groups[0].items.push(conv)
    } else if (conv.updatedAt >= yesterday) {
      groups[1].items.push(conv)
    } else if (conv.updatedAt >= lastWeek) {
      groups[2].items.push(conv)
    } else {
      groups[3].items.push(conv)
    }
  }

  return groups.filter((g) => g.items.length > 0)
}

export function ConversationSidebar() {
  const conversations = useConversationStore((s) => s.conversations)
  const activeId = useConversationStore((s) => s.activeConversationId)
  const createConversation = useConversationStore((s) => s.createConversation)
  const deleteConversation = useConversationStore((s) => s.deleteConversation)
  const setActiveConversation = useConversationStore((s) => s.setActiveConversation)

  const groups = useMemo(() => groupByDate(conversations), [conversations])

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-3 border-b border-border">
        <Button
          onClick={createConversation}
          variant="outline"
          className="w-full gap-2 justify-start"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          새 대화
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {groups.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            대화가 없습니다
          </div>
        )}

        {groups.map((group) => (
          <div key={group.label} className="mb-3">
            <div className="px-4 py-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              {group.label}
            </div>
            {group.items.map((conv) => (
              <div
                key={conv.id}
                className={cn(
                  "group flex items-center gap-2 px-3 py-2 mx-1 rounded-lg cursor-pointer transition-colors",
                  activeId === conv.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted text-foreground"
                )}
                onClick={() => setActiveConversation(conv.id)}
              >
                <MessageSquare className="h-4 w-4 shrink-0 opacity-50" />
                <span className="flex-1 text-sm truncate">{conv.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteConversation(conv.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/20 transition-opacity"
                >
                  <Trash2 className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
