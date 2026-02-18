"use client"

import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StepNavigationProps {
  readonly currentStep: number
  readonly totalSteps: number
  readonly isCompleted: boolean
  readonly onPrevious: () => void
  readonly onNext: () => void
  readonly onComplete: () => void
}

export function StepNavigation({
  currentStep,
  totalSteps,
  isCompleted,
  onPrevious,
  onNext,
  onComplete,
}: StepNavigationProps) {
  const isFirst = currentStep === 0
  const isLast = currentStep === totalSteps - 1

  return (
    <div className="flex items-center justify-between border-t border-border pt-4 mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevious}
        disabled={isFirst}
        className="gap-1"
      >
        <ArrowLeft className="h-4 w-4" />
        이전
      </Button>

      <span className="text-xs text-muted-foreground">
        {currentStep + 1} / {totalSteps}
      </span>

      {isLast ? (
        <Button
          size="sm"
          onClick={onComplete}
          disabled={isCompleted}
          className="gap-1"
        >
          <CheckCircle className="h-4 w-4" />
          {isCompleted ? "완료됨" : "완료"}
        </Button>
      ) : (
        <Button
          size="sm"
          onClick={onNext}
          className="gap-1"
        >
          다음
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
