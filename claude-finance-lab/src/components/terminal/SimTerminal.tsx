"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Terminal } from "lucide-react"
import { getSimulationResponse } from "@/lib/simulator"
import { ResultRenderer } from "@/components/terminal/ResultRenderer"
import type { SimulationResponse } from "@/types/simulation"

type TerminalLine = { type: "input" | "loading"; text?: string }

interface SimTerminalProps {
  readonly command: string
  readonly sandboxResponseId?: string
}

/**
 * Simulation terminal that animates on mount.
 * Use `key={command}` on the parent to trigger re-mount when the command changes.
 */
export function SimTerminal({ command, sandboxResponseId }: SimTerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [response, setResponse] = useState<SimulationResponse | undefined>()
  const [phase, setPhase] = useState<"typing" | "loading" | "done">("typing")
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [])

  // Run animation sequence on mount
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setLines([{ type: "input", text: command }])
      setPhase("loading")
      scrollToBottom()
    }, 300)

    const timer2 = setTimeout(() => {
      setLines((prev) => [...prev, { type: "loading", text: "처리 중..." }])
      scrollToBottom()
    }, 600)

    const timer3 = setTimeout(() => {
      const result = sandboxResponseId
        ? getSimulationResponse(sandboxResponseId)
        : getSimulationResponse(command)

      setResponse(result)
      setPhase("done")
      setLines((prev) => prev.filter((l) => l.type !== "loading"))
      scrollToBottom()
    }, 1500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  // Run only on mount - parent uses key={command} for re-mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="rounded-lg border border-border bg-slate-950 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border-b border-border">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Terminal className="h-3 w-3" />
          Simulation Terminal
        </div>
      </div>

      <div ref={containerRef} className="p-4 max-h-96 overflow-y-auto space-y-2 font-mono text-sm">
        {lines.map((line, i) => (
          <div key={i}>
            {line.type === "input" && (
              <div>
                <span className="text-blue-400">$ </span>
                <span className="text-green-400">{line.text}</span>
              </div>
            )}
            {line.type === "loading" && (
              <div className="text-amber-400 flex items-center gap-2">
                <span className="animate-pulse">...</span>
                {line.text}
              </div>
            )}
          </div>
        ))}

        {phase === "done" && response && (
          <div className="mt-3 space-y-3">
            <div className="text-slate-500">{"═".repeat(40)}</div>
            <ResultRenderer response={response} />
          </div>
        )}

        {phase === "done" && !response && (
          <div className="text-red-400">
            시뮬레이션 데이터를 찾을 수 없습니다. Sandbox 모드에서는 미리 준비된 명령어만 실행할 수 있습니다.
          </div>
        )}

        {phase !== "done" && (
          <span className="inline-block w-2 h-4 bg-green-400 animate-blink" />
        )}
      </div>
    </div>
  )
}
