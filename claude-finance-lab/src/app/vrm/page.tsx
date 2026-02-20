"use client"

import { useState, useEffect, useCallback } from "react"
import { LayoutDashboard, Shield, DollarSign, Users, Activity } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EngagementChart } from "@/components/vrm/EngagementChart"
import { TrendingAssets } from "@/components/vrm/TrendingAssets"
import { LeadScoreCard } from "@/components/vrm/LeadScoreCard"
import {
  DEMO_DAILY_USAGE,
  DEMO_TRENDING_TICKERS,
  DEMO_COMPLIANCE_STATS,
  DEMO_TOTAL_COST,
  DEMO_LEADS,
  type DemoUsage,
  type DemoTicker,
  type DemoComplianceStats,
} from "@/data/demoAnalytics"

type Period = 7 | 30 | 90

export default function VrmPage() {
  const [period, setPeriod] = useState<Period>(30)
  const [dailyUsage, setDailyUsage] = useState<readonly DemoUsage[]>(DEMO_DAILY_USAGE)
  const [trendingTickers, setTrendingTickers] = useState<readonly DemoTicker[]>(DEMO_TRENDING_TICKERS)
  const [complianceStats, setComplianceStats] = useState<DemoComplianceStats>(DEMO_COMPLIANCE_STATS)
  const [totalCost, setTotalCost] = useState(DEMO_TOTAL_COST)
  const [isLive, setIsLive] = useState(false)

  const fetchLiveData = useCallback(async (days: number) => {
    try {
      const res = await fetch(`/api/vrm?days=${days}`)
      if (!res.ok) return false
      const data = await res.json()
      if (data.dailyUsage?.length > 0) {
        setDailyUsage(data.dailyUsage)
        setTrendingTickers(data.trendingTickers)
        setComplianceStats(data.complianceStats)
        setTotalCost(data.totalCost)
        return true
      }
      return false
    } catch {
      return false
    }
  }, [])

  useEffect(() => {
    fetchLiveData(period).then((hasData) => setIsLive(hasData))
  }, [period, fetchLiveData])

  const conversionRate = complianceStats.totalQueries > 0
    ? ((complianceStats.advisoryBlocked + complianceStats.predictionBlocked) / complianceStats.totalQueries * 100)
    : 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">VRM Dashboard</h1>
            {!isLive && (
              <span className="text-[10px] font-medium bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
                DEMO
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            고객 행동 분석, 트렌딩 종목, 컴플라이언스 현황
          </p>
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          {([7, 30, 90] as const).map((d) => (
            <Button
              key={d}
              variant={period === d ? "secondary" : "ghost"}
              size="sm"
              className="text-xs h-7 px-3"
              onClick={() => setPeriod(d)}
            >
              {d}일
            </Button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-purple-500/10">
                <Activity className="h-4 w-4 text-purple-400" />
              </div>
              <span className="text-xs text-muted-foreground">총 쿼리</span>
            </div>
            <div className="text-2xl font-bold">{complianceStats.totalQueries.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-green-500/10">
                <Users className="h-4 w-4 text-green-400" />
              </div>
              <span className="text-xs text-muted-foreground">정보 응답</span>
            </div>
            <div className="text-2xl font-bold">{complianceStats.infoAllowed.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10">
                <Shield className="h-4 w-4 text-amber-400" />
              </div>
              <span className="text-xs text-muted-foreground">자문 전환율</span>
            </div>
            <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              자문 {complianceStats.advisoryBlocked} + 예측 {complianceStats.predictionBlocked}건
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-blue-500/10">
                <DollarSign className="h-4 w-4 text-blue-400" />
              </div>
              <span className="text-xs text-muted-foreground">총 비용</span>
            </div>
            <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <EngagementChart data={dailyUsage} />
        <TrendingAssets data={trendingTickers} />
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <LeadScoreCard leads={DEMO_LEADS} />

        {/* Compliance Detail */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-amber-400" />
              컴플라이언스 현황
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { label: "정보/교육 응답", value: complianceStats.infoAllowed, color: "bg-green-500", total: complianceStats.totalQueries },
                { label: "자문 질문 전환", value: complianceStats.advisoryBlocked, color: "bg-amber-500", total: complianceStats.totalQueries },
                { label: "예측 질문 전환", value: complianceStats.predictionBlocked, color: "bg-red-500", total: complianceStats.totalQueries },
              ].map((item) => {
                const pct = item.total > 0 ? (item.value / item.total) * 100 : 0
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-medium">{item.value}건 ({pct.toFixed(1)}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="pt-2 border-t border-border">
              <p className="text-[11px] text-muted-foreground">
                모든 투자 자문성 질문은 교육적 콘텐츠로 자동 전환되며,
                면책 조항이 포함됩니다. 감사 로그는 DB에 자동 기록됩니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
