import { NextRequest, NextResponse } from "next/server"
import type {
  FDPriceSnapshot,
  FDCompanyFacts,
  FDFinancialMetricsSnapshot,
  QuoteApiResponse,
} from "@/types/financialDatasets"

const BASE_URL = "https://api.financialdatasets.ai"
const ALLOWED_TICKERS = new Set(["AAPL", "GOOGL", "MSFT", "NVDA", "TSLA"])

async function fetchFD<T>(path: string, apiKey: string): Promise<T | null> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "X-API-KEY": apiKey },
    next: { revalidate: 60 },
  })
  if (!res.ok) return null
  return res.json() as Promise<T>
}

export async function GET(request: NextRequest) {
  const ticker = request.nextUrl.searchParams.get("ticker")?.toUpperCase()

  if (!ticker || !ALLOWED_TICKERS.has(ticker)) {
    return NextResponse.json(
      { error: `지원하지 않는 티커입니다. 지원 목록: ${[...ALLOWED_TICKERS].join(", ")}` },
      { status: 400 }
    )
  }

  const apiKey = process.env.FINANCIAL_DATASETS_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key가 설정되지 않았습니다." },
      { status: 500 }
    )
  }

  try {
    const [priceData, companyData, metricsData] = await Promise.all([
      fetchFD<FDPriceSnapshot>(`/prices/snapshot?ticker=${ticker}`, apiKey),
      fetchFD<FDCompanyFacts>(`/company/facts?ticker=${ticker}`, apiKey),
      fetchFD<FDFinancialMetricsSnapshot>(`/financial-metrics/snapshot?ticker=${ticker}`, apiKey),
    ])

    const response: QuoteApiResponse = {
      ticker,
      price: priceData?.snapshot ?? null,
      company: companyData?.company_facts ?? null,
      metrics: metricsData?.financial_metrics ?? null,
    }

    return NextResponse.json(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류"
    return NextResponse.json(
      { error: `데이터 조회 실패: ${message}` },
      { status: 502 }
    )
  }
}
