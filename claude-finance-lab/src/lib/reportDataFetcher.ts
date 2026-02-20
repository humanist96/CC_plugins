/** 리포트 데이터 병렬 수집 — KR(DART) / US(Financial Datasets) */

import type { ResolvedCompany } from "@/lib/reportCompanyResolver"
import { fetchCompanyOverview, fetchDisclosures, fetchFinancialStatements, getDartApiKey } from "@/lib/dartApi"
import type { DartCompanyOverview, DartDisclosure, DartFinancialItem } from "@/types/dart"
import type {
  FDPriceSnapshot,
  FDPriceSnapshotData,
  FDCompanyFacts,
  FDCompanyFactsData,
  FDFinancialMetricsSnapshot,
  FDFinancialMetric,
  FDNewsResponse,
  FDNewsArticle,
} from "@/types/financialDatasets"

export interface ReportData {
  readonly company: ResolvedCompany
  readonly fetchedAt: string
  // KR
  readonly dartOverview: DartCompanyOverview | null
  readonly dartFinancials: { readonly items: readonly DartFinancialItem[] | null; readonly year: string } | null
  readonly dartDisclosures: readonly DartDisclosure[] | null
  // US
  readonly priceSnapshot: FDPriceSnapshotData | null
  readonly companyFacts: FDCompanyFactsData | null
  readonly financialMetrics: FDFinancialMetric | null
  readonly news: readonly FDNewsArticle[] | null
}

const FD_BASE_URL = "https://api.financialdatasets.ai"
const FETCH_TIMEOUT_MS = 5000

/** Financial Datasets API fetcher (서버사이드 전용) */
async function fetchFD<T>(path: string, apiKey: string): Promise<T | null> {
  const res = await fetch(`${FD_BASE_URL}${path}`, {
    headers: { "X-API-KEY": apiKey },
    next: { revalidate: 60 },
  })
  if (!res.ok) return null
  return res.json() as Promise<T>
}

/** Promise에 타임아웃 적용 */
function withTimeout<T>(fn: () => Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    fn(),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Fetch timeout")), ms)
    ),
  ])
}

/** settled 결과에서 성공값 추출 */
function settled<T>(result: PromiseSettledResult<T>): T | null {
  return result.status === "fulfilled" ? result.value : null
}

/**
 * 사업보고서 조회 가능한 연도 결정
 * 사업보고서(11011)는 보통 다음 해 3~4월에 공시
 */
function getLatestReportYear(): string {
  const now = new Date()
  const month = now.getMonth() + 1
  const offset = month < 5 ? 2 : 1
  return String(now.getFullYear() - offset)
}

/** 재무제표 fetch — 최신 연도 실패 시 이전 연도로 fallback */
async function fetchFinancialsWithFallback(
  apiKey: string,
  corpCode: string
): Promise<{ items: readonly DartFinancialItem[] | null; year: string }> {
  const primaryYear = getLatestReportYear()
  const primary = await fetchFinancialStatements(apiKey, {
    corp_code: corpCode,
    bsns_year: primaryYear,
    reprt_code: "11011",
    fs_div: "CFS",
  })

  if (primary?.list && primary.list.length > 0) {
    return { items: primary.list, year: primaryYear }
  }

  const fallbackYear = String(Number(primaryYear) - 1)
  const fallback = await fetchFinancialStatements(apiKey, {
    corp_code: corpCode,
    bsns_year: fallbackYear,
    reprt_code: "11011",
    fs_div: "CFS",
  })

  return {
    items: fallback?.list && fallback.list.length > 0 ? fallback.list : null,
    year: fallback?.list && fallback.list.length > 0 ? fallbackYear : primaryYear,
  }
}

/** KR 기업 데이터 수집 */
async function fetchKrData(
  corpCode: string,
  apiKey: string
): Promise<Pick<ReportData, "dartOverview" | "dartFinancials" | "dartDisclosures">> {
  const [overviewResult, financialsResult, disclosuresResult] = await Promise.allSettled([
    withTimeout(() => fetchCompanyOverview(corpCode, apiKey), FETCH_TIMEOUT_MS),
    withTimeout(() => fetchFinancialsWithFallback(apiKey, corpCode), FETCH_TIMEOUT_MS),
    withTimeout(
      () => fetchDisclosures(apiKey, { corp_code: corpCode, page_count: "10" }),
      FETCH_TIMEOUT_MS
    ),
  ])

  return {
    dartOverview: settled(overviewResult),
    dartFinancials: settled(financialsResult),
    dartDisclosures: settled(disclosuresResult)?.list ?? null,
  }
}

/** US 기업 데이터 수집 */
async function fetchUsData(
  ticker: string,
  apiKey: string
): Promise<Pick<ReportData, "priceSnapshot" | "companyFacts" | "financialMetrics" | "news">> {
  const [priceResult, factsResult, metricsResult, newsResult] = await Promise.allSettled([
    withTimeout(() => fetchFD<FDPriceSnapshot>(`/prices/snapshot/?ticker=${ticker}`, apiKey), FETCH_TIMEOUT_MS),
    withTimeout(() => fetchFD<FDCompanyFacts>(`/company/facts/?ticker=${ticker}`, apiKey), FETCH_TIMEOUT_MS),
    withTimeout(() => fetchFD<FDFinancialMetricsSnapshot>(`/financial-metrics/snapshot/?ticker=${ticker}`, apiKey), FETCH_TIMEOUT_MS),
    withTimeout(() => fetchFD<FDNewsResponse>(`/news/?ticker=${ticker}&limit=5`, apiKey), FETCH_TIMEOUT_MS),
  ])

  return {
    priceSnapshot: settled(priceResult)?.snapshot ?? null,
    companyFacts: settled(factsResult)?.company_facts ?? null,
    financialMetrics: settled(metricsResult)?.snapshot ?? null,
    news: settled(newsResult)?.news ?? null,
  }
}

const emptyKr: Pick<ReportData, "dartOverview" | "dartFinancials" | "dartDisclosures"> = {
  dartOverview: null,
  dartFinancials: null,
  dartDisclosures: null,
}

const emptyUs: Pick<ReportData, "priceSnapshot" | "companyFacts" | "financialMetrics" | "news"> = {
  priceSnapshot: null,
  companyFacts: null,
  financialMetrics: null,
  news: null,
}

/** 기업 유형에 따라 적절한 API를 병렬 호출하여 ReportData 반환 */
export async function fetchReportData(company: ResolvedCompany): Promise<ReportData> {
  const fetchedAt = new Date().toISOString()

  if (company.region === "KR") {
    const dartApiKey = getDartApiKey()
    const krData = dartApiKey && company.corpCode
      ? await fetchKrData(company.corpCode, dartApiKey)
      : emptyKr

    return { company, fetchedAt, ...krData, ...emptyUs }
  }

  const fdApiKey = process.env.FINANCIAL_DATASETS_API_KEY
  const usData = fdApiKey && company.ticker
    ? await fetchUsData(company.ticker, fdApiKey)
    : emptyUs

  return { company, fetchedAt, ...emptyKr, ...usData }
}
