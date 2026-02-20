import { NextRequest, NextResponse } from "next/server"

const BASE_URL = "https://api.financialdatasets.ai"

interface PriceBatchItem {
  readonly ticker: string
  readonly price: number | null
  readonly dayChange: number | null
  readonly dayChangePercent: number | null
}

async function fetchPrice(ticker: string, apiKey: string): Promise<PriceBatchItem> {
  try {
    const res = await fetch(`${BASE_URL}/prices/snapshot/?ticker=${ticker}`, {
      headers: { "X-API-KEY": apiKey },
      next: { revalidate: 60 },
    })
    if (!res.ok) {
      return { ticker, price: null, dayChange: null, dayChangePercent: null }
    }
    const data = await res.json() as { snapshot?: { price?: number; day_change?: number; day_change_percent?: number } }
    return {
      ticker,
      price: data.snapshot?.price ?? null,
      dayChange: data.snapshot?.day_change ?? null,
      dayChangePercent: data.snapshot?.day_change_percent ?? null,
    }
  } catch {
    return { ticker, price: null, dayChange: null, dayChangePercent: null }
  }
}

export async function GET(request: NextRequest) {
  const tickers = request.nextUrl.searchParams.get("tickers")
  if (!tickers) {
    return NextResponse.json({ error: "tickers parameter required" }, { status: 400 })
  }

  const apiKey = process.env.FINANCIAL_DATASETS_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 })
  }

  const tickerList = tickers.split(",").map((t) => t.trim().toUpperCase()).filter(Boolean).slice(0, 20)

  const results = await Promise.all(
    tickerList.map((ticker) => fetchPrice(ticker, apiKey))
  )

  const priceMap: Record<string, PriceBatchItem> = {}
  for (const r of results) {
    priceMap[r.ticker] = r
  }

  return NextResponse.json({ prices: priceMap })
}
