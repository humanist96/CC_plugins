"use client"

import { useState } from "react"
import { tutorials } from "@/data/tutorials"
import { TutorialCard } from "@/components/tutorial/TutorialCard"
import { Button } from "@/components/ui/button"
import type { Difficulty } from "@/types/tutorial"

const filters: { label: string; value: Difficulty | "all" }[] = [
  { label: "전체", value: "all" },
  { label: "초급", value: "beginner" },
  { label: "중급", value: "intermediate" },
  { label: "고급", value: "advanced" },
]

export default function TutorialsPage() {
  const [filter, setFilter] = useState<Difficulty | "all">("all")

  const filtered =
    filter === "all"
      ? tutorials
      : tutorials.filter((t) => t.difficulty === filter)

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">튜토리얼</h1>
        <p className="mt-2 text-muted-foreground">
          8개의 단계별 실습으로 Claude Code 플러그인을 마스터하세요
        </p>
      </div>

      <div className="flex gap-2 mb-8">
        {filters.map((f) => (
          <Button
            key={f.value}
            variant={filter === f.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((tutorial) => (
          <TutorialCard
            key={tutorial.slug}
            tutorial={tutorial}
            index={tutorials.indexOf(tutorial)}
          />
        ))}
      </div>
    </div>
  )
}
