"use client"

import { useState, useCallback } from "react"
import { BarChart3, Loader2 } from "lucide-react"
import { CompanySearch } from "@/components/analysis/CompanySearch"
import { CompanyOverview } from "@/components/analysis/CompanyOverview"
import { FinancialStatements } from "@/components/analysis/FinancialStatements"
import { FinancialSummaryCards } from "@/components/analysis/FinancialSummaryCards"
import { DisclosureList } from "@/components/analysis/DisclosureList"
import { PeriodSelector } from "@/components/analysis/PeriodSelector"
import { FinancialCharts } from "@/components/analysis/FinancialCharts"
import { mapFinancialItemsToTableData, extractKeyMetrics, getReportLabel } from "@/lib/dartMapper"
import type { DartSearchResult, DartCompanyOverview, DartDisclosure, DartFinancialItem, FinancialTableData, DartKeyAccount } from "@/types/dart"

interface AnalysisState {
  readonly company: DartCompanyOverview | null
  readonly disclosures: readonly DartDisclosure[]
  readonly financialItems: readonly DartFinancialItem[]
  readonly tableData: readonly FinancialTableData[]
  readonly keyMetrics: readonly DartKeyAccount[]
  readonly isLoading: boolean
  readonly error: string | null
  readonly selectedCorp: DartSearchResult | null
  readonly year: string
  readonly reportCode: string
  readonly fsDiv: string
}

const currentYear = new Date().getFullYear().toString()

const INITIAL_STATE: AnalysisState = {
  company: null,
  disclosures: [],
  financialItems: [],
  tableData: [],
  keyMetrics: [],
  isLoading: false,
  error: null,
  selectedCorp: null,
  year: (Number(currentYear) - 1).toString(),
  reportCode: "11011",
  fsDiv: "CFS",
}

export default function AnalysisPage() {
  const [state, setState] = useState<AnalysisState>(INITIAL_STATE)

  const fetchData = useCallback(async (
    corpCode: string,
    year: string,
    reportCode: string,
    fsDiv: string
  ) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const [companyRes, disclosureRes, financialRes] = await Promise.all([
        fetch(`/api/dart/company?corp_code=${corpCode}`),
        fetch(`/api/dart/disclosures?corp_code=${corpCode}&page_count=10`),
        fetch(`/api/dart/financials?corp_code=${corpCode}&year=${year}&report_code=${reportCode}&fs_div=${fsDiv}`),
      ])

      const [companyData, disclosureData, financialData] = await Promise.all([
        companyRes.json() as Promise<{ company?: DartCompanyOverview; error?: string }>,
        disclosureRes.json() as Promise<{ disclosures?: DartDisclosure[]; error?: string }>,
        financialRes.json() as Promise<{ items?: DartFinancialItem[]; error?: string }>,
      ])

      const items = financialData.items ?? []
      const tableData = mapFinancialItemsToTableData(items)
      const keyMetrics = extractKeyMetrics(items)

      setState((prev) => ({
        ...prev,
        company: companyData.company ?? null,
        disclosures: disclosureData.disclosures ?? [],
        financialItems: items,
        tableData,
        keyMetrics,
        isLoading: false,
        error: companyData.error ?? financialData.error ?? null,
      }))
    } catch (error) {
      const message = error instanceof Error ? error.message : "데이터 조회 실패"
      setState((prev) => ({ ...prev, isLoading: false, error: message }))
    }
  }, [])

  const handleCompanySelect = useCallback((corp: DartSearchResult) => {
    setState((prev) => {
      fetchData(corp.corp_code, prev.year, prev.reportCode, prev.fsDiv)
      return { ...prev, selectedCorp: corp }
    })
  }, [fetchData])

  const handlePeriodChange = useCallback((year: string, reportCode: string, fsDiv: string) => {
    setState((prev) => {
      if (prev.selectedCorp) {
        fetchData(prev.selectedCorp.corp_code, year, reportCode, fsDiv)
      }
      return { ...prev, year, reportCode, fsDiv }
    })
  }, [fetchData])

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold">기업분석</h1>
        </div>
        <p className="text-muted-foreground">
          DART 전자공시시스템 데이터를 기반으로 한국 상장기업의 재무제표, 기업개황, 공시를 분석합니다
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8 flex flex-wrap items-end gap-4">
        <CompanySearch onSelect={handleCompanySelect} />
        {state.selectedCorp && (
          <PeriodSelector
            year={state.year}
            reportCode={state.reportCode}
            fsDiv={state.fsDiv}
            onChange={handlePeriodChange}
          />
        )}
      </div>

      {/* Loading */}
      {state.isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">데이터를 불러오는 중...</span>
        </div>
      )}

      {/* Error */}
      {state.error && !state.isLoading && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 mb-6">
          <p className="text-sm text-red-400">{state.error}</p>
        </div>
      )}

      {/* Results */}
      {!state.isLoading && state.selectedCorp && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main area */}
          <div className="lg:col-span-2 space-y-6">
            {state.company && <CompanyOverview company={state.company} />}

            <FinancialStatements
              tableData={state.tableData}
              year={state.year}
              reportLabel={getReportLabel(state.reportCode)}
            />

            {state.keyMetrics.length > 0 && (
              <FinancialCharts metrics={state.keyMetrics} year={state.year} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <FinancialSummaryCards metrics={state.keyMetrics} />
            <DisclosureList disclosures={state.disclosures} />
          </div>
        </div>
      )}

      {/* Empty state */}
      {!state.isLoading && !state.selectedCorp && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BarChart3 className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <p className="text-lg font-medium text-muted-foreground">기업을 검색해주세요</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            상단 검색바에서 기업명 또는 종목코드로 검색할 수 있습니다
          </p>
        </div>
      )}
    </div>
  )
}
