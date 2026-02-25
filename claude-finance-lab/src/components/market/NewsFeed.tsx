"use client"

import { useState, useEffect } from "react"
import { ExternalLink, MessageSquare, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { FDNewsArticle } from "@/types/financialDatasets"

const DEFAULT_TICKERS = ["AAPL", "NVDA", "MSFT", "GOOGL", "TSLA"] as const

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / 3_600_000)
  if (hours < 1) return "방금 전"
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  return `${days}일 전`
}

interface NewsFeedProps {
  readonly tickers?: readonly string[]
  readonly startDate?: string
  readonly endDate?: string
  readonly onAskClaude?: (question: string, article: FDNewsArticle) => void
}

export function NewsFeed({ tickers = DEFAULT_TICKERS, startDate, endDate, onAskClaude }: NewsFeedProps) {
  const [articles, setArticles] = useState<FDNewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchNews() {
      setIsLoading(true)
      setError(null)

      try {
        const results = await Promise.allSettled(
          tickers.map(async (ticker) => {
            const params = new URLSearchParams({ ticker, limit: "2" })
            if (startDate) params.set("start_date", startDate)
            if (endDate) params.set("end_date", endDate)
            const res = await fetch(`/api/finance/news?${params.toString()}`, {
              signal: controller.signal,
            })
            if (!res.ok) return []
            const data = await res.json()
            return (data.news ?? []) as FDNewsArticle[]
          })
        )

        if (controller.signal.aborted) return

        const allArticles = results
          .filter((r): r is PromiseFulfilledResult<FDNewsArticle[]> => r.status === "fulfilled")
          .flatMap((r) => r.value)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        // Deduplicate by title
        const seen = new Set<string>()
        const deduped = allArticles.filter((a) => {
          if (seen.has(a.title)) return false
          seen.add(a.title)
          return true
        })

        setArticles(deduped.slice(0, 10))
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return
        if (!controller.signal.aborted) setError("뉴스를 불러올 수 없습니다.")
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    fetchNews()
    return () => { controller.abort() }
  }, [tickers, startDate, endDate])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        <span className="text-sm">뉴스를 불러오는 중...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 text-sm text-muted-foreground">
        {error}
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-muted-foreground">
        표시할 뉴스가 없습니다.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {articles.map((news) => (
        <Card key={`${news.ticker}-${news.title}`} className="hover:bg-muted/30 transition-colors">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {news.source}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{timeAgo(news.date)}</span>
                  {news.ticker && (
                    <span className="text-[11px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
                      {news.ticker}
                    </span>
                  )}
                  {news.sentiment && (
                    <span className={`text-[11px] px-1.5 py-0.5 rounded ${
                      news.sentiment === "positive"
                        ? "text-green-400 bg-green-500/10"
                        : news.sentiment === "negative"
                          ? "text-red-400 bg-red-500/10"
                          : "text-muted-foreground bg-muted"
                    }`}>
                      {news.sentiment === "positive" ? "긍정" : news.sentiment === "negative" ? "부정" : "중립"}
                    </span>
                  )}
                </div>
                <h3 className="font-medium text-sm mb-1">{news.title}</h3>
                {news.author && (
                  <p className="text-xs text-muted-foreground">{news.author}</p>
                )}
              </div>

              <div className="flex flex-col gap-1 shrink-0">
                {news.url && (
                  <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                    <a href={news.url} target="_blank" rel="noopener noreferrer" aria-label="기사 원문 보기">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                )}
                {onAskClaude && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-purple-400"
                    onClick={() => onAskClaude(`"${news.title}" 이 뉴스에 대해 분석해줘`, news)}
                    aria-label="Claude에게 분석 요청"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
