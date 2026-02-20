"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, Building2, Loader2 } from "lucide-react"
import type { DartSearchResult } from "@/types/dart"

interface CompanySearchProps {
  readonly onSelect: (company: DartSearchResult) => void
}

export function CompanySearch({ onSelect }: CompanySearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<readonly DartSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 1) {
      setResults([])
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`/api/dart/search?q=${encodeURIComponent(q.trim())}`)
      if (!res.ok) throw new Error("검색 실패")
      const data = (await res.json()) as { results: DartSearchResult[] }
      setResults(data.results)
      setIsOpen(data.results.length > 0)
    } catch {
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(query), 500)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, search])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleSelect(company: DartSearchResult) {
    setQuery(company.corp_name)
    setIsOpen(false)
    onSelect(company)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="기업명 검색 (예: 삼성전자, SK하이닉스, 네이버)"
          className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-background shadow-lg max-h-60 overflow-auto">
          {results.map((company) => (
            <button
              key={company.corp_code}
              onClick={() => handleSelect(company)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted transition-colors text-sm"
            >
              <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <div className="font-medium truncate">{company.corp_name}</div>
                {company.stock_code && (
                  <div className="text-xs text-muted-foreground">{company.stock_code}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
