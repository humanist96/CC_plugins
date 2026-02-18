"use client"

import { useState, useCallback } from "react"
import { Send, Terminal, Trash2, Radio, Database, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SimTerminal } from "@/components/terminal/SimTerminal"
import { commands } from "@/data/commands"
import { extractTicker, fetchLiveQuote, SUPPORTED_TICKERS } from "@/lib/fetchLiveQuote"
import type { SimulationResponse } from "@/types/simulation"

type PlaygroundMode = "sandbox" | "live"

interface ActiveCommand {
  readonly text: string
  readonly mode: PlaygroundMode
  readonly liveFetcher?: () => Promise<SimulationResponse>
}

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

const liveSuggestedCommands = [
  "AAPL 주가 알려줘",
  "GOOGL 현재 가격",
  "MSFT 주가 조회",
  "NVDA 실시간 시세",
  "TSLA 주가",
]

export default function PlaygroundPage() {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [currentCommand, setCurrentCommand] = useState<ActiveCommand | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [mode, setMode] = useState<PlaygroundMode>("sandbox")

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed) return

    setHistory((prev) => [trimmed, ...prev].slice(0, 20))
    setInput("")
    setSuggestions([])

    if (mode === "live") {
      const ticker = extractTicker(trimmed)
      if (ticker) {
        setCurrentCommand({
          text: trimmed,
          mode: "live",
          liveFetcher: () => fetchLiveQuote(ticker),
        })
        return
      }
    }

    setCurrentCommand({ text: trimmed, mode })
  }, [input, mode])

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

  const toggleMode = () => {
    setMode((prev) => (prev === "sandbox" ? "live" : "sandbox"))
  }

  const currentSuggestions = mode === "live" ? liveSuggestedCommands : suggestedCommands

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">Playground</h1>
          <div className="flex items-center gap-2">
            <Button
              variant={mode === "sandbox" ? "default" : "outline"}
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => setMode("sandbox")}
            >
              <Database className="h-3.5 w-3.5" />
              샌드박스
            </Button>
            <Button
              variant={mode === "live" ? "default" : "outline"}
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => setMode("live")}
            >
              <Radio className="h-3.5 w-3.5" />
              실시간
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">
          {mode === "sandbox"
            ? "자유롭게 플러그인 명령어를 실험해보세요 (Sandbox 모드)"
            : "미국 주식 실시간 데이터를 조회합니다 (Live 모드)"}
        </p>
      </div>

      {mode === "live" && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
          <Info className="h-5 w-5 text-blue-400 mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-blue-400 mb-1">실시간 모드 안내</p>
            <p className="text-muted-foreground">
              지원 티커: {SUPPORTED_TICKERS.join(", ")} — 티커 또는 기업명을 입력하세요.
              지원하지 않는 명령은 자동으로 샌드박스로 전환됩니다.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Input */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">명령어 입력</CardTitle>
                <Badge
                  variant="outline"
                  className={`text-xs ${mode === "live" ? "border-blue-500/50 text-blue-400" : ""}`}
                >
                  {mode === "sandbox" ? "Sandbox" : "Live"}
                </Badge>
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
                  placeholder={
                    mode === "live"
                      ? "티커 또는 기업명을 입력하세요... (예: AAPL 주가 알려줘)"
                      : "명령어를 입력하세요... (예: /sales:account-research)"
                  }
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
            <SimTerminal
              key={`${currentCommand.text}-${currentCommand.mode}`}
              command={currentCommand.text}
              liveFetcher={currentCommand.liveFetcher}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Mode Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">모드 전환</CardTitle>
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={toggleMode}>
                  {mode === "sandbox" ? (
                    <>
                      <Radio className="h-3 w-3" />
                      실시간으로 전환
                    </>
                  ) : (
                    <>
                      <Database className="h-3 w-3" />
                      샌드박스로 전환
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {mode === "sandbox"
                  ? "미리 준비된 시뮬레이션 데이터로 플러그인 기능을 체험합니다."
                  : "Financial Datasets API를 통해 미국 주식 실시간 데이터를 조회합니다."}
              </p>
            </CardContent>
          </Card>

          {/* Suggested Commands */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">추천 명령어</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {currentSuggestions.map((cmd) => (
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
