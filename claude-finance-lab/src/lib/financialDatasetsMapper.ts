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

export function mapQuoteToSimulationResponse(
  data: QuoteApiResponse
): SimulationResponse {
  const { ticker, price, company, metrics } = data

  const dayClose = price?.day?.close ?? 0
  const dayOpen = price?.day?.open ?? 0
  const change = dayClose - dayOpen
  const changePercent = dayOpen !== 0 ? (change / dayOpen) * 100 : 0

  const name = company?.name ?? ticker
  const marketCap = formatMarketCap(company?.market_cap ?? metrics?.market_cap)
  const volume = formatVolume(price?.day?.volume)
  const pe = metrics?.price_to_earnings_ratio ?? undefined
  const week52High = metrics?.week_52_high ?? undefined
  const week52Low = metrics?.week_52_low ?? undefined

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
          price: dayClose,
          change: Number(change.toFixed(2)),
          changePercent: Number(changePercent.toFixed(2)),
          open: dayOpen,
          high: price?.day?.high ?? 0,
          low: price?.day?.low ?? 0,
          volume,
          marketCap,
          ...(pe != null ? { pe: Number(pe.toFixed(1)) } : {}),
          ...(week52High != null ? { week52High } : {}),
          ...(week52Low != null ? { week52Low } : {}),
        },
      },
    ],
  }
}
