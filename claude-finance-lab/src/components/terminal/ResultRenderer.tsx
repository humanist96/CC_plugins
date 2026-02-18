"use client"

import { TrendingUp, TrendingDown, Mail, FileText } from "lucide-react"
import type { SimulationResponse, SimulationContent } from "@/types/simulation"

interface ResultRendererProps {
  readonly response: SimulationResponse
}

export function ResultRenderer({ response }: ResultRendererProps) {
  return (
    <div className="space-y-4">
      {response.contents.map((content, i) => (
        <ContentBlock key={i} content={content} />
      ))}
    </div>
  )
}

function ContentBlock({ content }: { readonly content: SimulationContent }) {
  switch (content.type) {
    case "stock_quote":
      return <StockCard data={content.data as Record<string, unknown>} title={content.title} />
    case "table":
      return <DataTable data={content.data as Record<string, unknown>} title={content.title} />
    case "report":
      return <ReportCard data={content.data as Record<string, unknown>} title={content.title} />
    case "email_draft":
      return <EmailDraft data={content.data as Record<string, unknown>} title={content.title} />
    case "pipeline":
      return <PipelineView data={content.data as Record<string, unknown>} title={content.title} />
    default:
      return <pre className="text-xs text-slate-300">{JSON.stringify(content.data, null, 2)}</pre>
  }
}

function StockCard({ data, title }: { readonly data: Record<string, unknown>; readonly title?: string }) {
  const price = data.price as number
  const change = data.change as number
  const changePercent = data.changePercent as number
  const isPositive = change >= 0
  const currency = (data.currency as string) || "USD"

  return (
    <div className="rounded-md border border-slate-700 bg-slate-900 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-semibold text-slate-100">{title || data.name as string}</h3>
          <span className="text-xs text-slate-400 font-mono">{data.symbol as string}</span>
        </div>
        <div className={`flex items-center gap-1 ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
          {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        </div>
      </div>
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-bold text-slate-100">
          {currency === "KRW" ? `${price.toLocaleString()}원` : `$${price.toFixed(2)}`}
        </span>
        <span className={`text-sm font-semibold ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
          {isPositive ? "+" : ""}{change} ({isPositive ? "+" : ""}{changePercent}%)
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-xs">
        {data.open != null && (
          <div>
            <span className="text-slate-500">시가</span>
            <div className="text-slate-300">{currency === "KRW" ? `${(data.open as number).toLocaleString()}` : `$${(data.open as number).toFixed(2)}`}</div>
          </div>
        )}
        {data.high != null && (
          <div>
            <span className="text-slate-500">고가</span>
            <div className="text-slate-300">{currency === "KRW" ? `${(data.high as number).toLocaleString()}` : `$${(data.high as number).toFixed(2)}`}</div>
          </div>
        )}
        {data.low != null && (
          <div>
            <span className="text-slate-500">저가</span>
            <div className="text-slate-300">{currency === "KRW" ? `${(data.low as number).toLocaleString()}` : `$${(data.low as number).toFixed(2)}`}</div>
          </div>
        )}
        {data.volume != null && (
          <div>
            <span className="text-slate-500">거래량</span>
            <div className="text-slate-300">{data.volume as string}</div>
          </div>
        )}
        {data.marketCap != null && (
          <div>
            <span className="text-slate-500">시가총액</span>
            <div className="text-slate-300">{data.marketCap as string}</div>
          </div>
        )}
        {data.pe != null && (
          <div>
            <span className="text-slate-500">PER</span>
            <div className="text-slate-300">{data.pe as number}</div>
          </div>
        )}
      </div>
    </div>
  )
}

function DataTable({ data, title }: { readonly data: Record<string, unknown>; readonly title?: string }) {
  const headers = data.headers as string[]
  const rows = data.rows as string[][]
  const summary = data.summary as string | undefined

  return (
    <div className="rounded-md border border-slate-700 bg-slate-900 p-4">
      {title && <h3 className="text-sm font-semibold text-slate-100 mb-3">{title}</h3>}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-700">
              {headers.map((h, i) => (
                <th key={i} className="text-left py-2 px-2 text-slate-400 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-slate-800">
                {row.map((cell, j) => (
                  <td key={j} className="py-1.5 px-2 text-slate-300">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {summary && <p className="mt-2 text-xs text-emerald-400 font-semibold">{summary}</p>}
    </div>
  )
}

function ReportCard({ data, title }: { readonly data: Record<string, unknown>; readonly title?: string }) {
  const sections = (data.sections as Array<{ title: string; content?: string; items?: string[] }>) || []

  return (
    <div className="rounded-md border border-slate-700 bg-slate-900 p-4">
      {title && (
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-4 w-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
        </div>
      )}
      <div className="space-y-3">
        {sections.map((section, i) => (
          <div key={i}>
            <h4 className="text-xs font-semibold text-blue-400 mb-1">{section.title}</h4>
            {section.content && (
              <p className="text-xs text-slate-300 whitespace-pre-line">{section.content}</p>
            )}
            {section.items && (
              <ul className="space-y-0.5">
                {section.items.map((item, j) => (
                  <li key={j} className="text-xs text-slate-300 flex items-start gap-1.5">
                    <span className="text-slate-500 mt-0.5">&#8226;</span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function EmailDraft({ data, title }: { readonly data: Record<string, unknown>; readonly title?: string }) {
  return (
    <div className="rounded-md border border-slate-700 bg-slate-900 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Mail className="h-4 w-4 text-purple-400" />
        <h3 className="text-sm font-semibold text-slate-100">{title || "이메일 초안"}</h3>
      </div>
      <div className="space-y-2 text-xs">
        <div className="flex gap-2">
          <span className="text-slate-500">To:</span>
          <span className="text-slate-300">{data.to as string}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-slate-500">Subject:</span>
          <span className="text-slate-300 font-semibold">{data.subject as string}</span>
        </div>
        <div className="border-t border-slate-700 pt-2">
          <p className="text-slate-300 whitespace-pre-line leading-relaxed">{data.body as string}</p>
        </div>
      </div>
    </div>
  )
}

function PipelineView({ data, title }: { readonly data: Record<string, unknown>; readonly title?: string }) {
  const stages = data.stages as Array<{ name: string; deals: number; value: number; items: string[] }>
  const totalValue = data.totalValue as number
  const weightedValue = data.weightedValue as number
  const actionItems = data.actionItems as string[]

  return (
    <div className="rounded-md border border-slate-700 bg-slate-900 p-4">
      {title && <h3 className="text-sm font-semibold text-slate-100 mb-3">{title}</h3>}

      <div className="space-y-3 mb-4">
        {stages.map((stage, i) => (
          <div key={i}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300 font-semibold">{stage.name}</span>
              <span className="text-slate-400">{stage.deals}건 / {stage.value}억</span>
            </div>
            <div className="h-6 rounded bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded bg-gradient-to-r from-blue-500 to-blue-400 flex items-center px-2"
                style={{ width: `${Math.min((stage.value / (totalValue || 1)) * 100, 100)}%` }}
              >
                <span className="text-xs text-white font-mono truncate">{stage.value}억</span>
              </div>
            </div>
            <div className="mt-1 space-y-0.5">
              {stage.items.map((item, j) => (
                <div key={j} className="text-xs text-slate-400 pl-2">{item}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-700 pt-3 space-y-1">
        <div className="text-xs text-slate-400">
          총 파이프라인: <span className="text-slate-200 font-semibold">{totalValue}억</span>
          {" | "}
          가중 예측: <span className="text-emerald-400 font-semibold">{weightedValue}억</span>
        </div>
      </div>

      {actionItems && actionItems.length > 0 && (
        <div className="border-t border-slate-700 pt-3 mt-3">
          <h4 className="text-xs font-semibold text-amber-400 mb-1">액션 아이템</h4>
          <ul className="space-y-0.5">
            {actionItems.map((item, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                <span className="text-amber-400 mt-0.5">&#9656;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
