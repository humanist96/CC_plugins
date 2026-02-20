import type { QuoteApiResponse } from "@/types/financialDatasets"
import type { SimulationResponse } from "@/types/simulation"

function formatVolume(vol: number | undefined): string {
  if (!vol) return "-"
  if (vol >= 1_000_000_000) return `${(vol / 1_000_000_000).toFixed(1)}B`
  if (vol >= 1_000_000) return `${(vol / 1_000_000).toFixed(1)}M`
  if (vol >= 1_000) return `${(vol / 1_000).toFixed(1)}K`
  return String(vol)
}

function formatMarketCap(cap: number | null | undefined): string {
  if (!cap) return "-"
  if (cap >= 1_000_000_000_000) return `${(cap / 1_000_000_000_000).toFixed(2)}T`
  if (cap >= 1_000_000_000) return `${(cap / 1_000_000_000).toFixed(2)}B`
  if (cap >= 1_000_000) return `${(cap / 1_000_000).toFixed(2)}M`
  return String(cap)
}

function formatPercent(value: number | null | undefined): string {
  if (value == null) return "-"
  return `${(value * 100).toFixed(1)}%`
}

export function mapQuoteToSimulationResponse(
  data: QuoteApiResponse
): SimulationResponse {
  const { ticker, price, company, metrics } = data

  const currentPrice = price?.price ?? 0
  const change = price?.day_change ?? 0
  const changePercent = price?.day_change_percent ?? 0

  const name = company?.name ?? ticker
  const marketCap = formatMarketCap(company?.market_cap)
  const volume = formatVolume(price?.volume)
  const pe = metrics?.price_to_earnings_ratio ?? undefined
  const eps = metrics?.earnings_per_share ?? undefined

  return {
    id: `live-${ticker.toLowerCase()}`,
    command: `${ticker} 실시간 주가 조회`,
    triggerKeywords: [ticker],
    contents: [
      {
        type: "stock_quote",
        title: `${name} (${ticker}) — 실시간`,
        data: {
          symbol: ticker,
          name,
          price: currentPrice,
          change: Number(change.toFixed(2)),
          changePercent: Number(changePercent.toFixed(2)),
          volume,
          marketCap,
          ...(pe != null ? { pe: Number(pe.toFixed(1)) } : {}),
          ...(eps != null ? { eps: Number(eps.toFixed(2)) } : {}),
          ...(metrics?.return_on_equity != null
            ? { roe: formatPercent(metrics.return_on_equity) }
            : {}),
          ...(metrics?.gross_margin != null
            ? { grossMargin: formatPercent(metrics.gross_margin) }
            : {}),
          ...(company?.sector ? { sector: company.sector } : {}),
          ...(company?.exchange ? { exchange: company.exchange } : {}),
        },
      },
    ],
  }
}
