"use client"

import { useState, useMemo } from "react"
import { Search, Copy, Check, BookOpen } from "lucide-react"
import Link from "next/link"
import { commands, pluginCategories } from "@/data/commands"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ReferencePage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("전체")
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return commands.filter((cmd) => {
      const matchesCategory = category === "전체" || cmd.category === category
      const matchesSearch =
        search === "" ||
        cmd.command.toLowerCase().includes(search.toLowerCase()) ||
        cmd.description.includes(search) ||
        cmd.examples.some((e) => e.includes(search))
      return matchesCategory && matchesSearch
    })
  }, [search, category])

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedCmd(text)
    setTimeout(() => setCopiedCmd(null), 2000)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">명령어 레퍼런스</h1>
        <p className="mt-2 text-muted-foreground">
          {commands.length}개 명령어의 상세 사용법과 예시
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="명령어 또는 키워드 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {pluginCategories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filtered.map((cmd) => (
          <Card key={cmd.command} className="hover:border-primary/30 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base font-mono text-primary">
                    {cmd.command}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">{cmd.plugin}</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-xs"
                  onClick={() => handleCopy(cmd.command)}
                >
                  {copiedCmd === cmd.command ? (
                    <><Check className="h-3 w-3 text-emerald-400" /> 복사됨</>
                  ) : (
                    <><Copy className="h-3 w-3" /> 복사</>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{cmd.description}</p>

              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-1">사용 예시:</h4>
                <div className="space-y-1">
                  {cmd.examples.map((ex, i) => (
                    <div key={i} className="text-sm font-mono bg-muted rounded px-2 py-1">
                      {ex}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {cmd.relatedCommands.map((rc) => (
                    <Badge key={rc} variant="outline" className="text-xs font-mono">
                      {rc}
                    </Badge>
                  ))}
                </div>
                {cmd.tutorialSlug && (
                  <Link href={`/tutorials/${cmd.tutorialSlug}`} className="text-xs text-primary hover:underline flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    튜토리얼에서 배우기
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            검색 결과가 없습니다. 다른 키워드로 검색해보세요.
          </div>
        )}
      </div>
    </div>
  )
}
