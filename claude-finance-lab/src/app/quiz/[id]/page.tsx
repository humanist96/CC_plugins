"use client"

import { use, useState, useCallback } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Check, X, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { getQuizById } from "@/data/quizzes"
import { useProgressStore } from "@/stores/useProgressStore"
import { cn } from "@/lib/utils"
import type { QuizQuestion } from "@/types/simulation"

export default function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const quiz = getQuizById(id)

  if (!quiz) {
    notFound()
  }

  return <QuizRunner quiz={{ id: quiz.id, tutorialSlug: quiz.tutorialSlug, title: quiz.title, questions: [...quiz.questions], passingScore: quiz.passingScore }} />
}

function QuizRunner({ quiz }: { quiz: { id: string; tutorialSlug: string; title: string; questions: QuizQuestion[]; passingScore: number } }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResult, setShowResult] = useState(false)
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({})
  const addXP = useProgressStore((s) => s.addXP)

  const question = quiz.questions[currentQ]
  const totalQuestions = quiz.questions.length

  const handleAnswer = useCallback((answer: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: answer }))
  }, [question.id])

  const handleSubmitQuestion = useCallback(() => {
    setSubmitted((prev) => ({ ...prev, [question.id]: true }))
  }, [question.id])

  const handleNext = useCallback(() => {
    if (currentQ < totalQuestions - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      const totalPoints = quiz.questions.reduce((acc, q) => {
        if (answers[q.id] === q.correctAnswer) return acc + q.points
        return acc
      }, 0)
      const maxPoints = quiz.questions.reduce((acc, q) => acc + q.points, 0)
      const score = Math.round((totalPoints / maxPoints) * 100)
      if (score >= quiz.passingScore) {
        addXP(totalPoints)
      }
      setShowResult(true)
    }
  }, [currentQ, totalQuestions, quiz.questions, quiz.passingScore, answers, addXP])

  const handleReset = useCallback(() => {
    setCurrentQ(0)
    setAnswers({})
    setShowResult(false)
    setSubmitted({})
  }, [])

  if (showResult) {
    const totalPoints = quiz.questions.reduce((acc, q) => {
      if (answers[q.id] === q.correctAnswer) return acc + q.points
      return acc
    }, 0)
    const maxPoints = quiz.questions.reduce((acc, q) => acc + q.points, 0)
    const score = Math.round((totalPoints / maxPoints) * 100)
    const passed = score >= quiz.passingScore

    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Card className={cn("text-center", passed ? "border-emerald-500/30" : "border-red-500/30")}>
          <CardContent className="pt-8 pb-6 space-y-4">
            <div className={cn("text-6xl font-bold", passed ? "text-emerald-400" : "text-red-400")}>
              {score}%
            </div>
            <div className="text-lg font-semibold">
              {passed ? "합격!" : "아쉽습니다"}
            </div>
            <p className="text-sm text-muted-foreground">
              {totalPoints}/{maxPoints}점 | 합격 기준: {quiz.passingScore}%
            </p>

            <div className="space-y-2 text-left mt-6">
              {quiz.questions.map((q) => {
                const isCorrect = answers[q.id] === q.correctAnswer
                return (
                  <div key={q.id} className="flex items-start gap-2 text-sm">
                    {isCorrect ? (
                      <Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                    ) : (
                      <X className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <div className={isCorrect ? "text-emerald-400" : "text-red-400"}>
                        Q{q.id}. {q.question}
                      </div>
                      {!isCorrect && (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          정답: {q.correctAnswer} | {q.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex gap-3 justify-center mt-6">
              <Button variant="outline" onClick={handleReset} className="gap-1">
                <RotateCcw className="h-4 w-4" />
                다시 풀기
              </Button>
              <Link href="/quiz">
                <Button className="gap-1">
                  <ArrowLeft className="h-4 w-4" />
                  퀴즈 목록
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isAnswered = answers[question.id] !== undefined
  const isSubmitted = submitted[question.id] === true
  const isCorrect = isSubmitted && answers[question.id] === question.correctAnswer

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <Link href="/quiz">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            목록
          </Button>
        </Link>
        <span className="text-sm text-muted-foreground">
          {currentQ + 1} / {totalQuestions}
        </span>
      </div>

      <Progress value={((currentQ + 1) / totalQuestions) * 100} className="h-2 mb-6" />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs">
              {question.type === "multiple_choice" ? "객관식" : "명령어 입력"}
            </Badge>
            <span className="text-xs text-muted-foreground">{question.points}점</span>
          </div>
          <CardTitle className="text-lg">{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {question.type === "multiple_choice" && question.options && (
            <div className="space-y-2">
              {question.options.map((option) => {
                const isSelected = answers[question.id] === option
                const showCorrect = isSubmitted && option === question.correctAnswer
                const showWrong = isSubmitted && isSelected && option !== question.correctAnswer
                return (
                  <button
                    key={option}
                    onClick={() => !isSubmitted && handleAnswer(option)}
                    disabled={isSubmitted}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-lg border text-sm transition-all",
                      !isSubmitted && isSelected && "border-primary bg-primary/10",
                      !isSubmitted && !isSelected && "border-border hover:border-muted-foreground",
                      showCorrect && "border-emerald-500 bg-emerald-500/10 text-emerald-400",
                      showWrong && "border-red-500 bg-red-500/10 text-red-400",
                    )}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          )}

          {question.type === "command_input" && (
            <input
              type="text"
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswer(e.target.value)}
              disabled={isSubmitted}
              placeholder="명령어를 입력하세요..."
              className="w-full px-4 py-3 rounded-lg bg-muted border border-border font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          )}

          {isSubmitted && (
            <div className={cn(
              "rounded-lg p-3 text-sm",
              isCorrect ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10"
            )}>
              <div className="font-semibold flex items-center gap-1 mb-1">
                {isCorrect ? (
                  <><Check className="h-4 w-4" /> 정답!</>
                ) : (
                  <><X className="h-4 w-4 text-red-400" /> <span className="text-red-400">오답</span></>
                )}
              </div>
              <p className="text-muted-foreground text-xs">{question.explanation}</p>
              {!isCorrect && (
                <p className="text-xs mt-1">정답: <span className="text-emerald-400 font-mono">{question.correctAnswer}</span></p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            {!isSubmitted && (
              <Button onClick={handleSubmitQuestion} disabled={!isAnswered} size="sm">
                제출
              </Button>
            )}
            {isSubmitted && (
              <Button onClick={handleNext} size="sm" className="gap-1">
                {currentQ < totalQuestions - 1 ? "다음" : "결과 보기"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
