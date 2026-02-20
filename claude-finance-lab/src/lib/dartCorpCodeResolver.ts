/** 기업코드 해석기 — 정적 매핑 + DART corpCode.xml 동적 조회 */

import type { DartCorpCode, DartSearchResult } from "@/types/dart"
import { POPULAR_CORP_CODES, CORP_ALIASES } from "@/data/dartCorpCodes"

/** 모듈 레벨 캐시 (7일 TTL) — 동시 요청 중복 방지를 위해 Promise 기반 */
let corpCodePromise: Promise<Map<string, DartCorpCode>> | null = null
let corpCodePromiseExpiry = 0
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000

/** 정적 매핑에서 이름으로 검색 */
function searchStaticByName(query: string): readonly DartSearchResult[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return []

  // 별칭 우선 확인
  const aliasTarget = CORP_ALIASES[query.trim()]
  if (aliasTarget) {
    const match = POPULAR_CORP_CODES.find((c) => c.corp_name === aliasTarget)
    if (match) {
      return [{
        corp_code: match.corp_code,
        corp_name: match.corp_name,
        stock_code: match.stock_code,
      }]
    }
  }

  // 기업명 부분 매칭
  return POPULAR_CORP_CODES
    .filter((c) => c.corp_name.toLowerCase().includes(normalized))
    .map((c) => ({
      corp_code: c.corp_code,
      corp_name: c.corp_name,
      stock_code: c.stock_code,
    }))
}

/** 정적 매핑에서 종목코드로 검색 */
function searchStaticByStockCode(stockCode: string): DartSearchResult | null {
  const match = POPULAR_CORP_CODES.find((c) => c.stock_code === stockCode)
  if (!match) return null
  return {
    corp_code: match.corp_code,
    corp_name: match.corp_name,
    stock_code: match.stock_code,
  }
}

/**
 * corpCode.xml ZIP 다운로드 → Map 캐시 생성
 * DART API에서 전체 기업코드 목록을 ZIP으로 제공
 */
async function loadCorpCodeMap(apiKey: string): Promise<Map<string, DartCorpCode>> {
  if (corpCodePromise && Date.now() < corpCodePromiseExpiry) {
    return corpCodePromise
  }

  corpCodePromiseExpiry = Date.now() + CACHE_TTL_MS
  corpCodePromise = doLoadCorpCodeMap(apiKey)

  try {
    return await corpCodePromise
  } catch (err) {
    corpCodePromise = null
    throw err
  }
}

async function doLoadCorpCodeMap(apiKey: string): Promise<Map<string, DartCorpCode>> {
  const url = `https://opendart.fss.or.kr/api/corpCode.xml?crtfc_key=${apiKey}`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`DART corpCode.xml 다운로드 실패: ${res.status}`)
  }

  const arrayBuffer = await res.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const xmlContent = await extractXmlFromZip(buffer)

  const map = new Map<string, DartCorpCode>()
  const regex = /<list>\s*<corp_code>(\d{8})<\/corp_code>\s*<corp_name>([^<]*)<\/corp_name>\s*<stock_code>([^<]*)<\/stock_code>\s*<modify_date>(\d{8})<\/modify_date>\s*<\/list>/g

  let match: RegExpExecArray | null
  while ((match = regex.exec(xmlContent)) !== null) {
    const corpCode: DartCorpCode = {
      corp_code: match[1],
      corp_name: match[2].trim(),
      stock_code: match[3].trim(),
      modify_date: match[4],
    }
    map.set(corpCode.corp_name, corpCode)
    if (corpCode.stock_code) {
      map.set(`stock:${corpCode.stock_code}`, corpCode)
    }
  }

  return map
}

/** ZIP 버퍼에서 XML 콘텐츠 추출 */
async function extractXmlFromZip(zipBuffer: Buffer): Promise<string> {
  // ZIP 파일 형식: Local File Header → File Data
  // PK\x03\x04 시그니처 확인
  if (zipBuffer[0] !== 0x50 || zipBuffer[1] !== 0x4b) {
    throw new Error("유효하지 않은 ZIP 파일")
  }

  // Local File Header 파싱
  const compressedSize = zipBuffer.readUInt32LE(18)
  const fileNameLen = zipBuffer.readUInt16LE(26)
  const extraFieldLen = zipBuffer.readUInt16LE(28)
  const dataOffset = 30 + fileNameLen + extraFieldLen
  const compressionMethod = zipBuffer.readUInt16LE(8)

  if (dataOffset + compressedSize > zipBuffer.length) {
    throw new Error("ZIP 파일이 손상되었거나 불완전합니다")
  }

  const compressedData = zipBuffer.subarray(dataOffset, dataOffset + compressedSize)

  if (compressionMethod === 0) {
    // 비압축
    return compressedData.toString("utf-8")
  }

  // Deflate 압축 해제
  const { inflateRawSync } = await import("node:zlib")
  const decompressed = inflateRawSync(compressedData)
  return decompressed.toString("utf-8")
}

/**
 * 기업명으로 검색 (정적 매핑 우선, 필요시 동적 조회)
 * @param query 기업명 또는 별칭
 * @param apiKey DART API 키 (동적 조회 시 필요)
 */
export async function searchByName(
  query: string,
  apiKey?: string
): Promise<readonly DartSearchResult[]> {
  // 1. 정적 매핑에서 먼저 검색
  const staticResults = searchStaticByName(query)
  if (staticResults.length > 0) return staticResults

  // 2. API 키가 있으면 전체 목록에서 검색
  if (!apiKey) return []

  try {
    const map = await loadCorpCodeMap(apiKey)
    const normalized = query.trim().toLowerCase()
    const results: DartSearchResult[] = []

    for (const [key, value] of map.entries()) {
      if (key.startsWith("stock:")) continue
      if (key.toLowerCase().includes(normalized)) {
        results.push({
          corp_code: value.corp_code,
          corp_name: value.corp_name,
          stock_code: value.stock_code,
        })
        if (results.length >= 20) break
      }
    }

    return results
  } catch {
    return []
  }
}

/**
 * 종목코드 → corp_code 변환
 */
export async function resolveByStockCode(
  stockCode: string,
  apiKey?: string
): Promise<DartSearchResult | null> {
  // 1. 정적 매핑
  const staticResult = searchStaticByStockCode(stockCode)
  if (staticResult) return staticResult

  // 2. 동적 조회
  if (!apiKey) return null

  try {
    const map = await loadCorpCodeMap(apiKey)
    const entry = map.get(`stock:${stockCode}`)
    if (!entry) return null
    return {
      corp_code: entry.corp_code,
      corp_name: entry.corp_name,
      stock_code: entry.stock_code,
    }
  } catch {
    return null
  }
}
