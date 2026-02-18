"use client"

import Link from "next/link"
import { Clock, BookOpen } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useProgressStore } from "@/stores/useProgressStore"
import type { Tutorial } from "@/types/tutorial"

const difficultyConfig = {
  beginner: { label: "초급", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  intermediate: { label: "중급", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  advanced: { label: "고급", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
} as const

interface TutorialCardProps {
  readonly tutorial: Tutorial
  readonly index: number
}

export function TutorialCard({ tutorial, index }: TutorialCardProps) {
  const progress = useProgressStore((s) => s.tutorials[tutorial.slug])
  const difficulty = difficultyConfig[tutorial.difficulty]

  const completedPercent = progress
    ? Math.round((progress.completedSteps.length / progress.totalSteps) * 100)
    : 0

  return (
    <Link href={`/tutorials/${tutorial.slug}`}>
      <Card className="h-full hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 cursor-pointer group">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-mono">
              #{String(index + 1).padStart(2, "0")}
            </span>
            <Badge variant="outline" className={difficulty.color}>
              {difficulty.label}
            </Badge>
          </div>
          <CardTitle className="text-lg group-hover:text-primary transition-colors">
            {tutorial.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {tutorial.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1 mb-3">
            {tutorial.plugins.map((plugin) => (
              <Badge key={plugin} variant="secondary" className="text-xs font-mono">
                {plugin}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {tutorial.estimatedMinutes}분
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {tutorial.steps.length} 단계
            </span>
          </div>
        </CardContent>
        {progress && (
          <CardFooter>
            <div className="w-full">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">
                  {progress.status === "completed" ? "완료" : "진행 중"}
                </span>
                <span className="text-primary">{completedPercent}%</span>
              </div>
              <Progress value={completedPercent} className="h-1.5" />
            </div>
          </CardFooter>
        )}
      </Card>
    </Link>
  )
}
