"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { UserProgress, TutorialProgress } from "@/types/progress"

interface ProgressState extends UserProgress {
  startTutorial: (slug: string, totalSteps: number) => void
  completeStep: (slug: string, stepId: number, xp: number) => void
  setCurrentStep: (slug: string, stepId: number) => void
  addBadge: (badgeId: string, xp: number) => void
  addXP: (amount: number) => void
  getTutorialProgress: (slug: string) => TutorialProgress | undefined
  getCompletedCount: () => number
  updateStreak: () => void
}

const initialState: UserProgress = {
  tutorials: {},
  badges: [],
  totalXP: 0,
  streakDays: 0,
  lastActiveDate: "",
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initialState,

      startTutorial: (slug, totalSteps) => {
        const existing = get().tutorials[slug]
        if (existing) return

        const progress: TutorialProgress = {
          status: "in_progress",
          currentStep: 0,
          totalSteps,
          completedSteps: [],
          startedAt: new Date().toISOString(),
          timeSpentSeconds: 0,
        }

        set((state) => ({
          tutorials: { ...state.tutorials, [slug]: progress },
        }))
      },

      completeStep: (slug, stepId, xp) => {
        set((state) => {
          const tutorial = state.tutorials[slug]
          if (!tutorial) return state

          const completedSteps = tutorial.completedSteps.includes(stepId)
            ? tutorial.completedSteps
            : [...tutorial.completedSteps, stepId]

          const isComplete = completedSteps.length >= tutorial.totalSteps
          const newXP = tutorial.completedSteps.includes(stepId)
            ? state.totalXP
            : state.totalXP + xp

          return {
            totalXP: newXP,
            tutorials: {
              ...state.tutorials,
              [slug]: {
                ...tutorial,
                completedSteps,
                status: isComplete ? "completed" : "in_progress",
                completedAt: isComplete ? new Date().toISOString() : undefined,
              },
            },
          }
        })
      },

      setCurrentStep: (slug, stepId) => {
        set((state) => {
          const tutorial = state.tutorials[slug]
          if (!tutorial) return state

          return {
            tutorials: {
              ...state.tutorials,
              [slug]: { ...tutorial, currentStep: stepId },
            },
          }
        })
      },

      addBadge: (badgeId, xp) => {
        set((state) => {
          if (state.badges.includes(badgeId)) return state
          return {
            badges: [...state.badges, badgeId],
            totalXP: state.totalXP + xp,
          }
        })
      },

      addXP: (amount) => {
        set((state) => ({ totalXP: state.totalXP + amount }))
      },

      getTutorialProgress: (slug) => {
        return get().tutorials[slug]
      },

      getCompletedCount: () => {
        return Object.values(get().tutorials).filter(
          (t) => t.status === "completed"
        ).length
      },

      updateStreak: () => {
        const today = new Date().toISOString().split("T")[0]
        const state = get()

        if (state.lastActiveDate === today) return

        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split("T")[0]

        const newStreak =
          state.lastActiveDate === yesterdayStr ? state.streakDays + 1 : 1

        set({ streakDays: newStreak, lastActiveDate: today })
      },
    }),
    {
      name: "claude-finance-lab-progress",
    }
  )
)
