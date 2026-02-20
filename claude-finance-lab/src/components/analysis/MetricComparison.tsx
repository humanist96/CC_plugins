"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { DartKeyAccount } from "@/types/dart"
import { formatKrwAmount } from "@/lib/dartMapper"

interface MetricComparisonProps {
  readonly metrics: readonly DartKeyAccount[]
  readonly periodLabels: readonly string[]
}

export function MetricComparison({ metrics, periodLabels }: MetricComparisonProps) {
  const chartData = periodLabels.map((label, idx) => {
    const dataPoint: Record<string, string | number> = { period: label }
    for (const metric of metrics) {
      const values = [metric.bfefrmtrm, metric.frmtrm, metric.thstrm]
      const value = values[idx]
      dataPoint[metric.label] = value ? value / 1_0000_0000 : 0
    }
    return dataPoint
  })

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">다기간 비교 추이</CardTitle>
        <p className="text-xs text-muted-foreground">단위: 억원</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="period"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              tickFormatter={(v: number) => formatKrwAmount(v * 1_0000_0000)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number | undefined) =>
                formatKrwAmount((value ?? 0) * 1_0000_0000)
              }
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            {metrics.map((metric, idx) => (
              <Line
                key={metric.label}
                type="monotone"
                dataKey={metric.label}
                stroke={COLORS[idx % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
