import { NextRequest, NextResponse } from "next/server"
import { fetchFinancialStatements, getDartApiKey } from "@/lib/dartApi"

export async function GET(request: NextRequest) {
  const corpCode = request.nextUrl.searchParams.get("corp_code")?.trim()
  const year = request.nextUrl.searchParams.get("year")?.trim()
  const reportCode = request.nextUrl.searchParams.get("report_code")?.trim() ?? "11011"
  const fsDiv = request.nextUrl.searchParams.get("fs_div")?.trim() ?? "CFS"

  const VALID_REPORT_CODES = new Set(["11011", "11012", "11013", "11014"])
  const VALID_FS_DIVS = new Set(["CFS", "OFS"])

  if (!corpCode || !/^\d{8}$/.test(corpCode)) {
    return NextResponse.json(
      { error: "corp_code는 8자리 숫자여야 합니다" },
      { status: 400 }
    )
  }

  if (!year || !/^\d{4}$/.test(year)) {
    return NextResponse.json(
      { error: "year는 4자리 연도여야 합니다" },
      { status: 400 }
    )
  }

  if (!VALID_REPORT_CODES.has(reportCode)) {
    return NextResponse.json(
      { error: "report_code가 유효하지 않습니다 (11011, 11012, 11013, 11014)" },
      { status: 400 }
    )
  }

  if (!VALID_FS_DIVS.has(fsDiv)) {
    return NextResponse.json(
      { error: "fs_div가 유효하지 않습니다 (CFS, OFS)" },
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
    const data = await fetchFinancialStatements(apiKey, {
      corp_code: corpCode,
      bsns_year: year,
      reprt_code: reportCode,
      fs_div: fsDiv,
    })

    if (!data || data.status === "013") {
      return NextResponse.json({ items: [], message: "재무제표 데이터가 없습니다" })
    }

    return NextResponse.json({
      items: data.list ?? [],
      total: data.list?.length ?? 0,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "재무제표 조회 실패"
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
