export interface Holding {
  readonly id: string
  readonly ticker: string
  readonly name: string
  readonly region: "KR" | "US"
  readonly quantity: number
  readonly avgPrice: number
  readonly addedAt: number
}

export interface HoldingWithQuote extends Holding {
  readonly currentPrice: number | null
  readonly dayChange: number | null
  readonly dayChangePercent: number | null
  readonly totalValue: number | null
  readonly totalGain: number | null
  readonly totalGainPercent: number | null
}

export interface PortfolioSummary {
  readonly totalValue: number
  readonly totalCost: number
  readonly totalGain: number
  readonly totalGainPercent: number
  readonly dayChange: number
  readonly dayChangePercent: number
  readonly holdingsCount: number
}

export interface SectorAllocation {
  readonly sector: string
  readonly value: number
  readonly percent: number
}
