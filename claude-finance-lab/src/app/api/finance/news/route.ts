import { NextRequest, NextResponse } from "next/server"
import type { FDNewsResponse } from "@/types/financialDatasets"

const BASE_URL = "https://api.financialdatasets.ai"
const ALLOWED_TICKERS = new Set(["AAPL", "GOOGL", "MSFT", "NVDA", "TSLA"])

export async function GET(request: NextRequest) {
  const ticker = request.nextUrl.searchParams.get("ticker")?.toUpperCase()
  const limit = request.nextUrl.searchParams.get("limit") ?? "5"

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
    const res = await fetch(
      `${BASE_URL}/news/?ticker=${ticker}&limit=${limit}`,
      {
        headers: { "X-API-KEY": apiKey },
        next: { revalidate: 300 },
      }
    )

    if (!res.ok) {
      return NextResponse.json(
        { error: "뉴스 데이터를 조회할 수 없습니다." },
        { status: res.status }
      )
    }

    const data = (await res.json()) as FDNewsResponse
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류"
    return NextResponse.json(
      { error: `뉴스 조회 실패: ${message}` },
      { status: 502 }
    )
  }
}
