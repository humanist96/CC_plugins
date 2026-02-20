"use client"

import { FileSearch, ExternalLink } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { DartDisclosure } from "@/types/dart"
import { formatDate } from "@/lib/dartMapper"

interface DisclosureListProps {
  readonly disclosures: readonly DartDisclosure[]
}

export function DisclosureList({ disclosures }: DisclosureListProps) {
  if (disclosures.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileSearch className="h-4 w-4" />
            최근 공시
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">공시 데이터가 없습니다.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <FileSearch className="h-4 w-4" />
          최근 공시
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-80 overflow-auto">
          {disclosures.map((d) => (
            <a
              key={d.rcept_no}
              href={`https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${encodeURIComponent(d.rcept_no)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-md border border-border/50 p-2.5 hover:bg-muted transition-colors group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">
                    {d.report_nm}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {formatDate(d.rcept_dt)} · {d.flr_nm}
                  </p>
                </div>
                <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
