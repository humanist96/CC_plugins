import { getDb } from "../connection"
import { runMigrations } from "../schema"

export interface AnalyticsEvent {
  readonly eventType: string
  readonly queryType?: string
  readonly detectedTicker?: string
  readonly complianceCategory?: string
  readonly responseTimeMs?: number
  readonly costUsd?: number
  readonly userId?: string
}

export interface DailyUsage {
  readonly date: string
  readonly count: number
}

export interface TrendingTicker {
  readonly ticker: string
  readonly count: number
}

export interface ComplianceStats {
  readonly totalQueries: number
  readonly advisoryBlocked: number
  readonly predictionBlocked: number
  readonly infoAllowed: number
}

let initialized = false

function ensureInitialized(): void {
  if (!initialized) {
    runMigrations()
    initialized = true
  }
}

export function logAnalyticsEvent(event: AnalyticsEvent): void {
  ensureInitialized()
  const db = getDb()

  db.prepare(`
    INSERT INTO analytics_events (user_id, event_type, query_type, detected_ticker, compliance_category, response_time_ms, cost_usd)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    event.userId ?? null,
    event.eventType,
    event.queryType ?? null,
    event.detectedTicker ?? null,
    event.complianceCategory ?? null,
    event.responseTimeMs ?? null,
    event.costUsd ?? null
  )
}

export function getDailyUsage(days: number = 30): readonly DailyUsage[] {
  ensureInitialized()
  const db = getDb()

  return db.prepare(`
    SELECT date(created_at) as date, COUNT(*) as count
    FROM analytics_events
    WHERE created_at >= datetime('now', ?)
    GROUP BY date(created_at)
    ORDER BY date ASC
  `).all(`-${days} days`) as DailyUsage[]
}

export function getTrendingTickers(days: number = 7, limit: number = 10): readonly TrendingTicker[] {
  ensureInitialized()
  const db = getDb()

  return db.prepare(`
    SELECT detected_ticker as ticker, COUNT(*) as count
    FROM analytics_events
    WHERE detected_ticker IS NOT NULL
      AND created_at >= datetime('now', ?)
    GROUP BY detected_ticker
    ORDER BY count DESC
    LIMIT ?
  `).all(`-${days} days`, limit) as TrendingTicker[]
}

export function getComplianceStats(days: number = 30): ComplianceStats {
  ensureInitialized()
  const db = getDb()

  const row = db.prepare(`
    SELECT
      COUNT(*) as total_queries,
      SUM(CASE WHEN compliance_category = 'advisory' THEN 1 ELSE 0 END) as advisory_blocked,
      SUM(CASE WHEN compliance_category = 'prediction' THEN 1 ELSE 0 END) as prediction_blocked,
      SUM(CASE WHEN compliance_category = 'info' OR compliance_category IS NULL THEN 1 ELSE 0 END) as info_allowed
    FROM analytics_events
    WHERE created_at >= datetime('now', ?)
  `).get(`-${days} days`) as {
    total_queries: number
    advisory_blocked: number
    prediction_blocked: number
    info_allowed: number
  }

  return {
    totalQueries: row.total_queries,
    advisoryBlocked: row.advisory_blocked,
    predictionBlocked: row.prediction_blocked,
    infoAllowed: row.info_allowed,
  }
}

export function getTotalCost(days: number = 30): number {
  ensureInitialized()
  const db = getDb()

  const row = db.prepare(`
    SELECT COALESCE(SUM(cost_usd), 0) as total
    FROM analytics_events
    WHERE created_at >= datetime('now', ?)
  `).get(`-${days} days`) as { total: number }

  return row.total
}
