"use client"

import { motion } from "framer-motion"
import { BookOpen, Terminal, BarChart3, Award } from "lucide-react"

const stats = [
  { icon: BookOpen, value: "8", label: "튜토리얼" },
  { icon: Terminal, value: "40+", label: "명령어" },
  { icon: BarChart3, value: "6", label: "차트 유형" },
  { icon: Award, value: "10", label: "배지" },
] as const

export function StatsBar() {
  return (
    <section className="py-16 border-y border-border">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
