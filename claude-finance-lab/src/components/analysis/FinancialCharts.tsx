"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { DartKeyAccount } from "@/types/dart"
import { formatKrwAmount } from "@/lib/dartMapper"

interface FinancialChartsProps {
  readonly metrics: readonly DartKeyAccount[]
  readonly year: string
}

export function FinancialCharts({ metrics, year }: FinancialChartsProps) {
  // 매출/영업이익/순이익 차트 데이터 구성
  const chartData = metrics
    .filter((m) => m.label !== "자산총계")
    .map((m) => ({
      name: m.label,
      당기: m.thstrm ? m.thstrm / 1_0000_0000 : 0,
      전기: m.frmtrm ? m.frmtrm / 1_0000_0000 : 0,
      전전기: m.bfefrmtrm ? m.bfefrmtrm / 1_0000_0000 : 0,
    }))

  if (chartData.every((d) => d.당기 === 0 && d.전기 === 0 && d.전전기 === 0)) {
    return null
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">재무 추이 비교</CardTitle>
        <p className="text-xs text-muted-foreground">단위: 억원</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="name"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis
              className="text-xs"
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
            <Legend
              wrapperStyle={{ fontSize: "12px" }}
            />
            <Bar dataKey="전전기" fill="hsl(var(--chart-3))" radius={[2, 2, 0, 0]} />
            <Bar dataKey="전기" fill="hsl(var(--chart-2))" radius={[2, 2, 0, 0]} />
            <Bar dataKey="당기" fill="hsl(var(--chart-1))" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
