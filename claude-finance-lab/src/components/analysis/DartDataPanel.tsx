"use client"

import { useState, useEffect } from "react"
import { Building2, TrendingUp, TrendingDown, Loader2, ChevronDown, ChevronUp } from "lucide-react"
import type { DartCompanyOverview, DartKeyAccount, DartFinancialItem } from "@/types/dart"
import { extractKeyMetrics, formatKrwAmount, getCorpClsLabel, formatDate } from "@/lib/dartMapper"

interface DartDataPanelProps {
  readonly corpCode: string
  readonly corpName: string
}

interface PanelState {
  readonly company: DartCompanyOverview | null
  readonly metrics: readonly DartKeyAccount[]
  readonly isLoading: boolean
  readonly error: string | null
}

export function DartDataPanel({ corpCode, corpName }: DartDataPanelProps) {
  const [state, setState] = useState<PanelState>({
    company: null,
    metrics: [],
    isLoading: true,
    error: null,
  })
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      const currentYear = (new Date().getFullYear() - 1).toString()

      try {
        const [companyRes, financialRes] = await Promise.all([
          fetch(`/api/dart/company?corp_code=${corpCode}`),
          fetch(`/api/dart/financials?corp_code=${corpCode}&year=${currentYear}&report_code=11011&fs_div=CFS`),
        ])

        const [companyData, financialData] = await Promise.all([
          companyRes.json() as Promise<{ company?: DartCompanyOverview; error?: string }>,
          financialRes.json() as Promise<{ items?: DartFinancialItem[]; error?: string }>,
        ])

        const items = financialData.items ?? []
        const metrics = extractKeyMetrics(items)

        setState({
          company: companyData.company ?? null,
          metrics,
          isLoading: false,
          error: companyData.error ?? null,
        })
      } catch (error) {
        const message = error instanceof Error ? error.message : "데이터 조회 실패"
        setState((prev) => ({ ...prev, isLoading: false, error: message }))
      }
    }

    fetchData()
  }, [corpCode])

  if (state.isLoading) {
    return (
      <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4 mt-4">
        <div className="flex items-center gap-2 text-sm text-blue-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          {corpName} DART 데이터 로딩중...
        </div>
      </div>
    )
  }

  if (state.error || !state.company) return null

  return (
    <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 mt-4">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 text-left"
      >
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-medium text-blue-400">
            {state.company.corp_name}
          </span>
          <span className="text-xs text-muted-foreground">
            {getCorpClsLabel(state.company.corp_cls)}
            {state.company.stock_code && ` · ${state.company.stock_code}`}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-3">
          {/* Company Info */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div>
              <span className="text-muted-foreground">대표자: </span>
              {state.company.ceo_nm}
            </div>
            <div>
              <span className="text-muted-foreground">설립일: </span>
              {formatDate(state.company.est_dt)}
            </div>
          </div>

          {/* Key Metrics */}
          {state.metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {state.metrics.map((m) => (
                <div key={m.label} className="bg-background/50 rounded p-2">
                  <div className="text-[10px] text-muted-foreground">{m.label}</div>
                  <div className="text-xs font-semibold font-mono">
                    {formatKrwAmount(m.thstrm)}
                  </div>
                  {m.yoyChange !== null && (
                    <div className={`flex items-center gap-0.5 text-[10px] ${
                      m.yoyChange > 0 ? "text-green-500" : m.yoyChange < 0 ? "text-red-500" : "text-muted-foreground"
                    }`}>
                      {m.yoyChange > 0 ? (
                        <TrendingUp className="h-2.5 w-2.5" />
                      ) : (
                        <TrendingDown className="h-2.5 w-2.5" />
                      )}
                      {m.yoyChange > 0 ? "+" : ""}{m.yoyChange.toFixed(1)}% YoY
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Link to analysis page */}
          <a
            href={`/analysis?corp_code=${corpCode}`}
            className="block text-center text-xs text-blue-400 hover:underline pt-1"
          >
            상세 기업분석 보기 →
          </a>
        </div>
      )}
    </div>
  )
}
