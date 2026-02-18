"use client"

import { useState } from "react"
import { Lightbulb, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface HintSystemProps {
  readonly hints: readonly string[]
}

export function HintSystem({ hints }: HintSystemProps) {
  const [revealedCount, setRevealedCount] = useState(0)

  const revealNext = () => {
    if (revealedCount < hints.length) {
      setRevealedCount(revealedCount + 1)
    }
  }

  return (
    <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold">
          <Lightbulb className="h-4 w-4" />
          힌트 ({revealedCount}/{hints.length})
        </div>
        {revealedCount < hints.length && (
          <Button
            variant="ghost"
            size="sm"
            className="text-amber-400 hover:text-amber-300 text-xs gap-1"
            onClick={revealNext}
          >
            힌트 보기
            <ChevronDown className="h-3 w-3" />
          </Button>
        )}
      </div>
      <div className="space-y-2">
        {hints.slice(0, revealedCount).map((hint, i) => (
          <div
            key={i}
            className={cn(
              "text-sm text-amber-200/80 pl-4 border-l-2 border-amber-500/30",
            )}
          >
            {hint}
          </div>
        ))}
      </div>
    </div>
  )
}
