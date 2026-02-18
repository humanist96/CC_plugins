"use client"

import { useState } from "react"
import { Check, Copy, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CommandBlockProps {
  readonly command: string
  readonly plugin?: string
  readonly onExecute?: () => void
}

export function CommandBlock({ command, plugin, onExecute }: CommandBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-lg border border-border bg-slate-950 overflow-hidden my-4">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Terminal className="h-3 w-3" />
          {plugin && <span className="font-mono">{plugin}</span>}
        </div>
        <div className="flex items-center gap-1">
          {onExecute && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs gap-1 text-emerald-400 hover:text-emerald-300"
              onClick={onExecute}
            >
              <Terminal className="h-3 w-3" />
              실행
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-6 text-xs gap-1",
              copied ? "text-emerald-400" : "text-muted-foreground"
            )}
            onClick={handleCopy}
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "복사됨" : "복사"}
          </Button>
        </div>
      </div>
      <div className="p-3">
        <code className="font-mono text-sm text-emerald-400 whitespace-pre-wrap">
          {command}
        </code>
      </div>
    </div>
  )
}
