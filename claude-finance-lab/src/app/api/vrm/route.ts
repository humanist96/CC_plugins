import { NextRequest, NextResponse } from "next/server"
import { getDailyUsage, getTrendingTickers, getComplianceStats, getTotalCost } from "@/lib/db/repositories/analytics"

export async function GET(request: NextRequest) {
  const daysParam = request.nextUrl.searchParams.get("days")
  const days = daysParam ? Math.min(Math.max(Number(daysParam), 1), 365) : 30

  try {
    const [dailyUsage, trendingTickers, complianceStats, totalCost] = await Promise.all([
      Promise.resolve(getDailyUsage(days)),
      Promise.resolve(getTrendingTickers(days)),
      Promise.resolve(getComplianceStats(days)),
      Promise.resolve(getTotalCost(days)),
    ])

    return NextResponse.json({
      dailyUsage,
      trendingTickers,
      complianceStats,
      totalCost,
      period: days,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
