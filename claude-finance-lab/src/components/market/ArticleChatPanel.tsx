"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Bot, Square, Send, Newspaper } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchClaudeResponse } from "@/lib/fetchClaudeResponse"
import type { FDNewsArticle } from "@/types/financialDatasets"
import type { ChatMessage } from "@/types/conversation"

function createMessage(role: "user" | "assistant", content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: Date.now(),
  }
}

interface ArticleChatPanelProps {
  readonly article: FDNewsArticle
  readonly onClose: () => void
}

function buildArticlePrompt(article: FDNewsArticle): string {
  const sentiment =
    article.sentiment === "positive"
      ? "긍정"
      : article.sentiment === "negative"
        ? "부정"
        : "중립"

  return [
    `다음 뉴스 기사를 투자자 관점에서 분석해줘.`,
    ``,
    `<article>`,
    `제목: ${article.title}`,
    `출처: ${article.source}`,
    `날짜: ${article.date}`,
    `티커: ${article.ticker}`,
    `감정: ${sentiment}`,
    article.author ? `작성자: ${article.author}` : null,
    `</article>`,
    ``,
    `분석 포인트:`,
    `1. 핵심 내용 요약`,
    `2. 해당 종목(${article.ticker})에 미치는 영향`,
    `3. 투자자가 주목해야 할 점`,
    `4. 관련 리스크 요인`,
  ]
    .filter(Boolean)
    .join("\n")
}

export function ArticleChatPanel({ article, onClose }: ArticleChatPanelProps) {
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [followUp, setFollowUp] = useState("")
  const [history, setHistory] = useState<ChatMessage[]>([])
  const abortRef = useRef<AbortController | null>(null)
  const responseEndRef = useRef<HTMLDivElement | null>(null)

  const cleanup = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
  }, [])

  useEffect(() => {
    return cleanup
  }, [cleanup])

  const streamResponse = useCallback(
    async (prompt: string, chatHistory: readonly ChatMessage[]) => {
      cleanup()

      const abortController = new AbortController()
      abortRef.current = abortController

      setIsLoading(true)
      setResponse("")

      await fetchClaudeResponse({
        prompt,
        history: chatHistory,
        callbacks: {
          onText: (text) => {
            setResponse((prev) => prev + text)
          },
          onDone: () => {
            setIsLoading(false)
            abortRef.current = null
          },
          onError: (error) => {
            setResponse((prev) => prev || `오류: ${error}`)
            setIsLoading(false)
            abortRef.current = null
          },
        },
        signal: abortController.signal,
      })
    },
    [cleanup]
  )

  // Auto-analyze when article changes
  useEffect(() => {
    setHistory([])
    setFollowUp("")
    const prompt = buildArticlePrompt(article)
    streamResponse(prompt, [])
  }, [article, streamResponse])

  // Scroll to bottom on new content (instant during streaming to avoid animation queue buildup)
  useEffect(() => {
    responseEndRef.current?.scrollIntoView({ behavior: isLoading ? "instant" : "smooth" })
  }, [response, isLoading])

  const handleStop = useCallback(() => {
    cleanup()
    setIsLoading(false)
  }, [cleanup])

  const handleFollowUp = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const question = followUp.trim()
      if (!question || isLoading) return

      const MAX_HISTORY = 20
      const updatedHistory: ChatMessage[] = [
        ...history,
        ...(history.length === 0
          ? [
              createMessage("user", buildArticlePrompt(article)),
              createMessage("assistant", response),
            ]
          : []),
        createMessage("user", question),
      ].slice(-MAX_HISTORY)

      setHistory(updatedHistory)
      setFollowUp("")
      streamResponse(question, updatedHistory)
    },
    [followUp, isLoading, history, article, response, streamResponse]
  )

  const sentimentLabel =
    article.sentiment === "positive"
      ? "긍정"
      : article.sentiment === "negative"
        ? "부정"
        : "중립"

  const sentimentColor =
    article.sentiment === "positive"
      ? "text-green-400 bg-green-500/10"
      : article.sentiment === "negative"
        ? "text-red-400 bg-red-500/10"
        : "text-muted-foreground bg-muted"

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-purple-400" />
            기사 분석
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-xs h-7" onClick={onClose}>
            닫기
          </Button>
        </div>

        <div className="mt-2 p-3 rounded-lg bg-muted/50 border border-border">
          <h3 className="text-sm font-medium mb-1.5 leading-snug">{article.title}</h3>
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="text-muted-foreground">{article.source}</span>
            <span className="text-muted-foreground">{article.date}</span>
            <span className="font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
              {article.ticker}
            </span>
            <span className={`px-1.5 py-0.5 rounded ${sentimentColor}`}>{sentimentLabel}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto rounded-lg bg-slate-950 border border-border p-4 mb-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Bot className="h-3.5 w-3.5 text-purple-400" />
            <span className="flex-1">AI 분석</span>
            {isLoading && (
              <button
                onClick={handleStop}
                className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors"
              >
                <Square className="h-3 w-3" />
                <span>중지</span>
              </button>
            )}
          </div>
          <div className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
            {response || "분석 중..."}
          </div>
          <div ref={responseEndRef} />
        </div>

        <form onSubmit={handleFollowUp} className="flex gap-2">
          <input
            type="text"
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
            placeholder="이 기사에 대해 추가 질문..."
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" className="h-9 w-9" disabled={isLoading || !followUp.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
