import type { ComplianceCategory } from "@/lib/complianceFilter"

const ADVISORY_INSTRUCTION =
  "IMPORTANT COMPLIANCE RULE: The user is asking for investment advice. " +
  "You MUST NOT provide specific buy/sell recommendations or target prices. " +
  "Instead, provide educational information and objective analysis. " +
  "Always include a disclaimer that this is not investment advice. " +
  "Rephrase the answer as educational content: explain relevant factors, " +
  "pros/cons, and analytical frameworks the user can use to make their own decision. " +
  "End with: '본 정보는 투자 자문이 아닌 교육 목적으로 제공됩니다. 투자 결정은 본인의 판단과 책임 하에 이루어져야 합니다.'"

const PREDICTION_INSTRUCTION =
  "IMPORTANT COMPLIANCE RULE: The user is asking for price prediction or guaranteed returns. " +
  "You MUST NOT predict specific future prices or guarantee returns. " +
  "Instead, present scenario analysis (bull/base/bear) with supporting factors. " +
  "Explain the key variables that could influence the outcome. " +
  "Always emphasize uncertainty and risks. " +
  "End with: '시장 예측은 불확실성을 수반하며, 본 분석은 교육 목적으로 제공됩니다.'"

/**
 * 컴플라이언스 감지 시 system prompt에 추가할 지시문 반환.
 */
export function buildComplianceInstruction(category: ComplianceCategory): string | null {
  switch (category) {
    case "advisory":
      return ADVISORY_INSTRUCTION
    case "prediction":
      return PREDICTION_INSTRUCTION
    case "info":
      return null
  }
}
