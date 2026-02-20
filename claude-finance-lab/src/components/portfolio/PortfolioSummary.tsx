"use client"

import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { PortfolioSummary as PortfolioSummaryType } from "@/types/portfolio"
import { formatPercent } from "@/lib/portfolioCalculator"

interface PortfolioSummaryProps {
  readonly summary: PortfolioSummaryType
}

export function PortfolioSummary({ summary }: PortfolioSummaryProps) {
  const isGainPositive = summary.totalGain >= 0
  const isDayPositive = summary.dayChange >= 0

  const cards = [
    {
      label: "총 평가액",
      value: `$${summary.totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "총 손익",
      value: `$${Math.abs(summary.totalGain).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      sub: formatPercent(summary.totalGainPercent),
      icon: isGainPositive ? TrendingUp : TrendingDown,
      color: isGainPositive ? "text-green-400" : "text-red-400",
      bgColor: isGainPositive ? "bg-green-500/10" : "bg-red-500/10",
    },
    {
      label: "일일 변동",
      value: `$${Math.abs(summary.dayChange).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      sub: formatPercent(summary.dayChangePercent),
      icon: isDayPositive ? TrendingUp : TrendingDown,
      color: isDayPositive ? "text-green-400" : "text-red-400",
      bgColor: isDayPositive ? "bg-green-500/10" : "bg-red-500/10",
    },
    {
      label: "보유 종목",
      value: `${summary.holdingsCount}개`,
      icon: BarChart3,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.label}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
                <span className="text-xs text-muted-foreground">{card.label}</span>
              </div>
              <div className="text-lg font-bold">{card.value}</div>
              {card.sub && (
                <div className={`text-xs mt-0.5 ${card.color}`}>{card.sub}</div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
