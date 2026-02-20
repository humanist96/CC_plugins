export interface ChatMessage {
  readonly id: string
  readonly role: "user" | "assistant"
  readonly content: string
  readonly timestamp: number
  readonly complianceTriggered?: boolean
}

export interface Conversation {
  readonly id: string
  readonly title: string
  readonly messages: readonly ChatMessage[]
  readonly createdAt: number
  readonly updatedAt: number
}
