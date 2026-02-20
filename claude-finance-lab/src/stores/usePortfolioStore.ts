"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Holding } from "@/types/portfolio"

interface PortfolioState {
  readonly holdings: readonly Holding[]
  addHolding: (holding: Omit<Holding, "id" | "addedAt">) => void
  updateHolding: (id: string, updates: Partial<Pick<Holding, "quantity" | "avgPrice">>) => void
  removeHolding: (id: string) => void
  loadDemoPortfolio: () => void
  clearAll: () => void
}

function generateId(): string {
  return `h-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set) => ({
      holdings: [],

      addHolding: (holding) => {
        const newHolding: Holding = {
          ...holding,
          id: generateId(),
          addedAt: Date.now(),
        }
        set((state) => ({
          holdings: [...state.holdings, newHolding],
        }))
      },

      updateHolding: (id, updates) => {
        set((state) => ({
          holdings: state.holdings.map((h) =>
            h.id === id ? { ...h, ...updates } : h
          ),
        }))
      },

      removeHolding: (id) => {
        set((state) => ({
          holdings: state.holdings.filter((h) => h.id !== id),
        }))
      },

      loadDemoPortfolio: () => {
        import("@/data/demoPortfolio").then(({ DEMO_HOLDINGS }) => {
          set({ holdings: [...DEMO_HOLDINGS] })
        })
      },

      clearAll: () => {
        set({ holdings: [] })
      },
    }),
    {
      name: "claude-finance-portfolio",
    }
  )
)
