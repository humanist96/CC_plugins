/** DART 데이터 → 표시용 변환 유틸리티 */

import type { DartFinancialItem, DartKeyAccount, FinancialTableData, FinancialTableRow } from "@/types/dart"

/** 금액을 한국식으로 포맷 (억원 단위) */
export function formatKrwAmount(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "-"

  const absAmount = Math.abs(amount)
  const sign = amount < 0 ? "-" : ""

  if (absAmount >= 1_0000_0000_0000) {
    return `${sign}${(absAmount / 1_0000_0000_0000).toFixed(1)}조`
  }
  if (absAmount >= 1_0000_0000) {
    return `${sign}${(absAmount / 1_0000_0000).toFixed(0)}억`
  }
  if (absAmount >= 1_0000) {
    return `${sign}${(absAmount / 1_0000).toFixed(0)}만`
  }
  return `${sign}${absAmount.toLocaleString("ko-KR")}`
}

/** 문자열 금액 파싱 (DART에서 문자열로 옴) */
function parseAmount(str: string | undefined | null): number | null {
  if (!str || str === "-" || str.trim() === "") return null
  const cleaned = str.replace(/,/g, "").trim()
  const num = Number(cleaned)
  return Number.isNaN(num) ? null : num
}

/** YoY 변화율 계산 */
function calcYoY(current: number | null, previous: number | null): number | null {
  if (current === null || previous === null || previous === 0) return null
  return ((current - previous) / Math.abs(previous)) * 100
}

/** sj_div 코드 → 한글 명칭 */
const SJ_DIV_LABELS: Readonly<Record<string, string>> = {
  BS: "재무상태표",
  IS: "손익계산서",
  CIS: "포괄손익계산서",
  CF: "현금흐름표",
  SCE: "자본변동표",
}

/** 보고서 코드 → 한글 명칭 */
export function getReportLabel(code: string): string {
  const labels: Readonly<Record<string, string>> = {
    "11013": "1분기보고서",
    "11012": "반기보고서",
    "11014": "3분기보고서",
    "11011": "사업보고서",
  }
  return labels[code] ?? code
}

/** 시장구분 코드 → 한글 명칭 */
export function getCorpClsLabel(cls: string): string {
  const labels: Readonly<Record<string, string>> = {
    Y: "유가증권",
    K: "코스닥",
    N: "코넥스",
    E: "기타",
  }
  return labels[cls] ?? cls
}

/** 설립일 포맷 (YYYYMMDD → YYYY.MM.DD) */
export function formatDate(dateStr: string): string {
  if (!dateStr || dateStr.length !== 8) return dateStr
  return `${dateStr.slice(0, 4)}.${dateStr.slice(4, 6)}.${dateStr.slice(6, 8)}`
}

/** 재무제표 항목 → sj_div별 그룹핑 후 테이블 데이터로 변환 */
export function mapFinancialItemsToTableData(
  items: readonly DartFinancialItem[]
): readonly FinancialTableData[] {
  const grouped = new Map<string, DartFinancialItem[]>()

  for (const item of items) {
    const existing = grouped.get(item.sj_div)
    if (existing) {
      existing.push(item)
    } else {
      grouped.set(item.sj_div, [item])
    }
  }

  const result: FinancialTableData[] = []

  for (const [sjDiv, groupItems] of grouped.entries()) {
    const sorted = [...groupItems].sort((a, b) => Number(a.ord) - Number(b.ord))
    const first = sorted[0]

    const rows: FinancialTableRow[] = sorted.map((item) => ({
      accountName: item.account_nm,
      thstrm: formatKrwAmount(parseAmount(item.thstrm_amount)),
      frmtrm: formatKrwAmount(parseAmount(item.frmtrm_amount)),
      bfefrmtrm: formatKrwAmount(parseAmount(item.bfefrmtrm_amount)),
      thstrmRaw: parseAmount(item.thstrm_amount),
      frmtrmRaw: parseAmount(item.frmtrm_amount),
      bfefrmtrmRaw: parseAmount(item.bfefrmtrm_amount),
    }))

    result.push({
      sjDiv,
      sjName: SJ_DIV_LABELS[sjDiv] ?? first?.sj_nm ?? sjDiv,
      rows,
      thstrmName: first?.thstrm_nm ?? "당기",
      frmtrmName: first?.frmtrm_nm ?? "전기",
      bfefrmtrmName: first?.bfefrmtrm_nm ?? "전전기",
    })
  }

  return result
}

/** 주요 계정 추출 (매출, 영업이익, 순이익, 자산총계) */
export function extractKeyMetrics(
  items: readonly DartFinancialItem[]
): readonly DartKeyAccount[] {
  const KEY_ACCOUNTS: readonly { readonly keyword: string; readonly label: string }[] = [
    { keyword: "매출액", label: "매출액" },
    { keyword: "영업이익", label: "영업이익" },
    { keyword: "당기순이익", label: "당기순이익" },
    { keyword: "자산총계", label: "자산총계" },
  ]

  return KEY_ACCOUNTS.map(({ keyword, label }) => {
    const item = items.find((i) =>
      i.account_nm === keyword ||
      (i.account_nm.includes(keyword) && !i.account_nm.includes("("))
    )

    if (!item) {
      return { label, thstrm: null, frmtrm: null, bfefrmtrm: null, yoyChange: null }
    }

    const thstrm = parseAmount(item.thstrm_amount)
    const frmtrm = parseAmount(item.frmtrm_amount)
    const bfefrmtrm = parseAmount(item.bfefrmtrm_amount)

    return {
      label,
      thstrm,
      frmtrm,
      bfefrmtrm,
      yoyChange: calcYoY(thstrm, frmtrm),
    }
  })
}
