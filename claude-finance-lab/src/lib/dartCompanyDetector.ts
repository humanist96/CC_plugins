/** 한국 기업명 감지기 — 사용자 입력에서 한국 기업 참조 추출 */

import { POPULAR_CORP_CODES, CORP_ALIASES } from "@/data/dartCorpCodes"
import type { DartSearchResult } from "@/types/dart"

/** 입력 텍스트에서 한국 기업 감지 결과 */
export interface DetectedCompany {
  readonly query: string           // 감지된 원본 텍스트
  readonly result: DartSearchResult
}

/**
 * 사용자 입력에서 한국 기업명을 감지
 * 별칭, 정식 명칭 모두 탐색
 * @returns 감지된 첫 번째 기업 (없으면 null)
 */
export function detectKoreanCompany(input: string): DetectedCompany | null {
  const normalized = input.trim()
  if (!normalized) return null

  // 1. 별칭에서 먼저 검색 (짧은 별칭이 더 구체적)
  for (const [alias, corpName] of Object.entries(CORP_ALIASES)) {
    if (normalized.includes(alias)) {
      const match = POPULAR_CORP_CODES.find((c) => c.corp_name === corpName)
      if (match) {
        return {
          query: alias,
          result: {
            corp_code: match.corp_code,
            corp_name: match.corp_name,
            stock_code: match.stock_code,
          },
        }
      }
    }
  }

  // 2. 정식 기업명에서 검색 (긴 이름 우선 — 부분 매칭 방지)
  const sortedCorps = [...POPULAR_CORP_CODES].sort(
    (a, b) => b.corp_name.length - a.corp_name.length
  )

  for (const corp of sortedCorps) {
    if (normalized.includes(corp.corp_name)) {
      return {
        query: corp.corp_name,
        result: {
          corp_code: corp.corp_code,
          corp_name: corp.corp_name,
          stock_code: corp.stock_code,
        },
      }
    }
  }

  return null
}
