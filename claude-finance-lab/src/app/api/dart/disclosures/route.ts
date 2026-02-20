import { NextRequest, NextResponse } from "next/server"
import { fetchDisclosures, getDartApiKey } from "@/lib/dartApi"

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

  const params: Record<string, string> = { corp_code: corpCode }

  // 기본 날짜 범위: 최근 1년
  const now = new Date()
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
  const defaultBgnDe = oneYearAgo.toISOString().slice(0, 10).replace(/-/g, "")
  const defaultEndDe = now.toISOString().slice(0, 10).replace(/-/g, "")

  const bgnDe = request.nextUrl.searchParams.get("bgn_de") ?? defaultBgnDe
  const endDe = request.nextUrl.searchParams.get("end_de") ?? defaultEndDe
  const pblntfTy = request.nextUrl.searchParams.get("pblntf_ty")
  const pageNo = request.nextUrl.searchParams.get("page_no")
  const pageCount = request.nextUrl.searchParams.get("page_count")

  params.bgn_de = bgnDe
  params.end_de = endDe
  if (pblntfTy) params.pblntf_ty = pblntfTy
  if (pageNo) params.page_no = pageNo
  params.page_count = pageCount ?? "20"

  try {
    const data = await fetchDisclosures(apiKey, params)

    if (!data || data.status === "013") {
      return NextResponse.json({ disclosures: [], total: 0 })
    }

    return NextResponse.json({
      disclosures: data.list ?? [],
      total: data.list?.length ?? 0,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "공시 조회 실패"
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
