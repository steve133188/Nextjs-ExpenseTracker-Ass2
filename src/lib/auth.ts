import { SignJWT, jwtVerify } from "jose"

export interface JWTPayload {
  userId: string
  username: string
  role: string
}

function getSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error("JWT_SECRET env var is not set")
  return new TextEncoder().encode(secret)
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(getSecret())
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return {
      userId:   payload.userId   as string,
      username: payload.username as string,
      role:     payload.role     as string,
    }
  } catch {
    return null
  }
}

export function setCookieHeader(token: string): string {
  return `token=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800`
}

export function clearCookieHeader(): string {
  return `token=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`
}
