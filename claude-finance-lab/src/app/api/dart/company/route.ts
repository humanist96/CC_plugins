import { NextRequest, NextResponse } from "next/server"
import { fetchCompanyOverview, getDartApiKey } from "@/lib/dartApi"

export async function GET(request: NextRequest) {
  const corpCode = request.nextUrl.searchParams.get("corp_code")?.trim()

  if (!corpCode || !/^\d{8}$/.test(corpCode)) {
    return NextResponse.json(
      { error: "corp_code는 8자리 숫자여야 합니다" },
      { status: 400 }
    )
  }

  const apiKey = getDartApiKey()
  if (!apiKey) {
    return NextResponse.json(
      { error: "DART API 키가 설정되지 않았습니다" },
      { status: 500 }
    )
  }

  try {
    const data = await fetchCompanyOverview(corpCode, apiKey)
    if (!data) {
      return NextResponse.json(
        { error: "기업 정보를 찾을 수 없습니다" },
        { status: 404 }
      )
    }
    return NextResponse.json({ company: data })
  } catch (error) {
    const message = error instanceof Error ? error.message : "조회 실패"
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
