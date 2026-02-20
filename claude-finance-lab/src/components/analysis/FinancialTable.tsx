"use client"

import type { FinancialTableData } from "@/types/dart"

interface FinancialTableProps {
  readonly data: FinancialTableData
}

export function FinancialTable({ data }: FinancialTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 px-3 font-medium text-muted-foreground w-[40%]">
              계정명
            </th>
            <th className="text-right py-2 px-3 font-medium text-muted-foreground">
              {data.thstrmName}
            </th>
            <th className="text-right py-2 px-3 font-medium text-muted-foreground">
              {data.frmtrmName}
            </th>
            <th className="text-right py-2 px-3 font-medium text-muted-foreground">
              {data.bfefrmtrmName}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, idx) => (
            <tr
              key={`${row.accountName}-${idx}`}
              className="border-b border-border/50 hover:bg-muted/30 transition-colors"
            >
              <td className="py-1.5 px-3 text-foreground">{row.accountName}</td>
              <td className="py-1.5 px-3 text-right font-mono text-xs">
                {row.thstrm}
              </td>
              <td className="py-1.5 px-3 text-right font-mono text-xs text-muted-foreground">
                {row.frmtrm}
              </td>
              <td className="py-1.5 px-3 text-right font-mono text-xs text-muted-foreground">
                {row.bfefrmtrm}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
