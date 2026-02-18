"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"

const terminalLines = [
  { prompt: true, text: "/sales:account-research" },
  { prompt: false, text: '> "삼성SDS에 대해 리서치해줘"' },
  { prompt: false, text: "" },
  { prompt: false, text: "=== 기업 리서치 결과 ===" },
  { prompt: false, text: "삼성SDS (018260.KS)" },
  { prompt: false, text: "매출: 13.3조원 | 영업이익: 8,200억" },
  { prompt: false, text: "주요 서비스: 클라우드, AI, 보안, SI" },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-purple-900/10" />
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="gradient-text">Claude Finance Lab</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-lg">
              금융영업부서를 위한 Claude Code 플러그인 인터랙티브 실습 플랫폼.
              브라우저에서 바로 체험하고, 단계별로 학습하세요.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/tutorials">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  학습 시작하기
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/playground">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  <Terminal className="h-4 w-4" />
                  Playground
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-lg border border-border bg-card overflow-hidden shadow-2xl"
          >
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/50">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/60" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <div className="h-3 w-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-xs text-muted-foreground font-mono">claude-code</span>
            </div>
            <div className="p-4 font-mono text-sm space-y-1">
              {terminalLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.15 }}
                  className={line.prompt ? "text-green-400" : "text-slate-300"}
                >
                  {line.prompt && <span className="text-blue-400">$ </span>}
                  {line.text}
                </motion.div>
              ))}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="inline-block w-2 h-4 bg-green-400 animate-blink"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
