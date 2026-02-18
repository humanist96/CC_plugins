import type { QuoteApiResponse } from "@/types/financialDatasets"
import type { SimulationResponse } from "@/types/simulation"
import { mapQuoteToSimulationResponse } from "@/lib/financialDatasetsMapper"

const SUPPORTED_TICKERS = ["AAPL", "GOOGL", "MSFT", "NVDA", "TSLA"] as const
export type SupportedTicker = (typeof SUPPORTED_TICKERS)[number]

const TICKER_ALIASES: Record<string, SupportedTicker> = {
  AAPL: "AAPL",
  APPLE: "AAPL",
  "애플": "AAPL",
  GOOGL: "GOOGL",
  GOOGLE: "GOOGL",
  "구글": "GOOGL",
  MSFT: "MSFT",
  MICROSOFT: "MSFT",
  "마이크로소프트": "MSFT",
  NVDA: "NVDA",
  NVIDIA: "NVDA",
  "엔비디아": "NVDA",
  TSLA: "TSLA",
  TESLA: "TSLA",
  "테슬라": "TSLA",
}

export function extractTicker(input: string): SupportedTicker | null {
  const normalized = input.toUpperCase().trim()

  for (const [alias, ticker] of Object.entries(TICKER_ALIASES)) {
    if (normalized.includes(alias.toUpperCase())) {
      return ticker
    }
  }

  return null
}

export async function fetchLiveQuote(
  ticker: SupportedTicker
): Promise<SimulationResponse> {
  const res = await fetch(`/api/finance/quote?ticker=${ticker}`)

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "요청 실패" }))
    throw new Error(body.error ?? `HTTP ${res.status}`)
  }

  const data = (await res.json()) as QuoteApiResponse
  return mapQuoteToSimulationResponse(data)
}

export { SUPPORTED_TICKERS }
