"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { DemoTicker } from "@/data/demoAnalytics"

const tooltipStyle = {
  backgroundColor: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "var(--color-card-foreground)",
}

interface TrendingAssetsProps {
  readonly data: readonly DemoTicker[]
}

export function TrendingAssets({ data }: TrendingAssetsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">트렌딩 종목 Top 10</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[...data]} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 10 }} className="fill-muted-foreground" />
              <YAxis
                dataKey="ticker"
                type="category"
                tick={{ fontSize: 10 }}
                className="fill-muted-foreground"
                width={80}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
