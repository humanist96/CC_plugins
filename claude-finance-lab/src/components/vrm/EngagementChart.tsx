"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { DemoUsage } from "@/data/demoAnalytics"

const tooltipStyle = {
  backgroundColor: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "var(--color-card-foreground)",
}

interface EngagementChartProps {
  readonly data: readonly DemoUsage[]
}

export function EngagementChart({ data }: EngagementChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    date: d.date.slice(5), // MM-DD format
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">일별 이용 현황</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                className="fill-muted-foreground"
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 10 }} className="fill-muted-foreground" width={30} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
