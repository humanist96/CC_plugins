import { NextRequest, NextResponse } from "next/server"
import type { FDNewsResponse } from "@/types/financialDatasets"

const BASE_URL = "https://api.financialdatasets.ai"

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function isValidDate(dateStr: string): boolean {
  if (!DATE_RE.test(dateStr)) return false
  const date = new Date(`${dateStr}T00:00:00Z`)
  return !isNaN(date.getTime()) && date.toISOString().startsWith(dateStr)
}

export async function GET(request: NextRequest) {
  const ticker = request.nextUrl.searchParams.get("ticker")?.toUpperCase()
  const rawLimit = request.nextUrl.searchParams.get("limit") ?? "5"
  const startDate = request.nextUrl.searchParams.get("start_date")
  const endDate = request.nextUrl.searchParams.get("end_date")

  if (!ticker || !/^[A-Z]{1,5}$/.test(ticker)) {
    return NextResponse.json(
      { error: "유효한 US 티커를 입력해주세요 (1~5자 영문)" },
      { status: 400 }
    )
  }

  const parsedLimit = parseInt(rawLimit, 10)
  if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 50) {
    return NextResponse.json(
      { error: "limit은 1~50 사이의 정수여야 합니다." },
      { status: 400 }
    )
  }
  const limit = String(parsedLimit)

  if ((startDate && !isValidDate(startDate)) || (endDate && !isValidDate(endDate))) {
    return NextResponse.json(
      { error: "유효하지 않은 날짜입니다. YYYY-MM-DD 형식을 사용하세요." },
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
    const params = new URLSearchParams({ ticker, limit })
    if (startDate) params.set("start_date", startDate)
    if (endDate) params.set("end_date", endDate)

    const res = await fetch(
      `${BASE_URL}/news/?${params.toString()}`,
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
