"use client"

import { ExternalLink, MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface NewsItem {
  readonly id: string
  readonly title: string
  readonly source: string
  readonly summary: string
  readonly publishedAt: string
  readonly url?: string
  readonly relatedTicker?: string
}

// Demo news data
const DEMO_NEWS: readonly NewsItem[] = [
  {
    id: "1",
    title: "삼성전자, 2분기 반도체 실적 기대감 상승",
    source: "매일경제",
    summary: "HBM 수요 증가로 삼성전자의 2분기 반도체 부문 실적이 크게 개선될 것이라는 전망이 나오고 있다.",
    publishedAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
    relatedTicker: "005930",
  },
  {
    id: "2",
    title: "NVIDIA, AI 칩 수요 급증으로 분기 실적 신기록",
    source: "Bloomberg",
    summary: "엔비디아가 데이터센터 GPU 수요 폭증에 힘입어 분기 매출 신기록을 달성했다.",
    publishedAt: new Date(Date.now() - 5 * 3600_000).toISOString(),
    relatedTicker: "NVDA",
  },
  {
    id: "3",
    title: "한국은행, 기준금리 동결 결정",
    source: "한국경제",
    summary: "한국은행 금융통화위원회가 기준금리를 현 수준에서 동결했다. 향후 경기 동향을 주시하겠다고 밝혔다.",
    publishedAt: new Date(Date.now() - 8 * 3600_000).toISOString(),
  },
  {
    id: "4",
    title: "Apple, 새로운 AI 기능 탑재한 iPhone 발표",
    source: "Reuters",
    summary: "애플이 온디바이스 AI 기능을 대폭 강화한 차세대 iPhone을 공개했다.",
    publishedAt: new Date(Date.now() - 12 * 3600_000).toISOString(),
    relatedTicker: "AAPL",
  },
  {
    id: "5",
    title: "SK하이닉스, HBM4 양산 체제 본격 돌입",
    source: "전자신문",
    summary: "SK하이닉스가 차세대 고대역폭 메모리 HBM4의 양산을 시작하며 AI 반도체 시장 공략에 나선다.",
    publishedAt: new Date(Date.now() - 24 * 3600_000).toISOString(),
    relatedTicker: "000660",
  },
]

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / 3_600_000)
  if (hours < 1) return "방금 전"
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  return `${days}일 전`
}

interface NewsFeedProps {
  readonly onAskClaude?: (question: string) => void
}

export function NewsFeed({ onAskClaude }: NewsFeedProps) {
  return (
    <div className="space-y-3">
      {DEMO_NEWS.map((news) => (
        <Card key={news.id} className="hover:bg-muted/30 transition-colors">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {news.source}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{timeAgo(news.publishedAt)}</span>
                  {news.relatedTicker && (
                    <span className="text-[11px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
                      {news.relatedTicker}
                    </span>
                  )}
                </div>
                <h3 className="font-medium text-sm mb-1">{news.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{news.summary}</p>
              </div>

              <div className="flex flex-col gap-1 shrink-0">
                {news.url && (
                  <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                    <a href={news.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                )}
                {onAskClaude && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-purple-400"
                    onClick={() => onAskClaude(`"${news.title}" 이 뉴스에 대해 분석해줘`)}
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
