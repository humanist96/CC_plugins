export type ComplianceCategory = "info" | "advisory" | "prediction"

interface ComplianceResult {
  readonly category: ComplianceCategory
  readonly triggered: boolean
  readonly matchedPattern?: string
}

// Financial context markers — must co-occur with advisory/prediction patterns to trigger
const FINANCIAL_CONTEXT_KR = [
  "주식", "종목", "투자", "주가", "코스피", "코스닥", "나스닥", "증시",
  "ETF", "채권", "펀드", "배당", "시장", "포트폴리오", "수익률",
]
const FINANCIAL_CONTEXT_EN = [
  "stock", "share", "invest", "market", "portfolio", "etf", "bond",
  "fund", "dividend", "nasdaq", "s&p", "dow",
]
// Korean company name suffixes that indicate financial context
const COMPANY_SUFFIXES_KR = [
  "전자", "하이닉스", "바이오", "제약", "화학", "건설", "증권", "금융",
  "은행", "보험", "자동차", "에너지", "솔루션", "텔레콤", "물산",
]

// Patterns that inherently relate to finance — no context check needed
const ADVISORY_PATTERNS_STRONG_KR = [
  "추천 종목",
  "추천해줘",
  "매수",
  "매도",
  "뭐 사",
  "목표가",
  "적정가",
  "물타기",
  "손절",
  "익절",
  "지금 사도",
]

// Patterns that need financial context to avoid false positives
const ADVISORY_PATTERNS_WEAK_KR = [
  "사야",
  "팔아야",
  "살까",
  "팔까",
  "들어가",
  "투자해도",
  "투자할만",
  "괜찮을까",
  "해도 될까",
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

const PREDICTION_PATTERNS_STRONG_KR = [
  "수익률 보장",
  "전망이 어떻게",
]

const PREDICTION_PATTERNS_WEAK_KR = [
  "올라갈",
  "내려갈",
  "오를까",
  "내릴까",
  "떨어질까",
  "상승할까",
  "하락할까",
  "얼마까지",
  "몇 퍼센트",
  "언제까지",
]

const PREDICTION_PATTERNS_EN = [
  "will it go up",
  "will it go down",
  "price prediction",
  "guaranteed return",
  "how high will",
  "when will it",
]

function hasFinancialContext(text: string): boolean {
  const lower = text.toLowerCase()
  for (const ctx of FINANCIAL_CONTEXT_KR) {
    if (lower.includes(ctx)) return true
  }
  for (const ctx of FINANCIAL_CONTEXT_EN) {
    if (lower.includes(ctx)) return true
  }
  // Detect Korean company names (e.g. 삼성전자, SK하이닉스)
  for (const suffix of COMPANY_SUFFIXES_KR) {
    if (lower.includes(suffix)) return true
  }
  // Detect ticker patterns (e.g. AAPL, 005930)
  if (/\b[A-Z]{1,5}\b/.test(text) || /\b\d{6}\b/.test(text)) return true
  return false
}

/**
 * 사용자 입력에서 투자 자문/예측 의도를 감지.
 * 키워드/패턴 기반 Pre-LLM 분류기.
 *
 * Strong patterns: 금융 맥락이 내재되어 있어 바로 트리거
 * Weak patterns: 일상 표현과 겹칠 수 있어 금융 맥락 공존 시에만 트리거
 */
export function detectAdvisoryIntent(input: string): ComplianceResult {
  const normalized = input.toLowerCase().trim()
  const financialContext = hasFinancialContext(input)

  // Check prediction patterns first (stronger signal)
  for (const pattern of PREDICTION_PATTERNS_STRONG_KR) {
    if (normalized.includes(pattern)) {
      return { category: "prediction", triggered: true, matchedPattern: pattern }
    }
  }
  for (const pattern of PREDICTION_PATTERNS_EN) {
    if (normalized.includes(pattern)) {
      return { category: "prediction", triggered: true, matchedPattern: pattern }
    }
  }
  if (financialContext) {
    for (const pattern of PREDICTION_PATTERNS_WEAK_KR) {
      if (normalized.includes(pattern)) {
        return { category: "prediction", triggered: true, matchedPattern: pattern }
      }
    }
  }

  // Check advisory patterns
  for (const pattern of ADVISORY_PATTERNS_STRONG_KR) {
    if (normalized.includes(pattern)) {
      return { category: "advisory", triggered: true, matchedPattern: pattern }
    }
  }
  for (const pattern of ADVISORY_PATTERNS_EN) {
    if (normalized.includes(pattern)) {
      return { category: "advisory", triggered: true, matchedPattern: pattern }
    }
  }
  if (financialContext) {
    for (const pattern of ADVISORY_PATTERNS_WEAK_KR) {
      if (normalized.includes(pattern)) {
        return { category: "advisory", triggered: true, matchedPattern: pattern }
      }
    }
  }

  return { category: "info", triggered: false }
}
