export type ComplianceCategory = "info" | "advisory" | "prediction"

interface ComplianceResult {
  readonly category: ComplianceCategory
  readonly triggered: boolean
  readonly matchedPattern?: string
}

const ADVISORY_PATTERNS_KR = [
  "사야",
  "팔아야",
  "매수",
  "매도",
  "추천 종목",
  "추천해",
  "추천좀",
  "어떤 주식",
  "뭐 사",
  "목표가",
  "적정가",
  "살까",
  "팔까",
  "들어가",
  "물타기",
  "손절",
  "익절",
  "투자해도",
  "투자할만",
  "괜찮을까",
  "해도 될까",
  "지금 사도",
]

const ADVISORY_PATTERNS_EN = [
  "should i buy",
  "should i sell",
  "recommend",
  "target price",
  "is it good to invest",
  "best stock",
  "buy or sell",
  "price target",
]

const PREDICTION_PATTERNS_KR = [
  "올라갈",
  "내려갈",
  "오를까",
  "내릴까",
  "떨어질까",
  "상승할까",
  "하락할까",
  "수익률 보장",
  "얼마까지",
  "몇 퍼센트",
  "언제까지",
  "전망이 어떻게",
]

const PREDICTION_PATTERNS_EN = [
  "will it go up",
  "will it go down",
  "price prediction",
  "guaranteed return",
  "how high will",
  "when will it",
]

/**
 * 사용자 입력에서 투자 자문/예측 의도를 감지.
 * 키워드/패턴 기반 Pre-LLM 분류기.
 */
export function detectAdvisoryIntent(input: string): ComplianceResult {
  const normalized = input.toLowerCase().trim()

  // Check prediction patterns first (stronger signal)
  for (const pattern of PREDICTION_PATTERNS_KR) {
    if (normalized.includes(pattern)) {
      return { category: "prediction", triggered: true, matchedPattern: pattern }
    }
  }
  for (const pattern of PREDICTION_PATTERNS_EN) {
    if (normalized.includes(pattern)) {
      return { category: "prediction", triggered: true, matchedPattern: pattern }
    }
  }

  // Check advisory patterns
  for (const pattern of ADVISORY_PATTERNS_KR) {
    if (normalized.includes(pattern)) {
      return { category: "advisory", triggered: true, matchedPattern: pattern }
    }
  }
  for (const pattern of ADVISORY_PATTERNS_EN) {
    if (normalized.includes(pattern)) {
      return { category: "advisory", triggered: true, matchedPattern: pattern }
    }
  }

  return { category: "info", triggered: false }
}
