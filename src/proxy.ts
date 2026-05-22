import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

function getSecret() {
  return new TextEncoder().encode(process.env.JWT_SECRET!)
}

const PUBLIC_PREFIXES = [
  "/login",
  "/api/auth/register",
  "/api/auth/login",
  "/_next",
  "/favicon.ico",
]

function isPublic(pathname: string) {
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("token")?.value

  if (isPublic(pathname)) {
    if (pathname === "/login" && token) {
      try {
        await jwtVerify(token, getSecret())
        return NextResponse.redirect(new URL("/", request.url))
      } catch {}
    }
    return NextResponse.next()
  }

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    const { payload } = await jwtVerify(token, getSecret())
    const userId   = payload.userId   as string
    const role     = payload.role     as string
    const username = payload.username as string

    if (pathname.startsWith("/api/admin") && role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url))
    }

    const headers = new Headers(request.headers)
    headers.set("x-user-id",   userId)
    headers.set("x-user-role", role)
    headers.set("x-username",  username)
    return NextResponse.next({ request: { headers } })
  } catch {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.svg$).*)"],
}
