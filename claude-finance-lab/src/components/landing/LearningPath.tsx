"use client"

import { motion } from "framer-motion"
import { BookOpen, Code, Rocket } from "lucide-react"

const steps = [
  {
    icon: BookOpen,
    level: "초급",
    color: "text-emerald-400",
    borderColor: "border-emerald-400",
    bgColor: "bg-emerald-400/10",
    tutorials: ["01. 시작하기", "02. 주식 정보 조회", "03. 영업 플러그인"],
    description: "기본 명령어와 MCP 사용법을 익히세요",
  },
  {
    icon: Code,
    level: "중급",
    color: "text-blue-400",
    borderColor: "border-blue-400",
    bgColor: "bg-blue-400/10",
    tutorials: ["04. 재무 분석", "05. 데이터 분석", "06. 기술적 지표", "07. 고객 관리"],
    description: "실무에 플러그인을 직접 적용하세요",
  },
  {
    icon: Rocket,
    level: "고급",
    color: "text-purple-400",
    borderColor: "border-purple-400",
    bgColor: "bg-purple-400/10",
    tutorials: ["08. 심화 워크플로우"],
    description: "여러 플러그인을 조합한 복합 시나리오",
  },
] as const

export function LearningPath() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">학습 경로</h2>
          <p className="mt-2 text-muted-foreground">
            초급부터 고급까지, 단계별로 실력을 키워보세요
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.level}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className={`relative rounded-lg border-2 ${step.borderColor} p-6 bg-card`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${step.bgColor}`}>
                    <Icon className={`h-5 w-5 ${step.color}`} />
                  </div>
                  <div>
                    <span className={`text-sm font-semibold ${step.color}`}>Level {i + 1}</span>
                    <h3 className="text-xl font-bold">{step.level}</h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                <ul className="space-y-2">
                  {step.tutorials.map((t) => (
                    <li key={t} className="text-sm flex items-center gap-2">
                      <div className={`h-1.5 w-1.5 rounded-full ${step.color.replace("text-", "bg-")}`} />
                      {t}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
