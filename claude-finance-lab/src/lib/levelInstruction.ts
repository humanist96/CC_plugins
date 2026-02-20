export type InvestmentLevel = "beginner" | "intermediate" | "advanced"

const LEVEL_INSTRUCTIONS: Record<InvestmentLevel, string> = {
  beginner:
    "The user is a beginner investor. " +
    "Use simple, everyday language. Define financial terms when first used. " +
    "Provide analogies and examples to explain concepts. " +
    "Avoid jargon without explanation. " +
    "사용자는 초보 투자자입니다. 쉬운 용어로 설명하고 금융 개념은 정의를 포함해주세요.",
  intermediate:
    "The user has intermediate investment knowledge. " +
    "Use standard financial terminology (PER, PBR, ROE, EPS etc.) without over-explaining. " +
    "Focus on practical analysis, comparisons, and actionable insights. " +
    "사용자는 중급 투자자입니다. 표준 금융 용어를 사용하고 실질적 분석에 집중하세요.",
  advanced:
    "The user is an advanced investor/analyst. " +
    "Use technical analysis terminology, detailed financial metrics, and industry-specific jargon freely. " +
    "Include quantitative analysis, multi-factor comparisons, and detailed valuation models when relevant. " +
    "사용자는 고급 투자자입니다. 기술적 분석 용어와 상세 지표를 자유롭게 사용하세요.",
}

export function getLevelInstruction(level: string): string | null {
  if (level in LEVEL_INSTRUCTIONS) {
    return LEVEL_INSTRUCTIONS[level as InvestmentLevel]
  }
  return null
}
