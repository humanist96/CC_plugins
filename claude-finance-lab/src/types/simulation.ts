export type ResponseType = 'text' | 'table' | 'chart' | 'report' | 'stock_quote' | 'email_draft' | 'code' | 'pipeline' | 'mixed'

export type ChartType = 'line' | 'bar' | 'pie' | 'funnel' | 'gauge' | 'waterfall'

export interface ChartConfig {
  readonly type: ChartType
  readonly title: string
  readonly data: readonly Record<string, unknown>[]
  readonly options?: Record<string, unknown>
}

export interface SimulationContent {
  readonly type: ResponseType
  readonly title?: string
  readonly data: unknown
}

export interface SimulationResponse {
  readonly id: string
  readonly command: string
  readonly triggerKeywords: readonly string[]
  readonly contents: readonly SimulationContent[]
  readonly charts?: readonly ChartConfig[]
}

export interface QuizQuestion {
  readonly id: number
  readonly type: 'multiple_choice' | 'command_input'
  readonly question: string
  readonly options?: readonly string[]
  readonly correctAnswer: string
  readonly explanation: string
  readonly points: number
}

export interface Quiz {
  readonly id: string
  readonly tutorialSlug: string
  readonly title: string
  readonly questions: readonly QuizQuestion[]
  readonly passingScore: number
}
