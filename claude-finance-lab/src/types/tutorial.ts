export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export type StepType = 'guide' | 'exercise' | 'quiz'

export interface TutorialCommand {
  readonly text: string
  readonly plugin: string
  readonly sandboxResponseId?: string
}

export interface TutorialStep {
  readonly id: number
  readonly title: string
  readonly content: string
  readonly type: StepType
  readonly command?: TutorialCommand
  readonly hints?: readonly string[]
  readonly expectedResult?: string
  readonly xpReward: number
}

export interface Tutorial {
  readonly slug: string
  readonly title: string
  readonly description: string
  readonly difficulty: Difficulty
  readonly estimatedMinutes: number
  readonly plugins: readonly string[]
  readonly steps: readonly TutorialStep[]
  readonly icon: string
}
