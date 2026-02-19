"use client"

import { forwardRef, useState, useEffect, type ReactNode, type ComponentPropsWithoutRef } from "react"
import ReactMarkdown from "react-markdown"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"
import type { ResolvedCompany } from "@/lib/reportCompanyResolver"
import type { DartCompanyOverview, DartFinancialItem, DartKeyAccount } from "@/types/dart"
import type { QuoteApiResponse } from "@/types/financialDatasets"
import { extractKeyMetrics, formatKrwAmount } from "@/lib/dartMapper"

interface ReportPdfViewProps {
  readonly reportText: string
  readonly reportCompany: ResolvedCompany
  readonly onDataReady?: () => void
}

const PDF_COLORS = {
  text: "#111827",
  textMuted: "#6b7280",
  border: "#e5e7eb",
  headerBg: "#1e3a5f",
  chart1: "#2563eb",
  chart2: "#059669",
  chart3: "#d97706",
} as const

interface KrData {
  readonly company: DartCompanyOverview | null
  readonly metrics: readonly DartKeyAccount[]
}

function formatPercent(value: number | null | undefined): string {
  if (value == null) return "-"
  return `${(value * 100).toFixed(1)}%`
}

function formatUsdCompact(amount: number | null | undefined): string {
  if (!amount) return "-"
  if (amount >= 1_000_000_000_000) return `$${(amount / 1_000_000_000_000).toFixed(2)}T`
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(2)}B`
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`
  return `$${amount.toLocaleString("en-US")}`
}

function PdfHeader({ company }: { readonly company: ResolvedCompany }) {
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const source = company.region === "KR" ? "DART / Claude AI" : "Financial Datasets / Claude AI"

  return (
    <div
      style={{
        backgroundColor: PDF_COLORS.headerBg,
        color: "#ffffff",
        padding: "32px 40px",
        marginBottom: "24px",
      }}
    >
      <div style={{ fontSize: "24px", fontWeight: 700, marginBottom: "6px" }}>
        {company.displayName}
      </div>
      <div style={{ fontSize: "14px", opacity: 0.85, marginBottom: "4px" }}>
        {company.region === "KR" ? "종합 분석 리포트" : "Analysis Report"}
      </div>
      <div style={{ fontSize: "11px", opacity: 0.65 }}>
        {today} | {source}
      </div>
    </div>
  )
}

function PdfFooter() {
  const now = new Date().toISOString().slice(0, 16).replace("T", " ")

  return (
    <div
      style={{
        borderTop: `1px solid ${PDF_COLORS.border}`,
        marginTop: "32px",
        paddingTop: "16px",
        fontSize: "9px",
        color: PDF_COLORS.textMuted,
        lineHeight: 1.6,
      }}
    >
      <div>
        본 리포트는 AI가 생성한 참고용 분석 자료이며, 투자 권유를 목적으로 하지 않습니다.
        투자 결정은 본인의 판단과 책임하에 이루어져야 합니다.
      </div>
      <div style={{ marginTop: "4px" }}>
        Generated: {now} | Claude Finance Lab
      </div>
    </div>
  )
}

function MarkdownSection({ text }: { readonly text: string }) {
  const components: ComponentPropsWithoutRef<typeof ReactMarkdown>["components"] = {
    h1: ({ children }: { children?: ReactNode }) => (
      <h1
        style={{
          fontSize: "18px",
          fontWeight: 700,
          color: PDF_COLORS.text,
          borderBottom: `2px solid ${PDF_COLORS.headerBg}`,
          paddingBottom: "6px",
          marginTop: "24px",
          marginBottom: "12px",
        }}
      >
        {children}
      </h1>
    ),
    h2: ({ children }: { children?: ReactNode }) => (
      <h2
        style={{
          fontSize: "15px",
          fontWeight: 600,
          color: PDF_COLORS.text,
          borderBottom: `1px solid ${PDF_COLORS.border}`,
          paddingBottom: "4px",
          marginTop: "20px",
          marginBottom: "10px",
        }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: ReactNode }) => (
      <h3
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: PDF_COLORS.text,
          marginTop: "16px",
          marginBottom: "8px",
        }}
      >
        {children}
      </h3>
    ),
    p: ({ children }: { children?: ReactNode }) => (
      <p
        style={{
          fontSize: "12px",
          color: PDF_COLORS.text,
          lineHeight: 1.7,
          marginBottom: "8px",
        }}
      >
        {children}
      </p>
    ),
    ul: ({ children }: { children?: ReactNode }) => (
      <ul style={{ paddingLeft: "20px", marginBottom: "8px" }}>{children}</ul>
    ),
    ol: ({ children }: { children?: ReactNode }) => (
      <ol style={{ paddingLeft: "20px", marginBottom: "8px" }}>{children}</ol>
    ),
    li: ({ children }: { children?: ReactNode }) => (
      <li
        style={{
          fontSize: "12px",
          color: PDF_COLORS.text,
          lineHeight: 1.7,
          marginBottom: "2px",
        }}
      >
        {children}
      </li>
    ),
    strong: ({ children }: { children?: ReactNode }) => (
      <strong style={{ fontWeight: 600, color: PDF_COLORS.text }}>{children}</strong>
    ),
    table: ({ children }: { children?: ReactNode }) => (
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "11px",
          marginBottom: "12px",
        }}
      >
        {children}
      </table>
    ),
    th: ({ children }: { children?: ReactNode }) => (
      <th
        style={{
          borderBottom: `2px solid ${PDF_COLORS.border}`,
          padding: "6px 8px",
          textAlign: "left",
          fontWeight: 600,
          color: PDF_COLORS.text,
          backgroundColor: "#f9fafb",
        }}
      >
        {children}
      </th>
    ),
    td: ({ children }: { children?: ReactNode }) => (
      <td
        style={{
          borderBottom: `1px solid ${PDF_COLORS.border}`,
          padding: "5px 8px",
          color: PDF_COLORS.text,
        }}
      >
        {children}
      </td>
    ),
  }

  return (
    <div style={{ padding: "0 40px" }}>
      <ReactMarkdown components={components}>{text}</ReactMarkdown>
    </div>
  )
}

function KrChartSection({ metrics }: { readonly metrics: readonly DartKeyAccount[] }) {
  const chartData = metrics
    .filter((m) => m.label !== "자산총계")
    .map((m) => ({
      name: m.label,
      "\uC804\uC804\uAE30": m.bfefrmtrm ? m.bfefrmtrm / 1_0000_0000 : 0,
      "\uC804\uAE30": m.frmtrm ? m.frmtrm / 1_0000_0000 : 0,
      "\uB2F9\uAE30": m.thstrm ? m.thstrm / 1_0000_0000 : 0,
    }))

  if (chartData.every((d) => d["\uB2F9\uAE30"] === 0 && d["\uC804\uAE30"] === 0 && d["\uC804\uC804\uAE30"] === 0)) {
    return null
  }

  return (
    <div style={{ padding: "0 40px", marginTop: "24px" }}>
      <div
        style={{
          borderTop: `1px solid ${PDF_COLORS.border}`,
          paddingTop: "20px",
          marginBottom: "12px",
        }}
      >
        <div style={{ fontSize: "15px", fontWeight: 600, color: PDF_COLORS.text, marginBottom: "4px" }}>
          재무 추이 비교
        </div>
        <div style={{ fontSize: "10px", color: PDF_COLORS.textMuted }}>단위: 억원</div>
      </div>
      <div style={{ width: "100%", height: "280px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={PDF_COLORS.border} />
            <XAxis
              dataKey="name"
              tick={{ fill: PDF_COLORS.textMuted, fontSize: 11 }}
            />
            <YAxis
              tick={{ fill: PDF_COLORS.textMuted, fontSize: 11 }}
              tickFormatter={(v: number) => formatKrwAmount(v * 1_0000_0000)}
            />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Bar dataKey="전전기" fill={PDF_COLORS.chart3} radius={[2, 2, 0, 0]} />
            <Bar dataKey="전기" fill={PDF_COLORS.chart2} radius={[2, 2, 0, 0]} />
            <Bar dataKey="당기" fill={PDF_COLORS.chart1} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function UsDataSection({ quote }: { readonly quote: QuoteApiResponse }) {
  const { price, company, metrics } = quote
  const changePositive = (price?.day_change ?? 0) >= 0

  return (
    <div style={{ padding: "0 40px", marginTop: "24px" }}>
      <div
        style={{
          borderTop: `1px solid ${PDF_COLORS.border}`,
          paddingTop: "20px",
          marginBottom: "16px",
        }}
      >
        <div style={{ fontSize: "15px", fontWeight: 600, color: PDF_COLORS.text }}>
          Market Data
        </div>
      </div>

      {price && (
        <div
          style={{
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "16px",
          }}
        >
          <div style={{ fontSize: "10px", color: PDF_COLORS.textMuted, marginBottom: "4px" }}>
            Stock Price
          </div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: PDF_COLORS.text }}>
            ${price.price.toFixed(2)}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: changePositive ? "#16a34a" : "#dc2626",
              marginTop: "2px",
            }}
          >
            {changePositive ? "+" : ""}${price.day_change.toFixed(2)} (
            {changePositive ? "+" : ""}{price.day_change_percent.toFixed(2)}%)
          </div>
        </div>
      )}

      {company && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            marginBottom: "16px",
            fontSize: "11px",
          }}
        >
          <div>
            <span style={{ color: PDF_COLORS.textMuted }}>Sector: </span>
            <span style={{ color: PDF_COLORS.text }}>{company.sector}</span>
          </div>
          <div>
            <span style={{ color: PDF_COLORS.textMuted }}>Exchange: </span>
            <span style={{ color: PDF_COLORS.text }}>{company.exchange}</span>
          </div>
          <div>
            <span style={{ color: PDF_COLORS.textMuted }}>Market Cap: </span>
            <span style={{ color: PDF_COLORS.text }}>{formatUsdCompact(company.market_cap)}</span>
          </div>
          <div>
            <span style={{ color: PDF_COLORS.textMuted }}>Employees: </span>
            <span style={{ color: PDF_COLORS.text }}>
              {company.number_of_employees?.toLocaleString("en-US") ?? "-"}
            </span>
          </div>
        </div>
      )}

      {metrics && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: "8px",
          }}
        >
          {[
            { label: "P/E", value: metrics.price_to_earnings_ratio?.toFixed(1) ?? "-" },
            { label: "ROE", value: formatPercent(metrics.return_on_equity) },
            { label: "Gross Margin", value: formatPercent(metrics.gross_margin) },
            { label: "EPS", value: metrics.earnings_per_share != null ? `$${metrics.earnings_per_share.toFixed(2)}` : "-" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                backgroundColor: "#f9fafb",
                borderRadius: "6px",
                padding: "10px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "9px", color: PDF_COLORS.textMuted, marginBottom: "4px" }}>
                {item.label}
              </div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: PDF_COLORS.text }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const ReportPdfView = forwardRef<HTMLDivElement, ReportPdfViewProps>(
  function ReportPdfView({ reportText, reportCompany, onDataReady }, ref) {
    const [krData, setKrData] = useState<KrData | null>(null)
    const [usQuote, setUsQuote] = useState<QuoteApiResponse | null>(null)

    useEffect(() => {
      let cancelled = false

      async function fetchData() {
        try {
          if (reportCompany.region === "KR" && reportCompany.corpCode) {
            const currentYear = (new Date().getFullYear() - 1).toString()
            const [companyRes, financialRes] = await Promise.all([
              fetch(`/api/dart/company?corp_code=${reportCompany.corpCode}`),
              fetch(
                `/api/dart/financials?corp_code=${reportCompany.corpCode}&year=${currentYear}&report_code=11011&fs_div=CFS`
              ),
            ])

            const [companyData, financialData] = await Promise.all([
              companyRes.json() as Promise<{ company?: DartCompanyOverview; error?: string }>,
              financialRes.json() as Promise<{ items?: DartFinancialItem[]; error?: string }>,
            ])

            if (!cancelled) {
              const items = financialData.items ?? []
              setKrData({
                company: companyData.company ?? null,
                metrics: extractKeyMetrics(items),
              })
            }
          } else if (reportCompany.region === "US" && reportCompany.ticker) {
            const res = await fetch(`/api/finance/quote?ticker=${reportCompany.ticker}`)
            const data = (await res.json()) as QuoteApiResponse

            if (!cancelled) {
              setUsQuote(data)
            }
          }
        } catch {
          // Data fetch failure is non-critical for PDF
        }

        if (!cancelled) {
          onDataReady?.()
        }
      }

      fetchData()
      return () => {
        cancelled = true
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reportCompany.region, reportCompany.corpCode, reportCompany.ticker])

    return (
      <div
        ref={ref}
        style={{
          position: "fixed",
          left: "-9999px",
          top: 0,
          width: "794px",
          backgroundColor: "#ffffff",
          color: PDF_COLORS.text,
          fontFamily: "'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
        }}
      >
        <PdfHeader company={reportCompany} />
        <MarkdownSection text={reportText} />

        {reportCompany.region === "KR" && krData && krData.metrics.length > 0 && (
          <KrChartSection metrics={krData.metrics} />
        )}

        {reportCompany.region === "US" && usQuote && (
          <UsDataSection quote={usQuote} />
        )}

        <div style={{ padding: "0 40px" }}>
          <PdfFooter />
        </div>
      </div>
    )
  }
)
