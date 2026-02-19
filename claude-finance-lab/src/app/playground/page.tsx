"use client"

import { useState, useCallback } from "react"
import { Send, Terminal, Trash2, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ClaudeTerminal } from "@/components/terminal/ClaudeTerminal"

const claudeSuggestedCommands = [
  "AAPL 최근 실적 요약해줘",
  "반도체 업종 전망 분석해줘",
  "금리 인하가 주식시장에 미치는 영향은?",
  "고객 미팅 준비 체크리스트 만들어줘",
  "포트폴리오 리밸런싱 전략 제안해줘",
]

export default function PlaygroundPage() {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [currentCommand, setCurrentCommand] = useState<string | null>(null)
  const [commandId, setCommandId] = useState(0)

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed) return

    setHistory((prev) => [trimmed, ...prev].slice(0, 20))
    setInput("")
    setCommandId((prev) => prev + 1)
    setCurrentCommand(trimmed)
  }, [input])

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">Playground</h1>
        </div>
        <p className="text-muted-foreground">
          Claude AI에게 자유롭게 금융 관련 질문을 할 수 있습니다
        </p>
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-lg border border-purple-500/30 bg-purple-500/5 p-4">
        <Bot className="h-5 w-5 text-purple-400 mt-0.5 shrink-0" />
        <div className="text-sm">
          <p className="font-medium text-purple-400 mb-1">Claude 모드 안내</p>
          <p className="text-muted-foreground">
            로컬 Claude Code CLI를 통해 AI가 직접 응답합니다.
            금융 분석, 시장 전망, 업무 지원 등 자유롭게 질문하세요.
            별도 API Key 없이 Claude Code 인증을 그대로 사용합니다.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Input */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">질문 입력</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit()
                  }
                }}
                placeholder="Claude에게 질문하세요... (예: 반도체 업종 전망 분석해줘)"
                className="w-full min-h-[80px] px-4 py-3 rounded-md bg-muted border border-border font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />

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
            <ClaudeTerminal key={`claude-${commandId}`} command={currentCommand} />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Suggested Commands */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">추천 질문</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {claudeSuggestedCommands.map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => setInput(cmd)}
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
