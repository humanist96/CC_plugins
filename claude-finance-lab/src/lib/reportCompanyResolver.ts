/** 기업명/티커 입력 → KR/US 분류 resolver */

import { detectKoreanCompany } from "@/lib/dartCompanyDetector"

export interface ResolvedCompany {
  readonly region: "KR" | "US"
  readonly displayName: string
  readonly corpCode?: string
  readonly stockCode?: string
  readonly ticker?: string
}

interface UsTickerEntry {
  readonly ticker: string
  readonly name: string
  readonly aliases: readonly string[]
}

const US_TICKERS: readonly UsTickerEntry[] = [
  { ticker: "AAPL", name: "Apple Inc.", aliases: ["APPLE", "애플"] },
  { ticker: "GOOGL", name: "Alphabet Inc.", aliases: ["GOOGLE", "구글", "알파벳"] },
  { ticker: "MSFT", name: "Microsoft Corp.", aliases: ["MICROSOFT", "마이크로소프트", "MS"] },
  { ticker: "NVDA", name: "NVIDIA Corp.", aliases: ["NVIDIA", "엔비디아"] },
  { ticker: "TSLA", name: "Tesla Inc.", aliases: ["TESLA", "테슬라"] },
  { ticker: "AMZN", name: "Amazon.com Inc.", aliases: ["AMAZON", "아마존"] },
  { ticker: "META", name: "Meta Platforms Inc.", aliases: ["META", "메타", "FACEBOOK", "페이스북"] },
  { ticker: "AVGO", name: "Broadcom Inc.", aliases: ["BROADCOM", "브로드컴"] },
  { ticker: "JPM", name: "JPMorgan Chase & Co.", aliases: ["JPMORGAN", "JP모건"] },
  { ticker: "V", name: "Visa Inc.", aliases: ["VISA", "비자"] },
  { ticker: "MA", name: "Mastercard Inc.", aliases: ["MASTERCARD", "마스터카드"] },
  { ticker: "HD", name: "Home Depot Inc.", aliases: ["HOME DEPOT", "홈디포"] },
  { ticker: "CRM", name: "Salesforce Inc.", aliases: ["SALESFORCE", "세일즈포스"] },
  { ticker: "AMD", name: "Advanced Micro Devices Inc.", aliases: ["AMD"] },
  { ticker: "INTC", name: "Intel Corp.", aliases: ["INTEL", "인텔"] },
  { ticker: "NFLX", name: "Netflix Inc.", aliases: ["NETFLIX", "넷플릭스"] },
  { ticker: "DIS", name: "Walt Disney Co.", aliases: ["DISNEY", "디즈니"] },
  { ticker: "BABA", name: "Alibaba Group Holdings", aliases: ["ALIBABA", "알리바바"] },
  { ticker: "TSM", name: "Taiwan Semiconductor", aliases: ["TSMC", "대만반도체"] },
  { ticker: "ASML", name: "ASML Holding NV", aliases: ["ASML"] },
]

function matchUsTicker(input: string): UsTickerEntry | null {
  const upper = input.toUpperCase().trim()

  for (const entry of US_TICKERS) {
    if (upper === entry.ticker || upper === entry.name.toUpperCase()) {
      return entry
    }
    if (entry.aliases.some((a) => a.toUpperCase() === upper)) {
      return entry
    }
  }

  return null
}

/**
 * 입력 문자열을 KR/US 기업으로 분류
 * 우선순위: US 정확 매치 → KR 감지
 */
export function resolveCompany(input: string): ResolvedCompany | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  // 1. US 티커/별칭 정확 매치
  const usMatch = matchUsTicker(trimmed)
  if (usMatch) {
    return {
      region: "US",
      displayName: usMatch.name,
      ticker: usMatch.ticker,
    }
  }

  // 2. KR 기업 감지
  const krMatch = detectKoreanCompany(trimmed)
  if (krMatch) {
    return {
      region: "KR",
      displayName: krMatch.result.corp_name,
      corpCode: krMatch.result.corp_code,
      stockCode: krMatch.result.stock_code,
    }
  }

  return null
}
