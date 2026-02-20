import { NextRequest, NextResponse } from "next/server"
import { createSession, getSession, destroySession } from "@/lib/auth"

/**
 * POST /api/auth - 로그인 (세션 생성)
 * Body: { name: string, role: string }
 */
export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = typeof body === "object" && body !== null ? body as Record<string, unknown> : {}
  const name = typeof parsed.name === "string" ? parsed.name.trim() : ""
  const role = typeof parsed.role === "string" ? parsed.role : "investor"

  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 })
  }

  // Simple ID generation (in production, use DB-backed user lookup)
  const userId = `user-${name.toLowerCase().replace(/[^a-z0-9가-힣]/g, "")}-${Date.now()}`
  await createSession(userId, role)

  return NextResponse.json({ success: true, userId, role })
}

/**
 * GET /api/auth - 세션 확인
 */
export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
  return NextResponse.json({ authenticated: true, ...session })
}

/**
 * DELETE /api/auth - 로그아웃
 */
export async function DELETE() {
  await destroySession()
  return NextResponse.json({ success: true })
}
