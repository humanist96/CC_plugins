"use client"

import { CommandBlock } from "./CommandBlock"
import { HintSystem } from "./HintSystem"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"
import type { TutorialStep } from "@/types/tutorial"

interface StepContentProps {
  readonly step: TutorialStep
  readonly onExecuteCommand?: () => void
}

export function StepContent({ step, onExecuteCommand }: StepContentProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold">{step.title}</h2>
        <Badge variant="outline" className="text-xs">
          {step.type === "guide" ? "가이드" : step.type === "exercise" ? "실습" : "퀴즈"}
        </Badge>
        <div className="flex items-center gap-1 text-xs text-amber-400 ml-auto">
          <Sparkles className="h-3 w-3" />
          +{step.xpReward} XP
        </div>
      </div>

      <div className="prose prose-invert prose-sm max-w-none">
        {step.content.split("\n").map((line, i) => {
          if (line.startsWith("| ") && line.endsWith(" |")) {
            return (
              <div key={i} className="font-mono text-xs text-muted-foreground overflow-x-auto">
                {line}
              </div>
            )
          }
          if (line.startsWith("**") && line.endsWith("**")) {
            return <p key={i} className="font-semibold text-foreground">{line.replace(/\*\*/g, "")}</p>
          }
          if (line.startsWith("- ")) {
            return (
              <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary mt-1">&#8226;</span>
                <span>{line.slice(2)}</span>
              </div>
            )
          }
          if (line === "") return <br key={i} />
          return <p key={i} className="text-sm text-muted-foreground leading-relaxed">{line}</p>
        })}
      </div>

      {step.command && (
        <CommandBlock
          command={step.command.text}
          plugin={step.command.plugin}
          onExecute={onExecuteCommand}
        />
      )}

      {step.expectedResult && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
          <p className="text-sm text-emerald-400">
            <span className="font-semibold">예상 결과: </span>
            {step.expectedResult}
          </p>
        </div>
      )}

      {step.hints && step.hints.length > 0 && (
        <HintSystem hints={step.hints} />
      )}
    </div>
  )
}
