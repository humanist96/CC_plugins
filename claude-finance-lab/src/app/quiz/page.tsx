"use client"

import Link from "next/link"
import { GraduationCap, ArrowRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { quizzes } from "@/data/quizzes"
import { tutorials } from "@/data/tutorials"

export default function QuizListPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">퀴즈</h1>
        <p className="mt-2 text-muted-foreground">
          튜토리얼에서 배운 내용을 테스트해보세요
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => {
          const tutorial = tutorials.find((t) => t.slug === quiz.tutorialSlug)
          return (
            <Link key={quiz.id} href={`/quiz/${quiz.id}`}>
              <Card className="h-full hover:border-primary/50 transition-all cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <Badge variant="secondary" className="text-xs">
                      {quiz.questions.length}문제
                    </Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {quiz.title}
                  </CardTitle>
                  <CardDescription>
                    {tutorial?.title} 기반
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      합격 기준: {quiz.passingScore}%
                    </span>
                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                      시작
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
