import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const SESSION_COOKIE = "cfl-session"
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

// Simple session store (in production, use Redis or DB)
const sessions = new Map<string, { userId: string; role: string; createdAt: number }>()

function generateToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("")
}

// Periodic cleanup
setInterval(() => {
  const now = Date.now()
  for (const [token, session] of sessions) {
    if (now - session.createdAt > SESSION_MAX_AGE * 1000) {
      sessions.delete(token)
    }
  }
}, 60_000)

export async function createSession(userId: string, role: string): Promise<string> {
  const token = generateToken()
  sessions.set(token, { userId, role, createdAt: Date.now() })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  })

  return token
}

export async function getSession(): Promise<{ userId: string; role: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  const session = sessions.get(token)
  if (!session) return null

  if (Date.now() - session.createdAt > SESSION_MAX_AGE * 1000) {
    sessions.delete(token)
    return null
  }

  return { userId: session.userId, role: session.role }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (token) {
    sessions.delete(token)
    cookieStore.delete(SESSION_COOKIE)
  }
}

/**
 * API 라우트 보호 미들웨어.
 * 세션이 없으면 401 반환. 있으면 null 반환 (계속 진행).
 */
export async function requireAuth(_request: NextRequest): Promise<NextResponse | null> {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 })
  }
  return null
}
