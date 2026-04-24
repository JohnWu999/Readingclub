import * as jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'reading-club-secret-key-2026'

export interface TokenPayload {
  userId: string
  phone: string
  role: string
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch {
    return null
  }
}

export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function setAuthCookie(token: string): string {
  // 当前部署为HTTP，不设置Secure标志，否则浏览器会拒绝cookie
  return `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`
}
