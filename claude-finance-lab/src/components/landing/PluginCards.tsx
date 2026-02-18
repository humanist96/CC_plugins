"use client"

import { motion } from "framer-motion"
import { Briefcase, DollarSign, BarChart3, Headphones } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const plugins = [
  {
    name: "Sales",
    icon: Briefcase,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    description: "고객 리서치, 콜 준비, 파이프라인 관리, 매출 예측",
    commands: [
      "account-research",
      "call-prep",
      "pipeline-review",
      "forecast",
    ],
  },
  {
    name: "Finance",
    icon: DollarSign,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    description: "재무제표 생성, 분개장, 계정 대조, 예산 분석",
    commands: [
      "financial-statements",
      "journal-entry-prep",
      "reconciliation",
      "variance-analysis",
    ],
  },
  {
    name: "Data",
    icon: BarChart3,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    description: "SQL 쿼리 작성, 데이터 탐색, 대시보드 생성, 시각화",
    commands: [
      "write-query",
      "explore-data",
      "build-dashboard",
      "create-viz",
    ],
  },
  {
    name: "Support",
    icon: Headphones,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    description: "티켓 분류, 고객 응답, 에스컬레이션, KB 문서 작성",
    commands: [
      "triage",
      "draft-response",
      "escalate",
      "kb-article",
    ],
  },
] as const

export function PluginCards() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">4대 플러그인</h2>
          <p className="mt-2 text-muted-foreground">
            영업부서 업무 전반을 커버하는 Claude Code 플러그인
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plugins.map((plugin, i) => {
            const Icon = plugin.icon
            return (
              <motion.div
                key={plugin.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className={`inline-flex p-2 rounded-lg ${plugin.bgColor} w-fit`}>
                      <Icon className={`h-6 w-6 ${plugin.color}`} />
                    </div>
                    <CardTitle className="text-lg">{plugin.name}</CardTitle>
                    <CardDescription>{plugin.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {plugin.commands.map((cmd) => (
                        <Badge key={cmd} variant="secondary" className="text-xs font-mono">
                          {cmd}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
