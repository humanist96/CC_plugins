/** /dart: 커맨드 파서 + DART 데이터 → Claude 시스템 프롬프트 빌더 */

import { detectKoreanCompany, type DetectedCompany } from "@/lib/dartCompanyDetector"
import { fetchCompanyOverview, fetchDisclosures, fetchFinancialStatements, getDartApiKey } from "@/lib/dartApi"
import { formatKrwAmount, extractKeyMetrics, getCorpClsLabel, formatDate } from "@/lib/dartMapper"
import type { DartCompanyOverview, DartDisclosure, DartFinancialItem } from "@/types/dart"

const DART_CATEGORIES = ["재무제표", "기업개황", "공시", "분석"] as const
type DartCategory = (typeof DART_CATEGORIES)[number]

const DART_COMMAND_REGEX = /^\/dart:(\S+)\s+(.+)$/

/** 파싱된 DART 커맨드 */
export interface ParsedDartCommand {
  readonly category: DartCategory
  readonly companyQuery: string
}

/** buildDartEnrichedPrompt 반환 타입 */
export interface DartEnrichedPrompt {
  readonly systemPrompt: string
  readonly userPrompt: string
  readonly detectedCompany: DetectedCompany | null
}

const BASE_SYSTEM_PROMPT =
  "You are a finance assistant for Korean financial sales departments. " +
  "Answer directly from your knowledge. Do NOT attempt to use any tools. " +
  "Answer concisely in Korean when asked in Korean. " +
  "Focus on financial analysis, market insights, and sales support. " +
  "Use standard Korean financial terminology (매출액, 영업이익, 당기순이익, 자산총계 등)."

/**
 * /dart: 커맨드 파싱
 * @returns 파싱 결과 또는 null (커맨드가 아닌 경우)
 */
export function parseDartCommand(input: string): ParsedDartCommand | null {
  const match = input.trim().match(DART_COMMAND_REGEX)
  if (!match) return null

  const [, rawCategory, companyQuery] = match
  const category = rawCategory as string

  if (!DART_CATEGORIES.includes(category as DartCategory)) return null

  return {
    category: category as DartCategory,
    companyQuery: companyQuery.trim(),
  }
}

/**
 * DART 커맨드를 처리하여 enriched prompt 생성
 * - 기업 감지 → DART API fetch (5초 타임아웃) → 시스템 프롬프트 구성
 */
export async function buildDartEnrichedPrompt(
  parsed: ParsedDartCommand
): Promise<DartEnrichedPrompt> {
  const detected = detectKoreanCompany(parsed.companyQuery)

  if (!detected) {
    return {
      systemPrompt: BASE_SYSTEM_PROMPT,
      userPrompt: `"${parsed.companyQuery}" 기업을 찾을 수 없습니다. DART에 등록된 한국 상장 기업명(또는 별칭)을 입력해주세요.`,
      detectedCompany: null,
    }
  }

  const apiKey = getDartApiKey()
  if (!apiKey) {
    return {
      systemPrompt: BASE_SYSTEM_PROMPT,
      userPrompt: buildUserPrompt(parsed.category, detected.result.corp_name),
      detectedCompany: detected,
    }
  }

  try {
    const dartContext = await fetchWithTimeout(
      () => fetchDartData(parsed.category, detected.result.corp_code, apiKey),
      5000
    )

    const systemPrompt = dartContext
      ? `${BASE_SYSTEM_PROMPT}\n\n${dartContext}`
      : BASE_SYSTEM_PROMPT

    return {
      systemPrompt,
      userPrompt: buildUserPrompt(parsed.category, detected.result.corp_name),
      detectedCompany: detected,
    }
  } catch {
    return {
      systemPrompt: BASE_SYSTEM_PROMPT,
      userPrompt: buildUserPrompt(parsed.category, detected.result.corp_name),
      detectedCompany: detected,
    }
  }
}

/**
 * 일반 텍스트에서 한국 기업 자동 감지 시 간략한 DART 컨텍스트 생성
 */
export async function buildAutoDetectPrompt(
  input: string
): Promise<DartEnrichedPrompt | null> {
  const detected = detectKoreanCompany(input)
  if (!detected) return null

  const apiKey = getDartApiKey()
  if (!apiKey) return null

  try {
    const overview = await fetchWithTimeout(
      () => fetchCompanyOverview(detected.result.corp_code, apiKey),
      3000
    )

    if (!overview) return null

    const briefContext = formatBriefCompanyContext(overview)
    return {
      systemPrompt: `${BASE_SYSTEM_PROMPT}\n\n${briefContext}`,
      userPrompt: input,
      detectedCompany: detected,
    }
  } catch {
    return null
  }
}

/**
 * 사업보고서 조회 가능한 연도 결정
 * - 사업보고서(11011)는 보통 다음 해 3~4월에 공시
 * - 현재 월이 4월 이전이면 2년 전, 아니면 1년 전
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

  // Fallback: 1년 전
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

/** 카테고리별 DART 데이터 fetch → 포맷된 컨텍스트 문자열 */
async function fetchDartData(
  category: DartCategory,
  corpCode: string,
  apiKey: string
): Promise<string | null> {
  switch (category) {
    case "기업개황": {
      const overview = await fetchCompanyOverview(corpCode, apiKey)
      return overview ? formatOverviewContext(overview) : null
    }

    case "재무제표": {
      const [overview, { items, year }] = await Promise.all([
        fetchCompanyOverview(corpCode, apiKey),
        fetchFinancialsWithFallback(apiKey, corpCode),
      ])
      return formatFinancialContext(overview, items, year)
    }

    case "공시": {
      const [overview, disclosures] = await Promise.all([
        fetchCompanyOverview(corpCode, apiKey),
        fetchDisclosures(apiKey, {
          corp_code: corpCode,
          page_count: "10",
        }),
      ])
      return formatDisclosureContext(overview, disclosures?.list ?? null)
    }

    case "분석": {
      const [overview, { items, year }, disclosures] = await Promise.all([
        fetchCompanyOverview(corpCode, apiKey),
        fetchFinancialsWithFallback(apiKey, corpCode),
        fetchDisclosures(apiKey, {
          corp_code: corpCode,
          page_count: "10",
        }),
      ])
      return formatFullAnalysisContext(overview, items, disclosures?.list ?? null, year)
    }
  }
}

/** 기업개황 포맷 */
function formatOverviewContext(overview: DartCompanyOverview): string {
  return [
    `[DART 실시간 데이터: ${overview.corp_name}]`,
    "아래는 DART 전자공시시스템에서 조회한 실제 데이터입니다.",
    "",
    "■ 기업개황",
    `회사명: ${overview.corp_name} (${overview.corp_name_eng})`,
    `종목코드: ${overview.stock_code} | 시장: ${getCorpClsLabel(overview.corp_cls)}`,
    `대표자: ${overview.ceo_nm} | 설립일: ${formatDate(overview.est_dt)}`,
    `주소: ${overview.adres}`,
    overview.hm_url ? `홈페이지: ${overview.hm_url}` : "",
    `업종코드: ${overview.induty_code} | 결산월: ${overview.acc_mt}월`,
  ].filter(Boolean).join("\n")
}

/** 재무제표 포맷 */
function formatFinancialContext(
  overview: DartCompanyOverview | null,
  items: readonly DartFinancialItem[] | null,
  year: string
): string {
  const lines: string[] = []
  const corpName = overview?.corp_name ?? "해당 기업"

  lines.push(`[DART 실시간 데이터: ${corpName}]`)
  lines.push("아래는 DART 전자공시시스템에서 조회한 실제 데이터입니다.")
  lines.push("")

  if (overview) {
    lines.push("■ 기업개황")
    lines.push(`회사명: ${overview.corp_name} (${overview.corp_name_eng})`)
    lines.push(`종목코드: ${overview.stock_code} | 시장: ${getCorpClsLabel(overview.corp_cls)}`)
    lines.push(`대표자: ${overview.ceo_nm} | 설립일: ${formatDate(overview.est_dt)}`)
    lines.push("")
  }

  if (items && items.length > 0) {
    const keyMetrics = extractKeyMetrics(items)

    lines.push(`■ 주요재무지표 (${year} 사업보고서, 연결기준)`)
    for (const metric of keyMetrics) {
      const current = metric.thstrm !== null ? formatKrwAmount(metric.thstrm) : "-"
      const previous = metric.frmtrm !== null ? formatKrwAmount(metric.frmtrm) : "-"
      const yoy = metric.yoyChange !== null ? ` (YoY ${metric.yoyChange >= 0 ? "+" : ""}${metric.yoyChange.toFixed(1)}%)` : ""
      lines.push(`${metric.label}: ${current} / 전기 ${previous}${yoy}`)
    }
  } else {
    lines.push(`■ 재무제표: ${year}년 사업보고서 데이터를 조회할 수 없습니다.`)
  }

  return lines.join("\n")
}

/** 공시 포맷 */
function formatDisclosureContext(
  overview: DartCompanyOverview | null,
  disclosures: readonly DartDisclosure[] | null
): string {
  const lines: string[] = []
  const corpName = overview?.corp_name ?? "해당 기업"

  lines.push(`[DART 실시간 데이터: ${corpName}]`)
  lines.push("아래는 DART 전자공시시스템에서 조회한 실제 데이터입니다.")
  lines.push("")

  if (overview) {
    lines.push("■ 기업개황")
    lines.push(`회사명: ${overview.corp_name} | 시장: ${getCorpClsLabel(overview.corp_cls)}`)
    lines.push("")
  }

  if (disclosures && disclosures.length > 0) {
    lines.push(`■ 최근 공시 목록 (최근 ${disclosures.length}건)`)
    for (const d of disclosures) {
      lines.push(`- [${formatDate(d.rcept_dt)}] ${d.report_nm} (${d.flr_nm})`)
    }
  } else {
    lines.push("■ 최근 공시: 조회된 공시가 없습니다.")
  }

  return lines.join("\n")
}

/** 종합 분석 포맷 */
function formatFullAnalysisContext(
  overview: DartCompanyOverview | null,
  items: readonly DartFinancialItem[] | null,
  disclosures: readonly DartDisclosure[] | null,
  year: string
): string {
  const lines: string[] = []
  const corpName = overview?.corp_name ?? "해당 기업"

  lines.push(`[DART 실시간 데이터: ${corpName}]`)
  lines.push("아래는 DART 전자공시시스템에서 조회한 실제 데이터입니다.")
  lines.push("")

  if (overview) {
    lines.push("■ 기업개황")
    lines.push(`회사명: ${overview.corp_name} (${overview.corp_name_eng})`)
    lines.push(`종목코드: ${overview.stock_code} | 시장: ${getCorpClsLabel(overview.corp_cls)}`)
    lines.push(`대표자: ${overview.ceo_nm} | 설립일: ${formatDate(overview.est_dt)}`)
    lines.push(`주소: ${overview.adres}`)
    lines.push("")
  }

  if (items && items.length > 0) {
    const keyMetrics = extractKeyMetrics(items)
    lines.push(`■ 주요재무지표 (${year} 사업보고서, 연결기준)`)
    for (const metric of keyMetrics) {
      const current = metric.thstrm !== null ? formatKrwAmount(metric.thstrm) : "-"
      const previous = metric.frmtrm !== null ? formatKrwAmount(metric.frmtrm) : "-"
      const yoy = metric.yoyChange !== null ? ` (YoY ${metric.yoyChange >= 0 ? "+" : ""}${metric.yoyChange.toFixed(1)}%)` : ""
      lines.push(`${metric.label}: ${current} / 전기 ${previous}${yoy}`)
    }
    lines.push("")
  }

  if (disclosures && disclosures.length > 0) {
    lines.push(`■ 최근 공시 (최근 ${Math.min(disclosures.length, 5)}건)`)
    for (const d of disclosures.slice(0, 5)) {
      lines.push(`- [${formatDate(d.rcept_dt)}] ${d.report_nm}`)
    }
  }

  return lines.join("\n")
}

/** 자동 감지 모드용 간략 기업 컨텍스트 */
function formatBriefCompanyContext(overview: DartCompanyOverview): string {
  return [
    `[DART 참고: ${overview.corp_name}]`,
    `회사명: ${overview.corp_name} (${overview.corp_name_eng})`,
    `종목코드: ${overview.stock_code} | 시장: ${getCorpClsLabel(overview.corp_cls)}`,
    `대표자: ${overview.ceo_nm} | 설립일: ${formatDate(overview.est_dt)}`,
    `결산월: ${overview.acc_mt}월`,
    "위 정보는 DART 전자공시시스템 기준입니다. 재무 수치가 필요하면 /dart:재무제표 커맨드를 안내해주세요.",
  ].join("\n")
}

/** 카테고리 → Claude에게 전달할 자연어 프롬프트 */
function buildUserPrompt(category: DartCategory, corpName: string): string {
  const prompts: Readonly<Record<DartCategory, string>> = {
    재무제표: `${corpName}의 재무제표를 분석해주세요. 위 DART 데이터를 근거로 매출, 영업이익, 순이익 추이와 재무 건전성을 평가해주세요.`,
    기업개황: `${corpName} 기업 개요를 정리해주세요. 위 DART 데이터를 참고하세요.`,
    공시: `${corpName}의 최근 공시 내용을 요약하고 주요 시사점을 분석해주세요.`,
    분석: `${corpName}에 대한 종합 분석을 해주세요. 기업개황, 재무제표, 최근 공시를 포함하여 투자 관점에서 평가해주세요.`,
  }
  return prompts[category]
}

/** Promise에 타임아웃 적용 */
async function fetchWithTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number
): Promise<T> {
  return Promise.race([
    fn(),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("DART API timeout")), timeoutMs)
    ),
  ])
}
