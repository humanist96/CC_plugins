import type { Holding, HoldingWithQuote, PortfolioSummary } from "@/types/portfolio"

interface PriceData {
  readonly currentPrice: number
  readonly dayChange: number
  readonly dayChangePercent: number
}

/**
 * 보유 종목에 실시간 시세를 결합하여 수익률 계산.
 */
export function enrichHolding(
  holding: Holding,
  price: PriceData | null
): HoldingWithQuote {
  if (!price) {
    return {
      ...holding,
      currentPrice: null,
      dayChange: null,
      dayChangePercent: null,
      totalValue: null,
      totalGain: null,
      totalGainPercent: null,
    }
  }

  const totalValue = price.currentPrice * holding.quantity
  const totalCost = holding.avgPrice * holding.quantity
  const totalGain = totalValue - totalCost
  const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0

  return {
    ...holding,
    currentPrice: price.currentPrice,
    dayChange: price.dayChange,
    dayChangePercent: price.dayChangePercent,
    totalValue,
    totalGain,
    totalGainPercent,
  }
}

/**
 * 포트폴리오 전체 요약 계산.
 */
export function calculateSummary(
  holdings: readonly HoldingWithQuote[]
): PortfolioSummary {
  let totalValue = 0
  let totalCost = 0
  let dayChangeValue = 0

  for (const h of holdings) {
    if (h.totalValue !== null) {
      totalValue += h.totalValue
    }
    totalCost += h.avgPrice * h.quantity
    if (h.dayChange !== null && h.currentPrice !== null) {
      dayChangeValue += h.dayChange * h.quantity
    }
  }

  const totalGain = totalValue - totalCost
  const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0
  const dayChangePercent = totalValue > 0 ? (dayChangeValue / (totalValue - dayChangeValue)) * 100 : 0

  return {
    totalValue,
    totalCost,
    totalGain,
    totalGainPercent,
    dayChange: dayChangeValue,
    dayChangePercent,
    holdingsCount: holdings.length,
  }
}

/**
 * 숫자를 화폐 형식으로 포맷.
 */
export function formatCurrency(value: number, region: "KR" | "US"): string {
  if (region === "KR") {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(value)
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * 퍼센트 포맷 (+ 부호 포함).
 */
export function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : ""
  return `${sign}${value.toFixed(2)}%`
}
