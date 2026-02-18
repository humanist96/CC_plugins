/** Financial Datasets API (financialdatasets.ai) response types */

export interface FDPriceDay {
  readonly open: number
  readonly high: number
  readonly low: number
  readonly close: number
  readonly volume: number
}

export interface FDPriceSnapshot {
  readonly snapshot: {
    readonly ticker: string
    readonly day: FDPriceDay
    readonly previous_close: number
  }
}

export interface FDCompanyFacts {
  readonly company_facts: {
    readonly ticker: string
    readonly name: string
    readonly cik: string
    readonly market_cap: number
    readonly number_of_employees: number
    readonly sic_code: string
    readonly sic_description: string
    readonly website_url: string
    readonly listing_date: string
    readonly is_active: boolean
  }
}

export interface FDFinancialMetric {
  readonly ticker: string
  readonly price_to_earnings_ratio: number | null
  readonly week_52_high: number | null
  readonly week_52_low: number | null
  readonly market_cap: number | null
  readonly enterprise_value: number | null
  readonly price_to_book_ratio: number | null
  readonly price_to_sales_ratio: number | null
  readonly dividend_yield: number | null
  readonly earnings_per_share: number | null
  readonly revenue_per_share: number | null
  readonly debt_to_equity: number | null
  readonly return_on_equity: number | null
  readonly return_on_assets: number | null
  readonly current_ratio: number | null
  readonly quick_ratio: number | null
  readonly gross_margin: number | null
  readonly operating_margin: number | null
  readonly net_margin: number | null
}

export interface FDFinancialMetricsSnapshot {
  readonly financial_metrics: FDFinancialMetric
}

export interface FDNewsArticle {
  readonly ticker: string
  readonly title: string
  readonly author: string
  readonly source: string
  readonly date: string
  readonly url: string
  readonly content: string
}

export interface FDNewsResponse {
  readonly news: readonly FDNewsArticle[]
}

/** Combined response from our /api/finance/quote proxy */
export interface QuoteApiResponse {
  readonly ticker: string
  readonly price: FDPriceSnapshot['snapshot'] | null
  readonly company: FDCompanyFacts['company_facts'] | null
  readonly metrics: FDFinancialMetric | null
}
