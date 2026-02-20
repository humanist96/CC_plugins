"use client"

interface PeriodSelectorProps {
  readonly year: string
  readonly reportCode: string
  readonly fsDiv: string
  readonly onChange: (year: string, reportCode: string, fsDiv: string) => void
}

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 6 }, (_, i) => (currentYear - 1 - i).toString())

const REPORT_CODES = [
  { value: "11011", label: "사업보고서" },
  { value: "11013", label: "1분기" },
  { value: "11012", label: "반기" },
  { value: "11014", label: "3분기" },
] as const

const FS_DIVS = [
  { value: "CFS", label: "연결" },
  { value: "OFS", label: "개별" },
] as const

export function PeriodSelector({ year, reportCode, fsDiv, onChange }: PeriodSelectorProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <select
        value={year}
        onChange={(e) => onChange(e.target.value, reportCode, fsDiv)}
        className="px-2.5 py-1.5 rounded-md bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {YEARS.map((y) => (
          <option key={y} value={y}>{y}년</option>
        ))}
      </select>

      <select
        value={reportCode}
        onChange={(e) => onChange(year, e.target.value, fsDiv)}
        className="px-2.5 py-1.5 rounded-md bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {REPORT_CODES.map((rc) => (
          <option key={rc.value} value={rc.value}>{rc.label}</option>
        ))}
      </select>

      <div className="flex rounded-md border border-border overflow-hidden">
        {FS_DIVS.map((fd) => (
          <button
            key={fd.value}
            onClick={() => onChange(year, reportCode, fd.value)}
            className={`px-3 py-1.5 text-xs transition-colors ${
              fsDiv === fd.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {fd.label}
          </button>
        ))}
      </div>
    </div>
  )
}
