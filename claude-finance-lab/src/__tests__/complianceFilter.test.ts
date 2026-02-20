import { describe, it, expect } from "vitest"
import { detectAdvisoryIntent } from "@/lib/complianceFilter"

describe("complianceFilter", () => {
  describe("정보 요청 (info) — 트리거되지 않아야 함", () => {
    const infoCases = [
      "PER이 뭐야?",
      "삼성전자 실적 알려줘",
      "반도체 업종 분석해줘",
      "영업이익 계산 방법",
      "AAPL 재무제표 보여줘",
      "금리란 무엇인가",
      "환율 변동 원인",
    ]

    it.each(infoCases)("'%s' → info (not triggered)", (input) => {
      const result = detectAdvisoryIntent(input)
      expect(result.triggered).toBe(false)
      expect(result.category).toBe("info")
    })
  })

  describe("자문 요청 (advisory) — 강한 패턴 (금융 맥락 불필요)", () => {
    const strongAdvisoryCases = [
      "추천 종목 알려줘",
      "뭐 사면 좋을까",
      "지금 매수해도 되나",
      "목표가가 어디야",
      "손절해야 하나",
      "익절할 타이밍이야?",
      "should i buy NVDA",
      "recommend a stock",
    ]

    it.each(strongAdvisoryCases)("'%s' → advisory (triggered, strong)", (input) => {
      const result = detectAdvisoryIntent(input)
      expect(result.triggered).toBe(true)
      expect(result.category).toBe("advisory")
    })
  })

  describe("자문 요청 (advisory) — 약한 패턴 (금융 맥락 필요)", () => {
    const weakWithContextCases = [
      "삼성전자 사야 할까?",       // 삼성전자 → company suffix "전자"
      "AAPL 팔아야 하나?",         // AAPL → ticker pattern
      "투자해도 될까요",            // "투자" in input → financial context
      "이 종목 괜찮을까",           // "종목" → financial context
    ]

    it.each(weakWithContextCases)("'%s' → advisory (triggered with context)", (input) => {
      const result = detectAdvisoryIntent(input)
      expect(result.triggered).toBe(true)
      expect(result.category).toBe("advisory")
    })
  })

  describe("약한 패턴 — 금융 맥락 없으면 미트리거 (false positive 방지)", () => {
    const weakWithoutContextCases = [
      "이 옷 사야 할까?",
      "집 팔아야 하나",
      "이거 괜찮을까",
    ]

    it.each(weakWithoutContextCases)("'%s' → info (not triggered, no financial context)", (input) => {
      const result = detectAdvisoryIntent(input)
      expect(result.triggered).toBe(false)
      expect(result.category).toBe("info")
    })
  })

  describe("예측 요청 (prediction) — 트리거되어야 함", () => {
    const predictionCases = [
      "삼성전자 올라갈까?",        // "전자" suffix → financial context + weak pattern
      "수익률 보장되나요",          // strong pattern
      "will it go up",
      "price prediction",
    ]

    it.each(predictionCases)("'%s' → prediction (triggered)", (input) => {
      const result = detectAdvisoryIntent(input)
      expect(result.triggered).toBe(true)
      expect(result.category).toBe("prediction")
    })
  })

  describe("예측 약한 패턴 — 금융 맥락 없으면 미트리거", () => {
    it("날씨 올라갈까는 트리거 안됨", () => {
      const result = detectAdvisoryIntent("기온 올라갈까?")
      expect(result.triggered).toBe(false)
    })
  })

  describe("대소문자 무시", () => {
    it("영문 대소문자 구분 없이 감지", () => {
      const result = detectAdvisoryIntent("Should I Buy AAPL?")
      expect(result.triggered).toBe(true)
    })
  })
})
