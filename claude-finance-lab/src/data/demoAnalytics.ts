export interface DemoUsage {
  readonly date: string
  readonly count: number
}

export interface DemoTicker {
  readonly ticker: string
  readonly count: number
}

export interface DemoComplianceStats {
  readonly totalQueries: number
  readonly advisoryBlocked: number
  readonly predictionBlocked: number
  readonly infoAllowed: number
}

function generateDailyUsage(days: number): readonly DemoUsage[] {
  const result: DemoUsage[] = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().slice(0, 10)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6
    const base = isWeekend ? 5 : 15
    const count = base + Math.floor(Math.random() * 20)
    result.push({ date: dateStr, count })
  }

  return result
}

export const DEMO_DAILY_USAGE = generateDailyUsage(30)

export const DEMO_TRENDING_TICKERS: readonly DemoTicker[] = [
  { ticker: "삼성전자", count: 87 },
  { ticker: "NVDA", count: 63 },
  { ticker: "SK하이닉스", count: 52 },
  { ticker: "AAPL", count: 41 },
  { ticker: "TSLA", count: 38 },
  { ticker: "카카오", count: 29 },
  { ticker: "MSFT", count: 25 },
  { ticker: "NAVER", count: 22 },
  { ticker: "LG에너지솔루션", count: 18 },
  { ticker: "현대자동차", count: 15 },
]

export const DEMO_COMPLIANCE_STATS: DemoComplianceStats = {
  totalQueries: 523,
  advisoryBlocked: 67,
  predictionBlocked: 34,
  infoAllowed: 422,
}

export const DEMO_TOTAL_COST = 12.47

export interface LeadScore {
  readonly name: string
  readonly score: "hot" | "warm" | "cold"
  readonly queries: number
  readonly lastActive: string
  readonly topTickers: readonly string[]
}

export const DEMO_LEADS: readonly LeadScore[] = [
  { name: "김영업", score: "hot", queries: 45, lastActive: "2시간 전", topTickers: ["삼성전자", "NVDA"] },
  { name: "이투자", score: "hot", queries: 38, lastActive: "4시간 전", topTickers: ["SK하이닉스", "AAPL"] },
  { name: "박금융", score: "warm", queries: 22, lastActive: "1일 전", topTickers: ["카카오", "TSLA"] },
  { name: "최분석", score: "warm", queries: 15, lastActive: "2일 전", topTickers: ["MSFT", "NAVER"] },
  { name: "정리서치", score: "cold", queries: 5, lastActive: "7일 전", topTickers: ["현대자동차"] },
]
