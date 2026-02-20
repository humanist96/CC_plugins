/** 수집된 ReportData → Claude 시스템/유저 프롬프트 빌더 */

import type { ReportData } from "@/lib/reportDataFetcher"
import { formatKrwAmount, extractKeyMetrics, getCorpClsLabel, formatDate } from "@/lib/dartMapper"

export interface ReportPrompts {
  readonly systemPrompt: string
  readonly userPrompt: string
}

const BASE_SYSTEM_PROMPT =
  "You are a senior financial analyst producing comprehensive company analysis reports. " +
  "Answer directly from your knowledge and the provided data. Do NOT attempt to use any tools. " +
  "Answer in Korean. Use markdown formatting for the report structure. " +
  "Use standard Korean financial terminology (매출액, 영업이익, 당기순이익, 자산총계 등). " +
  "When real data is provided, always cite specific numbers from the data."

function formatUsdAmount(amount: number | null | undefined): string {
  if (amount == null) return "-"
  const abs = Math.abs(amount)
  const sign = amount < 0 ? "-" : ""
  if (abs >= 1_000_000_000_000) return `${sign}$${(abs / 1_000_000_000_000).toFixed(2)}T`
  if (abs >= 1_000_000_000) return `${sign}$${(abs / 1_000_000_000).toFixed(2)}B`
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`
  return `${sign}$${abs.toLocaleString("en-US")}`
}

function formatPercent(value: number | null | undefined): string {
  if (value == null) return "-"
  return `${(value * 100).toFixed(1)}%`
}

function formatNumber(value: number | null | undefined, decimals = 2): string {
  if (value == null) return "-"
  return value.toFixed(decimals)
}

function formatVolume(vol: number | null | undefined): string {
  if (!vol) return "-"
  if (vol >= 1_000_000) return `${(vol / 1_000_000).toFixed(1)}M`
  if (vol >= 1_000) return `${(vol / 1_000).toFixed(1)}K`
  return String(vol)
}

/** KR 기업용 시스템 프롬프트 데이터 블록 */
function buildKrDataContext(data: ReportData): string {
  const lines: string[] = []
  const displayName = data.company.displayName

  lines.push(`[종합 분석 리포트 데이터: ${displayName}]`)
  lines.push("아래는 DART 전자공시시스템에서 조회한 실제 데이터입니다.")
  lines.push("")

  // 기업개황
  const ov = data.dartOverview
  if (ov) {
    lines.push("■ 기업개황")
    lines.push(`회사명: ${ov.corp_name} (${ov.corp_name_eng})`)
    lines.push(`종목코드: ${ov.stock_code} | 시장: ${getCorpClsLabel(ov.corp_cls)}`)
    lines.push(`대표자: ${ov.ceo_nm} | 설립일: ${formatDate(ov.est_dt)}`)
    lines.push(`주소: ${ov.adres}`)
    if (ov.hm_url) lines.push(`홈페이지: ${ov.hm_url}`)
    lines.push(`업종코드: ${ov.induty_code} | 결산월: ${ov.acc_mt}월`)
    lines.push("")
  }

  // 재무지표
  const fin = data.dartFinancials
  if (fin?.items && fin.items.length > 0) {
    const keyMetrics = extractKeyMetrics(fin.items)
    lines.push(`■ 주요재무지표 (${fin.year} 사업보고서, 연결기준)`)
    for (const m of keyMetrics) {
      const current = m.thstrm !== null ? formatKrwAmount(m.thstrm) : "-"
      const previous = m.frmtrm !== null ? formatKrwAmount(m.frmtrm) : "-"
      const yoy = m.yoyChange !== null
        ? ` (YoY ${m.yoyChange >= 0 ? "+" : ""}${m.yoyChange.toFixed(1)}%)`
        : ""
      lines.push(`${m.label}: ${current} / 전기 ${previous}${yoy}`)
    }
    lines.push("")
  }

  // 공시
  const disc = data.dartDisclosures
  if (disc && disc.length > 0) {
    lines.push(`■ 최근 공시 (${disc.length}건)`)
    for (const d of disc) {
      lines.push(`- [${formatDate(d.rcept_dt)}] ${d.report_nm} (${d.flr_nm})`)
    }
    lines.push("")
  }

  return lines.join("\n")
}

/** US 기업용 시스템 프롬프트 데이터 블록 */
function buildUsDataContext(data: ReportData): string {
  const lines: string[] = []
  const ticker = data.company.ticker ?? ""
  const displayName = data.company.displayName

  lines.push(`[Company Analysis Report Data: ${displayName} (${ticker})]`)
  lines.push("Below is real-time data from Financial Datasets API.")
  lines.push("")

  // Company Profile
  const cf = data.companyFacts
  if (cf) {
    lines.push("■ Company Profile")
    lines.push(`Name: ${cf.name} | Sector: ${cf.sector} | Exchange: ${cf.exchange}`)
    lines.push(`Market Cap: ${formatUsdAmount(cf.market_cap)} | Employees: ${cf.number_of_employees?.toLocaleString("en-US") ?? "-"}`)
    if (cf.website_url) lines.push(`Website: ${cf.website_url}`)
    lines.push("")
  }

  // Stock Price
  const ps = data.priceSnapshot
  if (ps) {
    const changeSign = ps.day_change >= 0 ? "+" : ""
    lines.push("■ Stock Price")
    lines.push(`Price: $${ps.price.toFixed(2)} | Change: ${changeSign}$${ps.day_change.toFixed(2)} (${changeSign}${ps.day_change_percent.toFixed(2)}%) | Volume: ${formatVolume(ps.volume)}`)
    lines.push("")
  }

  // Financial Metrics
  const fm = data.financialMetrics
  if (fm) {
    lines.push("■ Financial Metrics")
    lines.push(`P/E: ${formatNumber(fm.price_to_earnings_ratio)} | P/B: ${formatNumber(fm.price_to_book_ratio)} | EPS: $${formatNumber(fm.earnings_per_share)}`)
    lines.push(`ROE: ${formatPercent(fm.return_on_equity)} | Gross Margin: ${formatPercent(fm.gross_margin)} | Net Margin: ${formatPercent(fm.net_margin)}`)
    lines.push(`Revenue Growth: ${formatPercent(fm.revenue_growth)} | Debt/Equity: ${formatNumber(fm.debt_to_equity)}`)
    lines.push("")
  }

  // News
  const news = data.news
  if (news && news.length > 0) {
    lines.push("■ Recent News")
    for (const n of news) {
      const sentiment = n.sentiment ? ` (${n.sentiment})` : ""
      lines.push(`- [${n.date}] ${n.title}${sentiment}`)
    }
    lines.push("")
  }

  return lines.join("\n")
}

/** KR 리포트 유저 프롬프트 */
function buildKrUserPrompt(displayName: string): string {
  const today = new Date().toISOString().slice(0, 10)
  return [
    `${displayName}에 대한 종합 분석 리포트를 작성해주세요.`,
    "",
    "다음 구조를 따라주세요:",
    "# {기업명} 종합 분석 리포트",
    "## 1. 기업 개요",
    "## 2. 주요 재무 분석 (매출/영업이익/순이익/자산 추이 + YoY)",
    "## 3. 최근 공시 분석 (주요 공시 요약 및 시사점)",
    "## 4. 투자 리스크 & 기회",
    "## 5. 종합 투자 의견",
    "",
    `보고서 말미에: *보고서 생성일: ${today} | 데이터 출처: DART 전자공시시스템*`,
    "",
    "위에 제공된 실제 DART 데이터를 근거로 구체적인 수치를 인용하며 분석해주세요.",
  ].join("\n")
}

/** US 리포트 유저 프롬프트 */
function buildUsUserPrompt(displayName: string, ticker: string): string {
  const today = new Date().toISOString().slice(0, 10)
  return [
    `${displayName} (${ticker})에 대한 종합 분석 리포트를 한국어로 작성해주세요.`,
    "",
    "다음 구조를 따라주세요:",
    `# ${displayName} (${ticker}) 종합 분석 리포트`,
    "## 1. 기업 개요",
    "## 2. 주가 현황 (가격, 변동률, 거래량, 시가총액)",
    "## 3. 재무 지표 분석 (P/E, ROE, 마진, 성장률)",
    "## 4. 최근 뉴스 & 시장 반응",
    "## 5. 투자 리스크 & 기회",
    "## 6. 종합 투자 의견",
    "",
    `보고서 말미에: *보고서 생성일: ${today} | 데이터 출처: Financial Datasets API*`,
    "",
    "위에 제공된 실제 데이터를 근거로 구체적인 수치를 인용하며 분석해주세요.",
  ].join("\n")
}

/** ReportData → 시스템 프롬프트 + 유저 프롬프트 */
export function buildReportPrompts(data: ReportData): ReportPrompts {
  const { company } = data

  if (company.region === "KR") {
    const dataContext = buildKrDataContext(data)
    const systemPrompt = dataContext
      ? `${BASE_SYSTEM_PROMPT}\n\n${dataContext}`
      : BASE_SYSTEM_PROMPT

    return {
      systemPrompt,
      userPrompt: buildKrUserPrompt(company.displayName),
    }
  }

  const dataContext = buildUsDataContext(data)
  const systemPrompt = dataContext
    ? `${BASE_SYSTEM_PROMPT}\n\n${dataContext}`
    : BASE_SYSTEM_PROMPT

  return {
    systemPrompt,
    userPrompt: buildUsUserPrompt(company.displayName, company.ticker ?? ""),
  }
}

/** 기업을 찾을 수 없을 때의 폴백 프롬프트 */
export function buildNotFoundPrompts(query: string): ReportPrompts {
  return {
    systemPrompt: BASE_SYSTEM_PROMPT,
    userPrompt: [
      `"${query}" 기업을 찾을 수 없습니다.`,
      "",
      "한국 상장기업 또는 미국 주요 기업명(AAPL, GOOGL, MSFT, NVDA, TSLA)을 입력해주세요.",
      "",
      "예시:",
      "- /report 삼성전자",
      "- /report AAPL",
      "- /report 엔비디아",
    ].join("\n"),
  }
}

/** API 키 없을 때의 폴백 프롬프트 (Claude 지식 기반 응답) */
export function buildNoApiKeyPrompts(displayName: string, region: "KR" | "US"): ReportPrompts {
  const userPrompt = region === "KR"
    ? buildKrUserPrompt(displayName)
    : buildUsUserPrompt(displayName, "")

  return {
    systemPrompt: BASE_SYSTEM_PROMPT + "\n\n참고: 실시간 데이터를 조회할 수 없습니다. 보유하고 있는 지식을 기반으로 분석해주세요.",
    userPrompt,
  }
}
