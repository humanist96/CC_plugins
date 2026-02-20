"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type InvestmentLevel = "beginner" | "intermediate" | "advanced"
export type UserRole = "investor" | "broker" | "analyst"

interface UserProfile {
  readonly name: string
  readonly role: UserRole
  readonly investmentLevel: InvestmentLevel
  readonly onboardingComplete: boolean
}

interface UserProfileState extends UserProfile {
  setProfile: (profile: Partial<Pick<UserProfile, "name" | "role" | "investmentLevel">>) => void
  completeOnboarding: () => void
  resetProfile: () => void
}

const initialProfile: UserProfile = {
  name: "",
  role: "investor",
  investmentLevel: "beginner",
  onboardingComplete: false,
}

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set) => ({
      ...initialProfile,

      setProfile: (profile) => {
        set((state) => ({ ...state, ...profile }))
      },

      completeOnboarding: () => {
        set({ onboardingComplete: true })
      },

      resetProfile: () => {
        set(initialProfile)
      },
    }),
    {
      name: "claude-finance-user-profile",
    }
  )
)

/**
 * 투자 수준에 따른 Claude 응답 톤 지시문.
 */
export function getLevelInstruction(level: InvestmentLevel): string {
  switch (level) {
    case "beginner":
      return (
        "The user is a beginner investor. " +
        "Use simple, everyday language. Define financial terms when first used. " +
        "Provide analogies and examples to explain concepts. " +
        "Avoid jargon without explanation."
      )
    case "intermediate":
      return (
        "The user has intermediate investment knowledge. " +
        "Use standard financial terminology (PER, PBR, ROE, etc.) without over-explaining. " +
        "Focus on practical analysis and comparisons."
      )
    case "advanced":
      return (
        "The user is an advanced investor. " +
        "Use technical analysis terminology, detailed financial metrics, and industry-specific jargon freely. " +
        "Include quantitative analysis, multi-factor comparisons, and detailed valuation models when relevant."
      )
  }
}
