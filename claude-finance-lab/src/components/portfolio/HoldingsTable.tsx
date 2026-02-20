"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { HoldingWithQuote } from "@/types/portfolio"
import { formatPercent } from "@/lib/portfolioCalculator"

interface HoldingsTableProps {
  readonly holdings: readonly HoldingWithQuote[]
  readonly onRemove: (id: string) => void
}

export function HoldingsTable({ holdings, onRemove }: HoldingsTableProps) {
  if (holdings.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm">
        보유 종목이 없습니다. 종목을 추가하거나 데모 포트폴리오를 불러오세요.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-muted-foreground">
            <th className="text-left py-3 px-2 font-medium">종목</th>
            <th className="text-right py-3 px-2 font-medium">수량</th>
            <th className="text-right py-3 px-2 font-medium">매입가</th>
            <th className="text-right py-3 px-2 font-medium">현재가</th>
            <th className="text-right py-3 px-2 font-medium">일일 변동</th>
            <th className="text-right py-3 px-2 font-medium">평가액</th>
            <th className="text-right py-3 px-2 font-medium">손익</th>
            <th className="text-right py-3 px-2 font-medium w-10"></th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((h) => {
            const gainColor = (h.totalGain ?? 0) >= 0 ? "text-green-400" : "text-red-400"
            const dayColor = (h.dayChange ?? 0) >= 0 ? "text-green-400" : "text-red-400"
            const priceFormat = h.region === "KR" ? "ko-KR" : "en-US"
            const priceFractionDigits = h.region === "KR" ? 0 : 2

            return (
              <tr key={h.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-3 px-2">
                  <div className="font-medium">{h.name}</div>
                  <div className="text-xs text-muted-foreground">{h.ticker}</div>
                </td>
                <td className="text-right py-3 px-2">{h.quantity.toLocaleString()}</td>
                <td className="text-right py-3 px-2">
                  {h.avgPrice.toLocaleString(priceFormat, { minimumFractionDigits: priceFractionDigits })}
                </td>
                <td className="text-right py-3 px-2">
                  {h.currentPrice !== null
                    ? h.currentPrice.toLocaleString(priceFormat, { minimumFractionDigits: priceFractionDigits })
                    : "—"}
                </td>
                <td className={`text-right py-3 px-2 ${dayColor}`}>
                  {h.dayChangePercent !== null
                    ? formatPercent(h.dayChangePercent)
                    : "—"}
                </td>
                <td className="text-right py-3 px-2 font-medium">
                  {h.totalValue !== null
                    ? `$${h.totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                    : "—"}
                </td>
                <td className={`text-right py-3 px-2 ${gainColor}`}>
                  {h.totalGain !== null ? (
                    <div>
                      <div>${Math.abs(h.totalGain).toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
                      <div className="text-xs">{formatPercent(h.totalGainPercent ?? 0)}</div>
                    </div>
                  ) : "—"}
                </td>
                <td className="text-right py-3 px-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => onRemove(h.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
