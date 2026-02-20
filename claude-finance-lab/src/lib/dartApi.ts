/** DART OpenAPI 서버사이드 클라이언트 */

import type { DartApiResponse, DartCompanyOverview, DartDisclosure, DartFinancialItem } from "@/types/dart"

const DART_BASE_URL = "https://opendart.fss.or.kr/api"

/** DART API 상태코드 → 에러 메시지 매핑 */
const STATUS_MESSAGES: Readonly<Record<string, string>> = {
  "000": "정상",
  "010": "등록되지 않은 인증키",
  "011": "사용할 수 없는 인증키",
  "013": "조회된 데이터가 없습니다",
  "020": "요청 제한 초과",
  "100": "필수 파라미터 누락",
  "800": "시스템 점검 중",
  "900": "정의되지 않은 오류",
}

interface FetchDartOptions {
  readonly revalidate?: number
  readonly params?: Readonly<Record<string, string>>
}

/**
 * DART API 공통 fetcher
 * - rate limit 고려: Next.js revalidate 캐시로 중복 요청 방지
 * - DART 상태코드 "000"만 성공, 나머지는 에러 또는 빈 결과 처리
 */
export async function fetchDart<T>(
  endpoint: string,
  apiKey: string,
  options: FetchDartOptions = {}
): Promise<DartApiResponse<T> | null> {
  const { revalidate = 3600, params = {} } = options

  const url = new URL(`${DART_BASE_URL}${endpoint}.json`)
  url.searchParams.set("crtfc_key", apiKey)
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value)
  }

  const res = await fetch(url.toString(), {
    next: { revalidate },
  })

  if (!res.ok) return null

  const data = (await res.json()) as DartApiResponse<T>

  if (data.status === "013") {
    return { status: "013", message: STATUS_MESSAGES["013"] ?? "데이터 없음" }
  }

  if (data.status !== "000") {
    const msg = STATUS_MESSAGES[data.status] ?? data.message ?? "알 수 없는 오류"
    throw new Error(`DART API 오류 [${data.status}]: ${msg}`)
  }

  return data
}

/**
 * 기업개황 조회
 * @see https://opendart.fss.or.kr/guide/detail.do?apiGrpCd=DS001&apiId=2019001
 */
export async function fetchCompanyOverview(
  corpCode: string,
  apiKey: string
): Promise<DartCompanyOverview | null> {
  const url = new URL(`${DART_BASE_URL}/company.json`)
  url.searchParams.set("crtfc_key", apiKey)
  url.searchParams.set("corp_code", corpCode)

  const res = await fetch(url.toString(), {
    next: { revalidate: 86400 }, // 24시간 캐시
  })

  if (!res.ok) return null

  const data = (await res.json()) as DartCompanyOverview

  if (data.status !== "000") return null

  return data
}

/**
 * 공시 검색
 * @see https://opendart.fss.or.kr/guide/detail.do?apiGrpCd=DS001&apiId=2019001
 */
export async function fetchDisclosures(
  apiKey: string,
  params: Readonly<Record<string, string>>
): Promise<DartApiResponse<DartDisclosure> | null> {
  return fetchDart<DartDisclosure>("/list", apiKey, {
    revalidate: 3600, // 1시간 캐시
    params,
  })
}

/**
 * 재무제표 조회 (단일회사 전체 재무제표)
 * @see https://opendart.fss.or.kr/guide/detail.do?apiGrpCd=DS003&apiId=2019020
 */
export async function fetchFinancialStatements(
  apiKey: string,
  params: {
    readonly corp_code: string
    readonly bsns_year: string
    readonly reprt_code: string
    readonly fs_div: string
  }
): Promise<DartApiResponse<DartFinancialItem> | null> {
  return fetchDart<DartFinancialItem>("/fnlttSinglAcntAll", apiKey, {
    revalidate: 21600, // 6시간 캐시
    params: {
      corp_code: params.corp_code,
      bsns_year: params.bsns_year,
      reprt_code: params.reprt_code,
      fs_div: params.fs_div,
    },
  })
}

/** DART API 키 가져오기 */
export function getDartApiKey(): string | undefined {
  return process.env.DART_API_KEY
}
