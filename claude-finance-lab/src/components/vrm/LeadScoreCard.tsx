"use client"

import { Flame, Sun, Snowflake, Info } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { LeadScore } from "@/data/demoAnalytics"

interface LeadScoreCardProps {
  readonly leads: readonly LeadScore[]
  readonly isDemo?: boolean
}

const scoreConfig = {
  hot: { icon: Flame, color: "text-red-400", bg: "bg-red-500/10", label: "Hot" },
  warm: { icon: Sun, color: "text-amber-400", bg: "bg-amber-500/10", label: "Warm" },
  cold: { icon: Snowflake, color: "text-blue-400", bg: "bg-blue-500/10", label: "Cold" },
} as const

export function LeadScoreCard({ leads, isDemo = false }: LeadScoreCardProps) {
  const grouped = {
    hot: leads.filter((l) => l.score === "hot"),
    warm: leads.filter((l) => l.score === "warm"),
    cold: leads.filter((l) => l.score === "cold"),
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          리드 스코어링
          {isDemo && (
            <span className="text-[10px] font-medium bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
              DEMO
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isDemo && (
          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-2.5">
            <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>실제 사용자 활동이 쌓이면 자동으로 라이브 데이터로 전환됩니다.</span>
          </div>
        )}
        {(["hot", "warm", "cold"] as const).map((score) => {
          const config = scoreConfig[score]
          const Icon = config.icon
          const items = grouped[score]
          if (items.length === 0) return null

          return (
            <div key={score}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1 rounded ${config.bg}`}>
                  <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                </div>
                <span className={`text-xs font-medium ${config.color}`}>
                  {config.label} ({items.length})
                </span>
              </div>
              <div className="space-y-1.5">
                {items.map((lead) => (
                  <div key={lead.name} className="flex items-center justify-between text-xs px-2 py-1.5 rounded bg-muted/30">
                    <div>
                      <span className="font-medium">{lead.name}</span>
                      <span className="text-muted-foreground ml-2">{lead.queries}건</span>
                    </div>
                    <div className="text-muted-foreground">
                      {lead.lastActive}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
