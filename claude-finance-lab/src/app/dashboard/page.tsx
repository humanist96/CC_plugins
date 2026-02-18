"use client"

import { useProgressStore } from "@/stores/useProgressStore"
import { tutorials } from "@/data/tutorials"
import { badges } from "@/data/badges"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Sparkles,
  BookOpen,
  Clock,
  Flame,
  Award,
  ArrowRight,
  Star,
  TrendingUp,
  Briefcase,
  Activity,
  DollarSign,
  BarChart3,
  Headphones,
  Rocket,
  Crown,
} from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Star, TrendingUp, Briefcase, Activity, DollarSign, BarChart3,
  Headphones, Rocket, Flame, Crown,
}

export default function DashboardPage() {
  const { totalXP, streakDays, badges: earnedBadges, tutorials: tutorialProgress } = useProgressStore()

  const completedCount = Object.values(tutorialProgress).filter(
    (t) => t.status === "completed"
  ).length

  const overallPercent = tutorials.length > 0
    ? Math.round((completedCount / tutorials.length) * 100)
    : 0

  const totalTime = Object.values(tutorialProgress).reduce(
    (acc, t) => acc + t.timeSpentSeconds,
    0
  )
  const timeMinutes = Math.round(totalTime / 60)

  const beginnerTutorials = tutorials.filter((t) => t.difficulty === "beginner")
  const intermediateTutorials = tutorials.filter((t) => t.difficulty === "intermediate")
  const advancedTutorials = tutorials.filter((t) => t.difficulty === "advanced")

  const getCompletedInGroup = (group: typeof tutorials) =>
    group.filter((t) => tutorialProgress[t.slug]?.status === "completed").length

  const nextTutorial = tutorials.find(
    (t) =>
      !tutorialProgress[t.slug] || tutorialProgress[t.slug].status !== "completed"
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">나의 학습 현황</h1>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-400/10">
                <Sparkles className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalXP}</div>
                <div className="text-xs text-muted-foreground">Total XP</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-400/10">
                <BookOpen className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{completedCount}/{tutorials.length}</div>
                <div className="text-xs text-muted-foreground">완료 튜토리얼</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-400/10">
                <Clock className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{timeMinutes}분</div>
                <div className="text-xs text-muted-foreground">학습 시간</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-400/10">
                <Flame className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{streakDays}일</div>
                <div className="text-xs text-muted-foreground">연속 학습</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Progress Overview */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>진행률 오버뷰</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>전체 진행률</span>
                  <span className="text-primary font-semibold">{overallPercent}%</span>
                </div>
                <Progress value={overallPercent} className="h-3" />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "초급", group: beginnerTutorials, color: "text-emerald-400", bgColor: "bg-emerald-400" },
                  { label: "중급", group: intermediateTutorials, color: "text-blue-400", bgColor: "bg-blue-400" },
                  { label: "고급", group: advancedTutorials, color: "text-purple-400", bgColor: "bg-purple-400" },
                ].map((level) => {
                  const completed = getCompletedInGroup(level.group)
                  const total = level.group.length
                  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
                  return (
                    <div key={level.label} className="rounded-lg border border-border p-4 text-center">
                      <div className={`text-sm font-semibold ${level.color} mb-1`}>{level.label}</div>
                      <div className="text-2xl font-bold">{pct}%</div>
                      <div className="text-xs text-muted-foreground">{completed}/{total} 완료</div>
                      <Progress value={pct} className="h-1.5 mt-2" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Tutorial List */}
          <Card>
            <CardHeader>
              <CardTitle>튜토리얼 진행 상태</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tutorials.map((t, i) => {
                  const p = tutorialProgress[t.slug]
                  const pct = p ? Math.round((p.completedSteps.length / p.totalSteps) * 100) : 0
                  return (
                    <Link key={t.slug} href={`/tutorials/${t.slug}`} className="block">
                      <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors">
                        <span className="text-xs text-muted-foreground font-mono w-6">
                          #{String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{t.title}</div>
                          <Progress value={pct} className="h-1 mt-1" />
                        </div>
                        <span className="text-xs text-muted-foreground">{pct}%</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Next Recommended */}
          {nextTutorial && (
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="text-base">추천 다음 단계</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold">{nextTutorial.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {nextTutorial.description}
                </p>
                <Link href={`/tutorials/${nextTutorial.slug}`}>
                  <Button size="sm" className="mt-4 gap-1 w-full">
                    학습 시작
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Badges */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-400" />
                <CardTitle className="text-base">배지 ({earnedBadges.length}/{badges.length})</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {badges.map((badge) => {
                  const earned = earnedBadges.includes(badge.id)
                  const IconComponent = iconMap[badge.icon]
                  return (
                    <div
                      key={badge.id}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                        earned ? "bg-amber-400/10" : "bg-muted/30 opacity-40"
                      }`}
                      title={`${badge.name}: ${badge.description}`}
                    >
                      {IconComponent && (
                        <IconComponent
                          className={`h-5 w-5 ${earned ? "text-amber-400" : "text-muted-foreground"}`}
                        />
                      )}
                      <span className="text-[10px] text-center leading-tight truncate w-full">
                        {badge.name}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
