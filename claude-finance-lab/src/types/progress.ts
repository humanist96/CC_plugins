export type TutorialStatus = 'not_started' | 'in_progress' | 'completed'

export interface TutorialProgress {
  readonly status: TutorialStatus
  readonly currentStep: number
  readonly totalSteps: number
  readonly completedSteps: readonly number[]
  readonly startedAt: string
  readonly completedAt?: string
  readonly timeSpentSeconds: number
}

export interface Badge {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly icon: string
  readonly condition: string
  readonly xpReward: number
}

export interface UserProgress {
  readonly tutorials: Record<string, TutorialProgress>
  readonly badges: readonly string[]
  readonly totalXP: number
  readonly streakDays: number
  readonly lastActiveDate: string
}
