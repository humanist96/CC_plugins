/** /report 커맨드 파서 + 진입점 */

import { resolveCompany, type ResolvedCompany } from "@/lib/reportCompanyResolver"
import { fetchReportData } from "@/lib/reportDataFetcher"
import { buildReportPrompts, buildNotFoundPrompts, type ReportPrompts } from "@/lib/reportPromptBuilder"

const REPORT_COMMAND_REGEX = /^\/report\s+(.+)$/i

export interface ReportEnrichedPrompt {
  readonly systemPrompt: string
  readonly userPrompt: string
  readonly resolvedCompany: ResolvedCompany | null
}

/** /report 커맨드에서 기업 쿼리 추출. 커맨드가 아니면 null */
export function parseReportCommand(input: string): string | null {
  const match = input.trim().match(REPORT_COMMAND_REGEX)
  return match ? match[1].trim() : null
}

/**
 * 기업 쿼리 → company resolve → data fetch → prompt build
 * - 기업 못 찾으면 안내 메시지 반환
 * - API 실패 시에도 Claude 지식 기반 응답 가능
 */
export async function buildReportEnrichedPrompt(
  companyQuery: string
): Promise<ReportEnrichedPrompt> {
  const company = resolveCompany(companyQuery)

  if (!company) {
    const prompts = buildNotFoundPrompts(companyQuery)
    return { ...prompts, resolvedCompany: null }
  }

  try {
    const reportData = await fetchReportData(company)
    const prompts: ReportPrompts = buildReportPrompts(reportData)

    return {
      systemPrompt: prompts.systemPrompt,
      userPrompt: prompts.userPrompt,
      resolvedCompany: company,
    }
  } catch {
    // 전체 실패 시에도 Claude가 지식 기반으로 응답
    const fallbackPrompts = buildReportPrompts({
      company,
      fetchedAt: new Date().toISOString(),
      dartOverview: null,
      dartFinancials: null,
      dartDisclosures: null,
      priceSnapshot: null,
      companyFacts: null,
      financialMetrics: null,
      news: null,
    })

    return {
      ...fallbackPrompts,
      resolvedCompany: company,
    }
  }
}
