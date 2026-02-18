import { tutorial01 } from "./01-getting-started"
import { tutorial02 } from "./02-stock-lookup"
import { tutorial03 } from "./03-sales-basics"
import { tutorial04 } from "./04-financial-analysis"
import { tutorial05 } from "./05-data-analysis"
import { tutorial06 } from "./06-technical-indicators"
import { tutorial07 } from "./07-customer-management"
import { tutorial08 } from "./08-advanced-workflows"
import type { Tutorial } from "@/types/tutorial"

export const tutorials: readonly Tutorial[] = [
  tutorial01,
  tutorial02,
  tutorial03,
  tutorial04,
  tutorial05,
  tutorial06,
  tutorial07,
  tutorial08,
]

export function getTutorialBySlug(slug: string): Tutorial | undefined {
  return tutorials.find((t) => t.slug === slug)
}

export function getTutorialsByDifficulty(difficulty: Tutorial["difficulty"]): readonly Tutorial[] {
  return tutorials.filter((t) => t.difficulty === difficulty)
}
