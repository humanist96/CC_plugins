"use client"

import { useState, useCallback, useMemo } from "react"
import { Newspaper } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NewsFeed } from "@/components/market/NewsFeed"
import { MarketExplainer } from "@/components/market/MarketExplainer"
import { ArticleChatPanel } from "@/components/market/ArticleChatPanel"
import type { FDNewsArticle } from "@/types/financialDatasets"

type Period = "today" | "week" | "month" | "all"

const PERIOD_OPTIONS: readonly { readonly value: Period; readonly label: string }[] = [
  { value: "today", label: "오늘" },
  { value: "week", label: "이번 주" },
  { value: "month", label: "이번 달" },
  { value: "all", label: "전체" },
]

function resolveRange(period: Period): { startDate?: string; endDate?: string } {
  if (period === "all") return {}

  const now = new Date()
  const endDate = now.toISOString().slice(0, 10)

  if (period === "today") {
    return { startDate: endDate, endDate }
  }

  if (period === "week") {
    const start = new Date(now)
    const dayOfWeek = start.getDay()
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    start.setDate(start.getDate() - diff)
    return { startDate: start.toISOString().slice(0, 10), endDate }
  }

  // month
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  return { startDate: start.toISOString().slice(0, 10), endDate }
}

export default function FeedPage() {
  const [period, setPeriod] = useState<Period>("week")
  const [selectedArticle, setSelectedArticle] = useState<FDNewsArticle | null>(null)

  const { startDate, endDate } = useMemo(() => resolveRange(period), [period])

  const handleAskClaude = useCallback((_question: string, article: FDNewsArticle) => {
    setSelectedArticle(article)
  }, [])

  const handleClosePanel = useCallback(() => {
    setSelectedArticle(null)
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Newspaper className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Market Feed</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              시장 뉴스, 공시, AI 분석을 한눈에
            </p>
          </div>

          <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
            {PERIOD_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                variant={period === opt.value ? "secondary" : "ghost"}
                size="sm"
                className="text-xs h-7 px-3"
                onClick={() => {
                  setPeriod(opt.value)
                  setSelectedArticle(null)
                }}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">최신 뉴스</h2>
          <NewsFeed
            startDate={startDate}
            endDate={endDate}
            onAskClaude={handleAskClaude}
          />
        </div>

        <div className="lg:col-span-2">
          {selectedArticle ? (
            <ArticleChatPanel article={selectedArticle} onClose={handleClosePanel} />
          ) : (
            <MarketExplainer />
          )}
        </div>
      </div>
    </div>
  )
}
