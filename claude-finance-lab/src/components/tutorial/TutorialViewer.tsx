"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { StepSidebar } from "./StepSidebar"
import { StepContent } from "./StepContent"
import { StepNavigation } from "./StepNavigation"
import { SimTerminal } from "@/components/terminal/SimTerminal"
import { useProgressStore } from "@/stores/useProgressStore"
import type { Tutorial } from "@/types/tutorial"

const difficultyConfig = {
  beginner: { label: "초급", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  intermediate: { label: "중급", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  advanced: { label: "고급", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
} as const

interface TutorialViewerProps {
  readonly tutorial: Tutorial
}

export function TutorialViewer({ tutorial }: TutorialViewerProps) {
  const {
    startTutorial,
    completeStep,
    setCurrentStep,
    getTutorialProgress,
    updateStreak,
  } = useProgressStore()

  const progress = getTutorialProgress(tutorial.slug)
  const [activeStep, setActiveStep] = useState(progress?.currentStep ?? 0)
  const [showTerminal, setShowTerminal] = useState(false)
  const completedSteps = progress?.completedSteps ?? []

  useEffect(() => {
    startTutorial(tutorial.slug, tutorial.steps.length)
    updateStreak()
  }, [tutorial.slug, tutorial.steps.length, startTutorial, updateStreak])

  const step = tutorial.steps[activeStep]
  const difficulty = difficultyConfig[tutorial.difficulty]

  const completedPercent = tutorial.steps.length > 0
    ? Math.round((completedSteps.length / tutorial.steps.length) * 100)
    : 0

  const handleStepClick = useCallback((stepId: number) => {
    setActiveStep(stepId)
    setCurrentStep(tutorial.slug, stepId)
    setShowTerminal(false)
  }, [tutorial.slug, setCurrentStep])

  const handlePrevious = useCallback(() => {
    if (activeStep > 0) {
      handleStepClick(activeStep - 1)
    }
  }, [activeStep, handleStepClick])

  const handleNext = useCallback(() => {
    completeStep(tutorial.slug, activeStep, step.xpReward)
    if (activeStep < tutorial.steps.length - 1) {
      handleStepClick(activeStep + 1)
    }
  }, [activeStep, tutorial.slug, tutorial.steps.length, step.xpReward, completeStep, handleStepClick])

  const handleComplete = useCallback(() => {
    completeStep(tutorial.slug, activeStep, step.xpReward)
  }, [tutorial.slug, activeStep, step.xpReward, completeStep])

  const handleExecuteCommand = useCallback(() => {
    setShowTerminal(true)
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/tutorials">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              목록
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{tutorial.title}</h1>
              <Badge variant="outline" className={difficulty.color}>
                {difficulty.label}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{completedPercent}%</span>
          <Progress value={completedPercent} className="w-32 h-2" />
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-20 rounded-lg border border-border bg-card">
            <div className="p-3 border-b border-border">
              <h3 className="text-sm font-semibold">단계</h3>
            </div>
            <div className="max-h-[calc(100vh-12rem)]">
              <StepSidebar
                steps={tutorial.steps}
                currentStep={activeStep}
                completedSteps={completedSteps}
                onStepClick={handleStepClick}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="rounded-lg border border-border bg-card p-6">
            {step && (
              <StepContent
                step={step}
                onExecuteCommand={step.command ? handleExecuteCommand : undefined}
              />
            )}

            {showTerminal && step?.command && (
              <div className="mt-6">
                <SimTerminal
                  key={step.command.text}
                  command={step.command.text}
                  sandboxResponseId={step.command.sandboxResponseId}
                />
              </div>
            )}

            {step && (
              <StepNavigation
                currentStep={activeStep}
                totalSteps={tutorial.steps.length}
                isCompleted={completedSteps.includes(activeStep)}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onComplete={handleComplete}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
