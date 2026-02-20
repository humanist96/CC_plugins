"use client"

import { Flame, Sun, Snowflake } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { LeadScore } from "@/data/demoAnalytics"

interface LeadScoreCardProps {
  readonly leads: readonly LeadScore[]
}

const scoreConfig = {
  hot: { icon: Flame, color: "text-red-400", bg: "bg-red-500/10", label: "Hot" },
  warm: { icon: Sun, color: "text-amber-400", bg: "bg-amber-500/10", label: "Warm" },
  cold: { icon: Snowflake, color: "text-blue-400", bg: "bg-blue-500/10", label: "Cold" },
} as const

export function LeadScoreCard({ leads }: LeadScoreCardProps) {
  const grouped = {
    hot: leads.filter((l) => l.score === "hot"),
    warm: leads.filter((l) => l.score === "warm"),
    cold: leads.filter((l) => l.score === "cold"),
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">리드 스코어링</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
