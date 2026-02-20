"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PieChart as PieChartIcon } from "lucide-react"
import type { HoldingWithQuote } from "@/types/portfolio"

// Generate enough distinct colors for any portfolio size
function generateColors(count: number): string[] {
  const base = [
    "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444",
    "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1",
    "#14b8a6", "#e11d48", "#a855f7", "#0ea5e9", "#22c55e",
    "#eab308", "#dc2626", "#d946ef", "#0891b2", "#65a30d",
  ]
  if (count <= base.length) return base.slice(0, count)

  // Generate additional colors with golden angle distribution
  const colors = [...base]
  for (let i = base.length; i < count; i++) {
    const hue = (i * 137.508) % 360
    colors.push(`hsl(${Math.round(hue)}, 65%, 55%)`)
  }
  return colors
}

interface PerformanceChartProps {
  readonly holdings: readonly HoldingWithQuote[]
}

export function PerformanceChart({ holdings }: PerformanceChartProps) {
  const data = holdings
    .filter((h) => h.totalValue !== null && h.totalValue > 0)
    .map((h) => ({
      name: h.name,
      value: h.totalValue!,
    }))
    .sort((a, b) => b.value - a.value)

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">포트폴리오 배분</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <PieChartIcon className="h-10 w-10 mb-3 opacity-30" />
            <p className="text-sm">시세가 연동된 종목이 없습니다</p>
            <p className="text-xs mt-1">US 종목을 추가하면 차트가 표시됩니다</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const colors = generateColors(data.length)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">포트폴리오 배분</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`$${Number(value).toLocaleString("en-US", { minimumFractionDigits: 2 })}`, "평가액"]}
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "var(--color-card-foreground)",
                }}
              />
              <Legend
                formatter={(value: string) => <span className="text-xs text-muted-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
