"use client"

import { Check, Circle, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { TutorialStep } from "@/types/tutorial"

interface StepSidebarProps {
  readonly steps: readonly TutorialStep[]
  readonly currentStep: number
  readonly completedSteps: readonly number[]
  readonly onStepClick: (stepId: number) => void
}

export function StepSidebar({ steps, currentStep, completedSteps, onStepClick }: StepSidebarProps) {
  return (
    <ScrollArea className="h-full">
      <nav className="space-y-1 p-3">
        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.id)
          const isCurrent = step.id === currentStep
          return (
            <button
              key={step.id}
              onClick={() => onStepClick(step.id)}
              className={cn(
                "w-full flex items-start gap-2.5 rounded-md px-3 py-2 text-left text-sm transition-colors",
                isCurrent && "bg-primary/10 text-primary",
                !isCurrent && !isCompleted && "text-muted-foreground hover:bg-muted",
                isCompleted && !isCurrent && "text-emerald-400 hover:bg-muted"
              )}
            >
              <span className="mt-0.5 shrink-0">
                {isCompleted ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : isCurrent ? (
                  <ChevronRight className="h-4 w-4 text-primary" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </span>
              <span className="line-clamp-2">{step.title}</span>
            </button>
          )
        })}
      </nav>
    </ScrollArea>
  )
}
