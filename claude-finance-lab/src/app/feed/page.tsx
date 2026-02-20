"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { Newspaper } from "lucide-react"
import { NewsFeed } from "@/components/market/NewsFeed"
import { MarketExplainer } from "@/components/market/MarketExplainer"

export default function FeedPage() {
  const router = useRouter()

  const handleAskClaude = useCallback(
    (question: string) => {
      // Navigate to chat with the question pre-populated via URL search param
      router.push(`/chat?q=${encodeURIComponent(question)}`)
    },
    [router]
  )

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Newspaper className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Market Feed</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          시장 뉴스, 공시, AI 분석을 한눈에
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">최신 뉴스</h2>
          <NewsFeed onAskClaude={handleAskClaude} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <MarketExplainer />
        </div>
      </div>
    </div>
  )
}
