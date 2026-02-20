"use client"

import { useState } from "react"
import { FileText } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { FinancialTable } from "./FinancialTable"
import type { FinancialTableData } from "@/types/dart"

interface FinancialStatementsProps {
  readonly tableData: readonly FinancialTableData[]
  readonly year: string
  readonly reportLabel: string
}

const TAB_ORDER = ["BS", "IS", "CIS", "CF", "SCE"] as const

export function FinancialStatements({ tableData, year, reportLabel }: FinancialStatementsProps) {
  const availableTabs = TAB_ORDER.filter((sjDiv) =>
    tableData.some((d) => d.sjDiv === sjDiv)
  )
  const [activeTab, setActiveTab] = useState<string>(availableTabs[0] ?? "BS")

  const activeData = tableData.find((d) => d.sjDiv === activeTab)

  if (tableData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            재무제표
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">재무제표 데이터가 없습니다.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            재무제표
          </CardTitle>
          <span className="text-xs text-muted-foreground">
            {year}년 {reportLabel}
          </span>
        </div>
        <div className="flex gap-1 mt-3">
          {availableTabs.map((sjDiv) => {
            const data = tableData.find((d) => d.sjDiv === sjDiv)
            return (
              <button
                key={sjDiv}
                onClick={() => setActiveTab(sjDiv)}
                className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                  activeTab === sjDiv
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {data?.sjName ?? sjDiv}
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent>
        {activeData ? (
          <FinancialTable data={activeData} />
        ) : (
          <p className="text-sm text-muted-foreground">해당 재무제표를 선택해주세요.</p>
        )}
      </CardContent>
    </Card>
  )
}
