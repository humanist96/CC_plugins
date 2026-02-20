/** Financial Datasets API (financialdatasets.ai) response types */

export interface FDPriceSnapshotData {
  readonly ticker: string
  readonly price: number
  readonly day_change: number
  readonly day_change_percent: number
  readonly volume: number
  readonly time: string
  readonly time_milliseconds: number
}

export interface FDPriceSnapshot {
  readonly snapshot: FDPriceSnapshotData
}

export interface FDCompanyFactsData {
  readonly ticker: string
  readonly name: string
  readonly cik: string
  readonly sector: string
  readonly industry: string
  readonly category: string
  readonly exchange: string
  readonly is_active: boolean
  readonly listing_date: string
  readonly location: string
  readonly market_cap: number
  readonly number_of_employees: number
  readonly sic_code: string
  readonly sic_industry: string
  readonly sic_sector: string
  readonly website_url: string
  readonly weighted_average_shares: number
}

export interface FDCompanyFacts {
  readonly company_facts: FDCompanyFactsData
}

export interface FDFinancialMetric {
  readonly ticker: string
  readonly price_to_earnings_ratio: number | null
  readonly price_to_book_ratio: number | null
  readonly price_to_sales_ratio: number | null
  readonly enterprise_value: number | null
  readonly enterprise_value_to_ebitda_ratio: number | null
  readonly earnings_per_share: number | null
  readonly book_value_per_share: number | null
  readonly free_cash_flow_per_share: number | null
  readonly debt_to_equity: number | null
  readonly return_on_equity: number | null
  readonly return_on_assets: number | null
  readonly current_ratio: number | null
  readonly quick_ratio: number | null
  readonly gross_margin: number | null
  readonly operating_margin: number | null
  readonly net_margin: number | null
  readonly revenue_growth: number | null
  readonly earnings_growth: number | null
  readonly payout_ratio: number | null
}

export interface FDFinancialMetricsSnapshot {
  readonly snapshot: FDFinancialMetric
}

export interface FDNewsArticle {
  readonly ticker: string
  readonly title: string
  readonly author: string
  readonly source: string
  readonly date: string
  readonly url: string
  readonly sentiment: string
}

export interface FDNewsResponse {
  readonly news: readonly FDNewsArticle[]
}

/** Combined response from our /api/finance/quote proxy */
export interface QuoteApiResponse {
  readonly ticker: string
  readonly price: FDPriceSnapshotData | null
  readonly company: FDCompanyFactsData | null
  readonly metrics: FDFinancialMetric | null
}
