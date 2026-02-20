"use client"

import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { DartKeyAccount } from "@/types/dart"
import { formatKrwAmount } from "@/lib/dartMapper"

interface FinancialSummaryCardsProps {
  readonly metrics: readonly DartKeyAccount[]
}

function YoyBadge({ change }: { readonly change: number | null }) {
  if (change === null) return <span className="text-xs text-muted-foreground">-</span>

  const isPositive = change > 0
  const isZero = change === 0
  const Icon = isPositive ? TrendingUp : isZero ? Minus : TrendingDown
  const color = isPositive ? "text-green-500" : isZero ? "text-muted-foreground" : "text-red-500"

  return (
    <span className={`flex items-center gap-0.5 text-xs ${color}`}>
      <Icon className="h-3 w-3" />
      {change > 0 ? "+" : ""}{change.toFixed(1)}%
    </span>
  )
}

export function FinancialSummaryCards({ metrics }: FinancialSummaryCardsProps) {
  if (metrics.length === 0) return null

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">핵심 지표</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 grid-cols-2">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-lg border border-border/50 p-3"
            >
              <div className="text-xs text-muted-foreground mb-1">{metric.label}</div>
              <div className="text-sm font-semibold font-mono">
                {formatKrwAmount(metric.thstrm)}
              </div>
              <YoyBadge change={metric.yoyChange} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
