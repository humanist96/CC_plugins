"use client"

import { forwardRef, useState, useEffect, type ReactNode, type ComponentPropsWithoutRef } from "react"
import ReactMarkdown from "react-markdown"
import {
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"
import type { ResolvedCompany } from "@/lib/reportCompanyResolver"
import type { DartCompanyOverview, DartFinancialItem, DartKeyAccount } from "@/types/dart"
import type { QuoteApiResponse } from "@/types/financialDatasets"
import { extractKeyMetrics, formatKrwAmount, getCorpClsLabel, formatDate } from "@/lib/dartMapper"

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
  bgLight: "#f9fafb",
  bgAccent: "#eff6ff",
  chart1: "#2563eb",
  chart2: "#059669",
  chart3: "#d97706",
  chart4: "#dc2626",
  positive: "#16a34a",
  negative: "#dc2626",
} as const

const US_MARGIN_FILLS = [PDF_COLORS.chart1, PDF_COLORS.chart2, PDF_COLORS.chart3] as const

interface KrData {
  readonly company: DartCompanyOverview | null
  readonly metrics: readonly DartKeyAccount[]
  readonly allItems: readonly DartFinancialItem[]  // retained for future profitability calculations
}

function formatPercent(value: number | null | undefined): string {
  if (value == null) return "-"
  return `${(value * 100).toFixed(1)}%`
}

function formatUsdCompact(amount: number | null | undefined): string {
  if (amount == null) return "-"
  if (amount === 0) return "$0"
  if (amount >= 1_000_000_000_000) return `$${(amount / 1_000_000_000_000).toFixed(2)}T`
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(2)}B`
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`
  return `$${amount.toLocaleString("en-US")}`
}

function formatYoy(value: number | null | undefined): { text: string; color: string } {
  if (value == null) return { text: "-", color: PDF_COLORS.textMuted }
  const sign = value > 0 ? "+" : ""
  const color = value > 0 ? PDF_COLORS.positive : value < 0 ? PDF_COLORS.negative : PDF_COLORS.textMuted
  return { text: `${sign}${value.toFixed(1)}%`, color }
}

/* ─── Layout Primitives ─── */

function SectionDivider({ title }: { readonly title: string }) {
  return (
    <div
      style={{
        padding: "0 40px",
        marginTop: "28px",
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          borderLeft: `3px solid ${PDF_COLORS.headerBg}`,
          paddingLeft: "12px",
          fontSize: "15px",
          fontWeight: 600,
          color: PDF_COLORS.text,
        }}
      >
        {title}
      </div>
    </div>
  )
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
        {company.region === "KR" ? "종합 분석 리포트" : "Comprehensive Analysis Report"}
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

/* ─── Markdown with div-based tables ─── */

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
    /* div-based table rendering for html2canvas compatibility */
    table: ({ children }: { children?: ReactNode }) => (
      <div
        style={{
          border: `1px solid ${PDF_COLORS.border}`,
          borderRadius: "6px",
          overflow: "hidden",
          fontSize: "11px",
          marginBottom: "12px",
        }}
      >
        {children}
      </div>
    ),
    thead: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
    tbody: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
    tr: ({ children }: { children?: ReactNode }) => (
      <div
        style={{
          display: "flex",
          borderBottom: `1px solid ${PDF_COLORS.border}`,
        }}
      >
        {children}
      </div>
    ),
    th: ({ children }: { children?: ReactNode }) => (
      <div
        style={{
          flex: 1,
          padding: "6px 8px",
          fontWeight: 600,
          color: PDF_COLORS.text,
          backgroundColor: PDF_COLORS.bgLight,
        }}
      >
        {children}
      </div>
    ),
    td: ({ children }: { children?: ReactNode }) => (
      <div
        style={{
          flex: 1,
          padding: "5px 8px",
          color: PDF_COLORS.text,
        }}
      >
        {children}
      </div>
    ),
  }

  return (
    <div style={{ padding: "0 40px" }}>
      <ReactMarkdown components={components}>{text}</ReactMarkdown>
    </div>
  )
}

/* ─── Metric Card Grid (shared) ─── */

interface MetricCardItem {
  readonly label: string
  readonly value: string
  readonly color?: string
}

function MetricCardGrid({ items, columns = 3 }: { readonly items: readonly MetricCardItem[]; readonly columns?: number }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: "8px",
        padding: "0 40px",
        marginBottom: "16px",
      }}
    >
      {items.map((item) => (
        <div
          key={item.label}
          style={{
            backgroundColor: PDF_COLORS.bgLight,
            borderRadius: "6px",
            padding: "10px 12px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "9px", color: PDF_COLORS.textMuted, marginBottom: "4px" }}>
            {item.label}
          </div>
          <div style={{ fontSize: "14px", fontWeight: 600, color: item.color ?? PDF_COLORS.text }}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── KR: Company Profile ─── */

function KrCompanyProfile({ company }: { readonly company: DartCompanyOverview }) {
  const profileItems = [
    { label: "대표자", value: company.ceo_nm },
    { label: "시장구분", value: `${getCorpClsLabel(company.corp_cls)}${company.stock_code ? ` (${company.stock_code})` : ""}` },
    { label: "설립일", value: formatDate(company.est_dt) },
    { label: "결산월", value: `${company.acc_mt}월` },
    { label: "업종코드", value: company.induty_code || "-" },
    { label: "홈페이지", value: company.hm_url || "-" },
  ]

  return (
    <div style={{ padding: "0 40px", marginBottom: "16px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0",
          border: `1px solid ${PDF_COLORS.border}`,
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
        {profileItems.map((item, idx) => {
          const totalRows = Math.ceil(profileItems.length / 2)
          const currentRow = Math.floor(idx / 2)
          return (
            <div
              key={item.label}
              style={{
                display: "flex",
                padding: "8px 12px",
                borderBottom: currentRow < totalRows - 1 ? `1px solid ${PDF_COLORS.border}` : "none",
                borderRight: idx % 2 === 0 ? `1px solid ${PDF_COLORS.border}` : "none",
                fontSize: "11px",
              }}
            >
              <span style={{ color: PDF_COLORS.textMuted, minWidth: "60px", flexShrink: 0 }}>
                {item.label}
              </span>
              <span style={{ color: PDF_COLORS.text, fontWeight: 500 }}>
                {item.value}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── KR: Financial Table (div-based, 3-period + YoY) ─── */

function KrFinancialTable({ metrics }: { readonly metrics: readonly DartKeyAccount[] }) {
  if (metrics.length === 0) return null

  return (
    <div style={{ padding: "0 40px", marginBottom: "16px" }}>
      <div
        style={{
          border: `1px solid ${PDF_COLORS.border}`,
          borderRadius: "6px",
          overflow: "hidden",
          fontSize: "11px",
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "flex",
            backgroundColor: PDF_COLORS.bgLight,
            borderBottom: `2px solid ${PDF_COLORS.border}`,
            fontWeight: 600,
          }}
        >
          <div style={{ flex: 2, padding: "8px 12px" }}>항목</div>
          <div style={{ flex: 2, padding: "8px 12px", textAlign: "right" }}>전전기</div>
          <div style={{ flex: 2, padding: "8px 12px", textAlign: "right" }}>전기</div>
          <div style={{ flex: 2, padding: "8px 12px", textAlign: "right" }}>당기</div>
          <div style={{ flex: 1.5, padding: "8px 12px", textAlign: "right" }}>YoY</div>
        </div>
        {/* Data rows */}
        {metrics.map((m, idx) => {
          const yoy = formatYoy(m.yoyChange)
          return (
            <div
              key={m.label}
              style={{
                display: "flex",
                borderBottom: idx < metrics.length - 1 ? `1px solid ${PDF_COLORS.border}` : "none",
                backgroundColor: idx % 2 === 1 ? PDF_COLORS.bgAccent : "transparent",
              }}
            >
              <div style={{ flex: 2, padding: "7px 12px", fontWeight: 500 }}>{m.label}</div>
              <div style={{ flex: 2, padding: "7px 12px", textAlign: "right", fontFamily: "monospace" }}>
                {formatKrwAmount(m.bfefrmtrm)}
              </div>
              <div style={{ flex: 2, padding: "7px 12px", textAlign: "right", fontFamily: "monospace" }}>
                {formatKrwAmount(m.frmtrm)}
              </div>
              <div style={{ flex: 2, padding: "7px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>
                {formatKrwAmount(m.thstrm)}
              </div>
              <div style={{ flex: 1.5, padding: "7px 12px", textAlign: "right", fontWeight: 600, color: yoy.color }}>
                {yoy.text}
              </div>
            </div>
          )
        })}
      </div>
      <div style={{ fontSize: "9px", color: PDF_COLORS.textMuted, marginTop: "4px", textAlign: "right" }}>
        단위: 원 | DART 전자공시시스템
      </div>
    </div>
  )
}

/* ─── KR: 3-Period Bar Chart (existing, refined) ─── */

function KrBarChartSection({ metrics }: { readonly metrics: readonly DartKeyAccount[] }) {
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
    <div style={{ padding: "0 40px", marginBottom: "20px" }}>
      <div style={{ fontSize: "12px", fontWeight: 600, color: PDF_COLORS.text, marginBottom: "8px" }}>
        3기 비교 (억원)
      </div>
      <div style={{ width: "100%", height: "260px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={PDF_COLORS.border} />
            <XAxis dataKey="name" tick={{ fill: PDF_COLORS.textMuted, fontSize: 11 }} />
            <YAxis
              tick={{ fill: PDF_COLORS.textMuted, fontSize: 10 }}
              tickFormatter={(v: number) => formatKrwAmount(v * 1_0000_0000)}
            />
            <Tooltip formatter={(v) => `${Number(v ?? 0).toLocaleString("ko-KR")}억`} />
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

/* ─── KR: Trend LineChart ─── */

function KrTrendChart({ metrics }: { readonly metrics: readonly DartKeyAccount[] }) {
  const periods = ["전전기", "전기", "당기"] as const
  const chartData = periods.map((period) => {
    const entry: Record<string, string | number> = { name: period }
    for (const m of metrics) {
      const value =
        period === "전전기" ? m.bfefrmtrm :
        period === "전기" ? m.frmtrm :
        m.thstrm
      entry[m.label] = value ? value / 1_0000_0000 : 0
    }
    return entry
  })

  const colors = [PDF_COLORS.chart1, PDF_COLORS.chart2, PDF_COLORS.chart3, PDF_COLORS.chart4]

  return (
    <div style={{ padding: "0 40px", marginBottom: "20px" }}>
      <div style={{ fontSize: "12px", fontWeight: 600, color: PDF_COLORS.text, marginBottom: "8px" }}>
        추이 분석 (억원)
      </div>
      <div style={{ width: "100%", height: "260px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={PDF_COLORS.border} />
            <XAxis dataKey="name" tick={{ fill: PDF_COLORS.textMuted, fontSize: 11 }} />
            <YAxis
              tick={{ fill: PDF_COLORS.textMuted, fontSize: 10 }}
              tickFormatter={(v: number) => formatKrwAmount(v * 1_0000_0000)}
            />
            <Tooltip formatter={(v) => `${Number(v ?? 0).toLocaleString("ko-KR")}억`} />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            {metrics.map((m, i) => (
              <Line
                key={m.label}
                type="monotone"
                dataKey={m.label}
                stroke={colors[i % colors.length]}
                strokeWidth={2}
                dot={{ r: 4, fill: colors[i % colors.length] }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/* ─── KR: Profitability BarChart ─── */

function calcMargin(revenue: number | null, profit: number | null): number | null {
  if (revenue == null || profit == null || revenue === 0) return null
  return (profit / revenue) * 100
}

function KrProfitabilityChart({ metrics }: { readonly metrics: readonly DartKeyAccount[] }) {
  const revenue = metrics.find((m) => m.label === "매출액")
  const opProfit = metrics.find((m) => m.label === "영업이익")
  const netProfit = metrics.find((m) => m.label === "당기순이익")

  if (!revenue) return null

  const periods = [
    { name: "전전기", revKey: "bfefrmtrm" as const },
    { name: "전기", revKey: "frmtrm" as const },
    { name: "당기", revKey: "thstrm" as const },
  ]

  const chartData = periods.map((p) => ({
    name: p.name,
    "영업이익률": calcMargin(revenue[p.revKey], opProfit?.[p.revKey] ?? null) ?? 0,
    "순이익률": calcMargin(revenue[p.revKey], netProfit?.[p.revKey] ?? null) ?? 0,
  }))

  if (chartData.every((d) => d["영업이익률"] === 0 && d["순이익률"] === 0)) {
    return null
  }

  return (
    <div style={{ padding: "0 40px", marginBottom: "20px" }}>
      <div style={{ fontSize: "12px", fontWeight: 600, color: PDF_COLORS.text, marginBottom: "8px" }}>
        수익성 분석 (%)
      </div>
      <div style={{ width: "100%", height: "220px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={PDF_COLORS.border} />
            <XAxis dataKey="name" tick={{ fill: PDF_COLORS.textMuted, fontSize: 11 }} />
            <YAxis
              tick={{ fill: PDF_COLORS.textMuted, fontSize: 10 }}
              tickFormatter={(v: number) => `${v.toFixed(0)}%`}
            />
            <Tooltip formatter={(v) => `${Number(v ?? 0).toFixed(1)}%`} />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Bar dataKey="영업이익률" fill={PDF_COLORS.chart1} radius={[2, 2, 0, 0]} />
            <Bar dataKey="순이익률" fill={PDF_COLORS.chart2} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/* ─── US: Company Profile (expanded) ─── */

function UsCompanyProfile({ quote }: { readonly quote: QuoteApiResponse }) {
  const { price, company } = quote
  const changePositive = (price?.day_change ?? 0) >= 0

  return (
    <div style={{ padding: "0 40px", marginBottom: "16px" }}>
      {/* Stock price banner */}
      {price && (
        <div
          style={{
            backgroundColor: PDF_COLORS.bgAccent,
            borderRadius: "8px",
            padding: "16px 20px",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <div>
            <div style={{ fontSize: "10px", color: PDF_COLORS.textMuted, marginBottom: "2px" }}>
              Stock Price
            </div>
            <div style={{ fontSize: "28px", fontWeight: 700, color: PDF_COLORS.text }}>
              ${(price.price ?? 0).toFixed(2)}
            </div>
          </div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: changePositive ? PDF_COLORS.positive : PDF_COLORS.negative,
            }}
          >
            {changePositive ? "+" : ""}${(price.day_change ?? 0).toFixed(2)} ({changePositive ? "+" : ""}{(price.day_change_percent ?? 0).toFixed(2)}%)
          </div>
        </div>
      )}

      {/* Company details grid */}
      {company && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0",
            border: `1px solid ${PDF_COLORS.border}`,
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          {[
            { label: "Sector", value: company.sector || "-" },
            { label: "Industry", value: company.industry || "-" },
            { label: "Exchange", value: company.exchange || "-" },
            { label: "Market Cap", value: formatUsdCompact(company.market_cap) },
            { label: "Employees", value: company.number_of_employees?.toLocaleString("en-US") ?? "-" },
            { label: "Location", value: company.location || "-" },
            { label: "Website", value: company.website_url || "-" },
            { label: "Listing Date", value: company.listing_date || "-" },
          ].map((item, idx, arr) => {
            const totalRows = Math.ceil(arr.length / 2)
            const currentRow = Math.floor(idx / 2)
            return (
            <div
              key={item.label}
              style={{
                display: "flex",
                padding: "8px 12px",
                borderBottom: currentRow < totalRows - 1 ? `1px solid ${PDF_COLORS.border}` : "none",
                borderRight: idx % 2 === 0 ? `1px solid ${PDF_COLORS.border}` : "none",
                fontSize: "11px",
              }}
            >
              <span style={{ color: PDF_COLORS.textMuted, minWidth: "80px", flexShrink: 0 }}>
                {item.label}
              </span>
              <span
                style={{
                  color: PDF_COLORS.text,
                  fontWeight: 500,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.value}
              </span>
            </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ─── US: Metrics Grids (Valuation / Profitability / Health) ─── */

function UsMetricsGrids({ quote }: { readonly quote: QuoteApiResponse }) {
  const { metrics } = quote
  if (!metrics) return null

  const valuationItems: readonly MetricCardItem[] = [
    { label: "P/E Ratio", value: metrics.price_to_earnings_ratio?.toFixed(1) ?? "-" },
    { label: "P/B Ratio", value: metrics.price_to_book_ratio?.toFixed(2) ?? "-" },
    { label: "P/S Ratio", value: metrics.price_to_sales_ratio?.toFixed(2) ?? "-" },
    { label: "EV", value: formatUsdCompact(metrics.enterprise_value) },
    { label: "EV/EBITDA", value: metrics.enterprise_value_to_ebitda_ratio?.toFixed(1) ?? "-" },
  ]

  const profitItems: readonly MetricCardItem[] = [
    { label: "Gross Margin", value: formatPercent(metrics.gross_margin) },
    { label: "Operating Margin", value: formatPercent(metrics.operating_margin) },
    { label: "Net Margin", value: formatPercent(metrics.net_margin) },
    { label: "ROE", value: formatPercent(metrics.return_on_equity) },
    { label: "ROA", value: formatPercent(metrics.return_on_assets) },
  ]

  const healthItems: readonly MetricCardItem[] = [
    { label: "Current Ratio", value: metrics.current_ratio?.toFixed(2) ?? "-" },
    { label: "Quick Ratio", value: metrics.quick_ratio?.toFixed(2) ?? "-" },
    { label: "D/E Ratio", value: metrics.debt_to_equity?.toFixed(2) ?? "-" },
    { label: "EPS", value: metrics.earnings_per_share != null ? `$${metrics.earnings_per_share.toFixed(2)}` : "-" },
    { label: "BV/Share", value: metrics.book_value_per_share != null ? `$${metrics.book_value_per_share.toFixed(2)}` : "-" },
    { label: "FCF/Share", value: metrics.free_cash_flow_per_share != null ? `$${metrics.free_cash_flow_per_share.toFixed(2)}` : "-" },
  ]

  return (
    <>
      {/* Valuation */}
      <div style={{ padding: "0 40px", marginBottom: "6px" }}>
        <div style={{ fontSize: "12px", fontWeight: 600, color: PDF_COLORS.textMuted, marginBottom: "8px" }}>
          Valuation
        </div>
      </div>
      <MetricCardGrid items={valuationItems} columns={3} />

      {/* Profitability */}
      <div style={{ padding: "0 40px", marginBottom: "6px" }}>
        <div style={{ fontSize: "12px", fontWeight: 600, color: PDF_COLORS.textMuted, marginBottom: "8px" }}>
          Profitability
        </div>
      </div>
      <MetricCardGrid items={profitItems} columns={3} />

      {/* Financial Health */}
      <div style={{ padding: "0 40px", marginBottom: "6px" }}>
        <div style={{ fontSize: "12px", fontWeight: 600, color: PDF_COLORS.textMuted, marginBottom: "8px" }}>
          Financial Health
        </div>
      </div>
      <MetricCardGrid items={healthItems} columns={3} />
    </>
  )
}

/* ─── US: Profitability BarChart ─── */

function UsProfitabilityChart({ quote }: { readonly quote: QuoteApiResponse }) {
  const { metrics } = quote
  if (!metrics) return null

  const chartData = [
    { name: "Gross", value: metrics.gross_margin != null ? metrics.gross_margin * 100 : 0 },
    { name: "Operating", value: metrics.operating_margin != null ? metrics.operating_margin * 100 : 0 },
    { name: "Net", value: metrics.net_margin != null ? metrics.net_margin * 100 : 0 },
  ]

  if (chartData.every((d) => d.value === 0)) return null

  return (
    <div style={{ padding: "0 40px", marginBottom: "20px" }}>
      <div style={{ fontSize: "12px", fontWeight: 600, color: PDF_COLORS.text, marginBottom: "8px" }}>
        Margin Comparison (%)
      </div>
      <div style={{ width: "100%", height: "220px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={PDF_COLORS.border} />
            <XAxis dataKey="name" tick={{ fill: PDF_COLORS.textMuted, fontSize: 11 }} />
            <YAxis
              tick={{ fill: PDF_COLORS.textMuted, fontSize: 10 }}
              tickFormatter={(v: number) => `${v.toFixed(0)}%`}
            />
            <Tooltip formatter={(v) => `${Number(v ?? 0).toFixed(1)}%`} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={entry.name} fill={US_MARGIN_FILLS[index % US_MARGIN_FILLS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/* ─── US: Growth Cards ─── */

function UsGrowthCards({ quote }: { readonly quote: QuoteApiResponse }) {
  const { metrics } = quote
  if (!metrics) return null
  if (metrics.revenue_growth == null && metrics.earnings_growth == null) return null

  const growthItems: MetricCardItem[] = []
  if (metrics.revenue_growth != null) {
    growthItems.push({
      label: "Revenue Growth",
      value: `${(metrics.revenue_growth * 100).toFixed(1)}%`,
      color: metrics.revenue_growth >= 0 ? PDF_COLORS.positive : PDF_COLORS.negative,
    })
  }
  if (metrics.earnings_growth != null) {
    growthItems.push({
      label: "Earnings Growth",
      value: `${(metrics.earnings_growth * 100).toFixed(1)}%`,
      color: metrics.earnings_growth >= 0 ? PDF_COLORS.positive : PDF_COLORS.negative,
    })
  }

  if (growthItems.length === 0) return null

  return (
    <>
      <div style={{ padding: "0 40px", marginBottom: "6px" }}>
        <div style={{ fontSize: "12px", fontWeight: 600, color: PDF_COLORS.textMuted, marginBottom: "8px" }}>
          Growth
        </div>
      </div>
      <MetricCardGrid items={growthItems} columns={2} />
    </>
  )
}

/* ─── Main Component ─── */

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
                allItems: items,
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

    const isKR = reportCompany.region === "KR"

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

        {/* AI Analysis */}
        <SectionDivider title={isKR ? "AI 분석" : "AI Analysis"} />
        <MarkdownSection text={reportText} />

        {/* KR Report Sections */}
        {isKR && krData && (
          <>
            {krData.company && (
              <>
                <SectionDivider title="기업 개요" />
                <KrCompanyProfile company={krData.company} />
              </>
            )}

            {krData.metrics.length > 0 && (
              <>
                <SectionDivider title="핵심 재무 지표" />
                <KrFinancialTable metrics={krData.metrics} />
              </>
            )}

            {krData.metrics.length > 0 && (
              <>
                <SectionDivider title="재무 시각화" />
                <KrBarChartSection metrics={krData.metrics} />
                <KrTrendChart metrics={krData.metrics} />
                <KrProfitabilityChart metrics={krData.metrics} />
              </>
            )}
          </>
        )}

        {/* US Report Sections */}
        {!isKR && usQuote && (
          <>
            <SectionDivider title="Company Overview" />
            <UsCompanyProfile quote={usQuote} />

            {usQuote.metrics && (
              <>
                <SectionDivider title="Key Financial Metrics" />
                <UsMetricsGrids quote={usQuote} />
              </>
            )}

            {usQuote.metrics && (
              <>
                <SectionDivider title="Financial Visualization" />
                <UsProfitabilityChart quote={usQuote} />
                <UsGrowthCards quote={usQuote} />
              </>
            )}
          </>
        )}

        <div style={{ padding: "0 40px" }}>
          <PdfFooter />
        </div>
      </div>
    )
  }
)
