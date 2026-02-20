"use client"

import { useState, useCallback } from "react"
import { Zap, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { fetchClaudeResponse } from "@/lib/fetchClaudeResponse"

const QUICK_QUESTIONS = [
  "오늘 시장 왜 떨어졌어?",
  "미국 증시 마감 요약해줘",
  "이번 주 주목할 경제 이벤트는?",
  "반도체 업종 최근 동향 분석",
]

export function MarketExplainer() {
  const [response, setResponse] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null)

  const handleQuestion = useCallback(async (question: string) => {
    setIsLoading(true)
    setActiveQuestion(question)
    setResponse("")

    const abortController = new AbortController()

    await fetchClaudeResponse({
      prompt: question,
      callbacks: {
        onText: (text) => {
          setResponse((prev) => (prev ?? "") + text)
        },
        onDone: () => {
          setIsLoading(false)
        },
        onError: (error) => {
          setResponse(`오류: ${error}`)
          setIsLoading(false)
        },
      },
      signal: abortController.signal,
    })
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-400" />
          원클릭 시장 분석
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {QUICK_QUESTIONS.map((q) => (
            <Button
              key={q}
              variant="outline"
              size="sm"
              className="justify-start text-xs h-auto py-2 px-3"
              disabled={isLoading}
              onClick={() => handleQuestion(q)}
            >
              {q}
            </Button>
          ))}
        </div>

        {activeQuestion && (
          <div className="mt-4 rounded-lg bg-slate-950 border border-border p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Bot className="h-3.5 w-3.5 text-purple-400" />
              <span>{activeQuestion}</span>
              {isLoading && <span className="animate-pulse text-amber-400 ml-auto">응답 중...</span>}
            </div>
            <div className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
              {response || "..."}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
