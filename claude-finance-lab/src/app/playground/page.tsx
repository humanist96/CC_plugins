"use client"

import { useState, useCallback } from "react"
import { Send, Terminal, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SimTerminal } from "@/components/terminal/SimTerminal"
import { commands } from "@/data/commands"

const suggestedCommands = [
  "AAPL 현재 주가 알려줘",
  "/sales:account-research",
  "/sales:pipeline-review",
  "/finance:financial-statements",
  "/customer-support:triage",
  "삼성전자 주가 알려줘",
  "USD/KRW 환율 조회해줘",
  "/sales:daily-briefing",
]

export default function PlaygroundPage() {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [currentCommand, setCurrentCommand] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])

  const handleSubmit = useCallback(() => {
    if (!input.trim()) return
    setCurrentCommand(input.trim())
    setHistory((prev) => [input.trim(), ...prev].slice(0, 20))
    setInput("")
    setSuggestions([])
  }, [input])

  const handleInputChange = (value: string) => {
    setInput(value)
    if (value.startsWith("/")) {
      const filtered = commands
        .filter((c) => c.command.toLowerCase().includes(value.toLowerCase()))
        .map((c) => c.command)
        .slice(0, 5)
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Playground</h1>
        <p className="mt-2 text-muted-foreground">
          자유롭게 플러그인 명령어를 실험해보세요 (Sandbox 모드)
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Input */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">명령어 입력</CardTitle>
                <Badge variant="outline" className="text-xs">Sandbox</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit()
                    }
                  }}
                  placeholder="명령어를 입력하세요... (예: /sales:account-research)"
                  className="w-full min-h-[80px] px-4 py-3 rounded-md bg-muted border border-border font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />

                {suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-card border border-border rounded-md shadow-lg z-10">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setInput(s)
                          setSuggestions([])
                        }}
                        className="w-full text-left px-3 py-2 text-sm font-mono hover:bg-muted transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-3">
                <Button onClick={handleSubmit} disabled={!input.trim()} className="gap-1">
                  <Send className="h-4 w-4" />
                  실행
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Result */}
          {currentCommand && (
            <SimTerminal key={currentCommand} command={currentCommand} />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Suggested Commands */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">추천 명령어</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {suggestedCommands.map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => {
                      setInput(cmd)
                    }}
                    className="w-full text-left px-2 py-1.5 rounded text-xs font-mono hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* History */}
          {history.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">최근 실행</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => setHistory([])}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {history.map((cmd, i) => (
                    <button
                      key={`${cmd}-${i}`}
                      onClick={() => setInput(cmd)}
                      className="w-full text-left px-2 py-1.5 rounded text-xs font-mono hover:bg-muted transition-colors text-muted-foreground hover:text-foreground truncate"
                    >
                      {cmd}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
