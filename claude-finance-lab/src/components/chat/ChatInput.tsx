"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Send, Square } from "lucide-react"
import { Button } from "@/components/ui/button"

const SLASH_COMMANDS = [
  { command: "/report", description: "기업 분석 리포트 생성" },
  { command: "/dart:", description: "DART 공시/재무 데이터 조회" },
  { command: "/portfolio", description: "포트폴리오 현황 조회" },
] as const

interface ChatInputProps {
  readonly onSubmit: (message: string) => void
  readonly onStop?: () => void
  readonly isLoading: boolean
  readonly disabled?: boolean
}

export function ChatInput({ onSubmit, onStop, isLoading, disabled }: ChatInputProps) {
  const [input, setInput] = useState("")
  const [showCommands, setShowCommands] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const filteredCommands = SLASH_COMMANDS.filter((cmd) =>
    input.startsWith("/") && cmd.command.startsWith(input.toLowerCase())
  )

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return
    onSubmit(trimmed)
    setInput("")
    setShowCommands(false)
  }, [input, isLoading, onSubmit])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
      if (e.key === "Escape") {
        setShowCommands(false)
      }
    },
    [handleSubmit]
  )

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setInput(value)
    setShowCommands(value.startsWith("/") && value.length < 15)
  }, [])

  const handleCommandSelect = useCallback((command: string) => {
    setInput(`${command} `)
    setShowCommands(false)
    textareaRef.current?.focus()
  }, [])

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = "auto"
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`
  }, [input])

  return (
    <div className="relative">
      {/* Slash command autocomplete */}
      {showCommands && filteredCommands.length > 0 && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-10">
          {filteredCommands.map((cmd) => (
            <button
              key={cmd.command}
              onClick={() => handleCommandSelect(cmd.command)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors text-left"
            >
              <span className="font-mono text-primary font-medium">{cmd.command}</span>
              <span className="text-muted-foreground">{cmd.description}</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2 p-3 bg-muted/50 rounded-xl border border-border">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요... (/ 로 명령어 자동완성)"
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent border-none resize-none text-sm leading-relaxed focus:outline-none placeholder:text-muted-foreground/60 min-h-[24px] max-h-[150px]"
        />

        {isLoading ? (
          <Button
            onClick={onStop}
            size="icon"
            variant="ghost"
            className="h-8 w-8 shrink-0 text-red-400 hover:text-red-300"
          >
            <Square className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            size="icon"
            disabled={!input.trim() || disabled}
            className="h-8 w-8 shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
