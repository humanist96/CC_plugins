import { NextRequest, NextResponse } from "next/server"
import { searchByName, resolveByStockCode } from "@/lib/dartCorpCodeResolver"
import { getDartApiKey } from "@/lib/dartApi"

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim()
  const stockCode = request.nextUrl.searchParams.get("stock_code")?.trim()

  if (!query && !stockCode) {
    return NextResponse.json(
      { error: "q 또는 stock_code 파라미터가 필요합니다" },
      { status: 400 }
    )
  }

  const apiKey = getDartApiKey()

  try {
    if (stockCode) {
      const result = await resolveByStockCode(stockCode, apiKey)
      return NextResponse.json({ results: result ? [result] : [] })
    }

    const results = await searchByName(query!, apiKey)
    return NextResponse.json({ results })
  } catch (error) {
    const message = error instanceof Error ? error.message : "검색 실패"
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
