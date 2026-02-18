import { Terminal } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border py-6">
      <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4" />
          <span>Claude Finance Lab - Koscom</span>
        </div>
        <p>Powered by Claude Code Plugins & MCP</p>
      </div>
    </footer>
  )
}
