"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Download, RefreshCw, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { usePortfolioStore } from "@/stores/usePortfolioStore"
import { PortfolioSummary } from "@/components/portfolio/PortfolioSummary"
import { HoldingsTable } from "@/components/portfolio/HoldingsTable"
import { AddPositionModal } from "@/components/portfolio/AddPositionModal"
import { PerformanceChart } from "@/components/portfolio/PerformanceChart"
import { enrichHolding, calculateSummary } from "@/lib/portfolioCalculator"
import type { HoldingWithQuote, PortfolioSummary as SummaryType } from "@/types/portfolio"

export default function PortfolioPage() {
  const holdings = usePortfolioStore((s) => s.holdings)
  const addHolding = usePortfolioStore((s) => s.addHolding)
  const removeHolding = usePortfolioStore((s) => s.removeHolding)
  const loadDemoPortfolio = usePortfolioStore((s) => s.loadDemoPortfolio)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [enrichedHoldings, setEnrichedHoldings] = useState<readonly HoldingWithQuote[]>([])
  const [summary, setSummary] = useState<SummaryType | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchPrices = useCallback(async () => {
    if (holdings.length === 0) {
      setEnrichedHoldings([])
      setSummary(null)
      return
    }

    setIsLoading(true)

    // Only fetch US tickers from API (KR tickers don't have API support yet)
    const usTickers = holdings.filter((h) => h.region === "US").map((h) => h.ticker)

    let priceMap: Record<string, { price: number | null; dayChange: number | null; dayChangePercent: number | null }> = {}

    if (usTickers.length > 0) {
      try {
        const res = await fetch(`/api/portfolio/prices?tickers=${usTickers.join(",")}`)
        const data = await res.json() as { prices?: Record<string, { price: number | null; dayChange: number | null; dayChangePercent: number | null }> }
        priceMap = data.prices ?? {}
      } catch {
        // Continue with null prices
      }
    }

    const enriched = holdings.map((h) => {
      if (h.region === "US" && priceMap[h.ticker]) {
        const p = priceMap[h.ticker]
        return enrichHolding(h, {
          currentPrice: p.price ?? 0,
          dayChange: p.dayChange ?? 0,
          dayChangePercent: p.dayChangePercent ?? 0,
        })
      }
      // KR stocks: use avgPrice as placeholder for now
      return enrichHolding(h, null)
    })

    setEnrichedHoldings(enriched)
    setSummary(calculateSummary(enriched))
    setIsLoading(false)
  }, [holdings])

  useEffect(() => {
    fetchPrices()
  }, [fetchPrices])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Briefcase className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Portfolio</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            보유 종목을 추적하고 성과를 분석하세요
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchPrices} disabled={isLoading} className="gap-1.5">
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            새로고침
          </Button>
          {holdings.length === 0 && (
            <Button variant="outline" size="sm" onClick={loadDemoPortfolio} className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              데모 포트폴리오
            </Button>
          )}
          <Button size="sm" onClick={() => setIsModalOpen(true)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            종목 추가
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && <PortfolioSummary summary={summary} />}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Holdings Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">보유 종목</CardTitle>
            </CardHeader>
            <CardContent>
              <HoldingsTable holdings={enrichedHoldings} onRemove={removeHolding} />
            </CardContent>
          </Card>
        </div>

        {/* Allocation Chart */}
        <div>
          <PerformanceChart holdings={enrichedHoldings} />
        </div>
      </div>

      <AddPositionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addHolding}
      />
    </div>
  )
}
