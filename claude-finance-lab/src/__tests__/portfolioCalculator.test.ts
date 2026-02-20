import { describe, it, expect } from "vitest"
import { enrichHolding, calculateSummary, formatCurrency, formatPercent } from "@/lib/portfolioCalculator"
import type { Holding } from "@/types/portfolio"

const baseHolding: Holding = {
  id: "test-1",
  ticker: "AAPL",
  name: "Apple Inc.",
  region: "US",
  quantity: 10,
  avgPrice: 150,
  addedAt: Date.now(),
}

describe("portfolioCalculator", () => {
  describe("enrichHolding", () => {
    it("시세 데이터가 있을 때 수익률 계산", () => {
      const result = enrichHolding(baseHolding, {
        currentPrice: 200,
        dayChange: 5,
        dayChangePercent: 2.56,
      })

      expect(result.currentPrice).toBe(200)
      expect(result.totalValue).toBe(2000) // 200 * 10
      expect(result.totalGain).toBe(500) // 2000 - 1500
      expect(result.totalGainPercent).toBeCloseTo(33.33, 1) // 500/1500 * 100
    })

    it("시세 데이터가 없을 때 null 반환", () => {
      const result = enrichHolding(baseHolding, null)

      expect(result.currentPrice).toBeNull()
      expect(result.totalValue).toBeNull()
      expect(result.totalGain).toBeNull()
    })

    it("손실 케이스 처리", () => {
      const result = enrichHolding(baseHolding, {
        currentPrice: 100,
        dayChange: -3,
        dayChangePercent: -2.91,
      })

      expect(result.totalGain).toBe(-500) // 1000 - 1500
      expect(result.totalGainPercent).toBeCloseTo(-33.33, 1)
    })

    it("수량 0일 때 0으로 처리", () => {
      const zeroHolding = { ...baseHolding, quantity: 0 }
      const result = enrichHolding(zeroHolding, {
        currentPrice: 200,
        dayChange: 5,
        dayChangePercent: 2.5,
      })

      expect(result.totalValue).toBe(0)
      expect(result.totalGain).toBe(0)
    })
  })

  describe("calculateSummary", () => {
    it("여러 종목의 요약 계산", () => {
      const holdings = [
        enrichHolding(baseHolding, { currentPrice: 200, dayChange: 5, dayChangePercent: 2.5 }),
        enrichHolding(
          { ...baseHolding, id: "test-2", quantity: 5, avgPrice: 100 },
          { currentPrice: 120, dayChange: -2, dayChangePercent: -1.64 }
        ),
      ]

      const summary = calculateSummary(holdings)

      expect(summary.totalValue).toBe(2600) // 2000 + 600
      expect(summary.totalCost).toBe(2000) // 1500 + 500
      expect(summary.totalGain).toBe(600)
      expect(summary.holdingsCount).toBe(2)
    })

    it("빈 포트폴리오 처리", () => {
      const summary = calculateSummary([])

      expect(summary.totalValue).toBe(0)
      expect(summary.totalCost).toBe(0)
      expect(summary.holdingsCount).toBe(0)
    })
  })

  describe("formatCurrency", () => {
    it("USD 포맷", () => {
      const result = formatCurrency(1234.56, "US")
      expect(result).toContain("1,234.56")
    })

    it("KRW 포맷 (소수점 없음)", () => {
      const result = formatCurrency(72000, "KR")
      expect(result).toContain("72,000")
    })
  })

  describe("formatPercent", () => {
    it("양수에 + 부호", () => {
      expect(formatPercent(5.23)).toBe("+5.23%")
    })

    it("음수에 - 부호", () => {
      expect(formatPercent(-3.14)).toBe("-3.14%")
    })

    it("0은 + 부호", () => {
      expect(formatPercent(0)).toBe("+0.00%")
    })
  })
})
