"use client"

import { useState, useEffect } from "react"
import {
  Building2,
  TrendingUp,
  TrendingDown,
  Loader2,
  ChevronDown,
  ChevronUp,
  Globe,
} from "lucide-react"
import type { DartCompanyOverview, DartKeyAccount, DartFinancialItem } from "@/types/dart"
import type { QuoteApiResponse } from "@/types/financialDatasets"
import { extractKeyMetrics, formatKrwAmount, getCorpClsLabel, formatDate } from "@/lib/dartMapper"

interface ReportDataPanelProps {
  readonly region: "KR" | "US"
  readonly corpCode?: string
  readonly corpName?: string
  readonly ticker?: string
}

interface KrPanelState {
  readonly company: DartCompanyOverview | null
  readonly metrics: readonly DartKeyAccount[]
  readonly isLoading: boolean
  readonly error: string | null
}

interface UsPanelState {
  readonly quote: QuoteApiResponse | null
  readonly isLoading: boolean
  readonly error: string | null
}

function formatUsdCompact(amount: number | null | undefined): string {
  if (!amount) return "-"
  if (amount >= 1_000_000_000_000) return `$${(amount / 1_000_000_000_000).toFixed(2)}T`
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(2)}B`
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`
  return `$${amount.toLocaleString("en-US")}`
}

function formatPercent(value: number | null | undefined): string {
  if (value == null) return "-"
  return `${(value * 100).toFixed(1)}%`
}

function KrPanel({ corpCode, corpName }: { readonly corpCode: string; readonly corpName: string }) {
  const [state, setState] = useState<KrPanelState>({
    company: null,
    metrics: [],
    isLoading: true,
    error: null,
  })

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
      <div className="flex items-center gap-2 text-sm text-blue-400 p-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        {corpName} DART 데이터 로딩중...
      </div>
    )
  }

  if (state.error || !state.company) return null

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <div>
          <span className="text-muted-foreground">시장: </span>
          {getCorpClsLabel(state.company.corp_cls)}
          {state.company.stock_code && ` (${state.company.stock_code})`}
        </div>
        <div>
          <span className="text-muted-foreground">대표자: </span>
          {state.company.ceo_nm}
        </div>
        <div>
          <span className="text-muted-foreground">설립일: </span>
          {formatDate(state.company.est_dt)}
        </div>
        <div>
          <span className="text-muted-foreground">결산월: </span>
          {state.company.acc_mt}월
        </div>
      </div>

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

      <div className="text-[10px] text-muted-foreground text-right">
        DART 전자공시시스템
      </div>
    </div>
  )
}

function UsPanel({ ticker }: { readonly ticker: string }) {
  const [state, setState] = useState<UsPanelState>({
    quote: null,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    async function fetchData() {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        const res = await fetch(`/api/finance/quote?ticker=${ticker}`)
        const data = await res.json() as QuoteApiResponse & { error?: string }

        if ("error" in data && data.error) {
          setState({ quote: null, isLoading: false, error: data.error })
          return
        }

        setState({ quote: data, isLoading: false, error: null })
      } catch (error) {
        const message = error instanceof Error ? error.message : "데이터 조회 실패"
        setState({ quote: null, isLoading: false, error: message })
      }
    }

    fetchData()
  }, [ticker])

  if (state.isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-400 p-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        {ticker} 시장 데이터 로딩중...
      </div>
    )
  }

  if (state.error || !state.quote) return null

  const { price, company, metrics } = state.quote
  const changePositive = (price?.day_change ?? 0) >= 0

  return (
    <div className="space-y-3">
      {/* Price */}
      {price && (
        <div className="bg-background/50 rounded p-2">
          <div className="text-[10px] text-muted-foreground">주가</div>
          <div className="text-lg font-bold font-mono">${price.price.toFixed(2)}</div>
          <div className={`flex items-center gap-1 text-xs ${
            changePositive ? "text-green-500" : "text-red-500"
          }`}>
            {changePositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {changePositive ? "+" : ""}${price.day_change.toFixed(2)} ({changePositive ? "+" : ""}{price.day_change_percent.toFixed(2)}%)
          </div>
        </div>
      )}

      {/* Company Info */}
      {company && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <div>
            <span className="text-muted-foreground">Sector: </span>
            {company.sector}
          </div>
          <div>
            <span className="text-muted-foreground">Exchange: </span>
            {company.exchange}
          </div>
          <div>
            <span className="text-muted-foreground">Market Cap: </span>
            {formatUsdCompact(company.market_cap)}
          </div>
          <div>
            <span className="text-muted-foreground">Employees: </span>
            {company.number_of_employees?.toLocaleString("en-US") ?? "-"}
          </div>
        </div>
      )}

      {/* Metrics */}
      {metrics && (
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "P/E", value: metrics.price_to_earnings_ratio?.toFixed(1) ?? "-" },
            { label: "EPS", value: metrics.earnings_per_share != null ? `$${metrics.earnings_per_share.toFixed(2)}` : "-" },
            { label: "ROE", value: formatPercent(metrics.return_on_equity) },
            { label: "Gross Margin", value: formatPercent(metrics.gross_margin) },
          ].map((item) => (
            <div key={item.label} className="bg-background/50 rounded p-2">
              <div className="text-[10px] text-muted-foreground">{item.label}</div>
              <div className="text-xs font-semibold font-mono">{item.value}</div>
            </div>
          ))}
        </div>
      )}

      <div className="text-[10px] text-muted-foreground text-right">
        Financial Datasets API
      </div>
    </div>
  )
}

export function ReportDataPanel({ region, corpCode, corpName, ticker }: ReportDataPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const displayName = region === "KR" ? (corpName ?? "") : (ticker ?? "")
  const accentColor = region === "KR" ? "blue" : "emerald"
  const borderClass = region === "KR" ? "border-blue-500/30 bg-blue-500/5" : "border-emerald-500/30 bg-emerald-500/5"
  const iconColor = region === "KR" ? "text-blue-400" : "text-emerald-400"

  return (
    <div className={`rounded-lg border ${borderClass} mt-4`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 text-left"
      >
        <div className="flex items-center gap-2">
          {region === "KR" ? (
            <Building2 className={`h-4 w-4 ${iconColor}`} />
          ) : (
            <Globe className={`h-4 w-4 ${iconColor}`} />
          )}
          <span className={`text-sm font-medium ${iconColor}`}>
            {displayName}
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded ${
            region === "KR"
              ? "bg-blue-500/20 text-blue-400"
              : "bg-emerald-500/20 text-emerald-400"
          }`}>
            {region === "KR" ? "종합 리포트" : "Report"}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="px-3 pb-3">
          {region === "KR" && corpCode && corpName ? (
            <KrPanel corpCode={corpCode} corpName={corpName} />
          ) : region === "US" && ticker ? (
            <UsPanel ticker={ticker} />
          ) : null}
        </div>
      )}
    </div>
  )
}
