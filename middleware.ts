import { jwtVerify } from "jose"
import { NextRequest, NextResponse } from "next/server"

const secretKey = process.env.JWT_SECRET || "feira-agropec-secret-key-2025"
const key = new TextEncoder().encode(secretKey)

export async function middleware(request: NextRequest) {
  // Verificar se é uma rota protegida
  if (request.nextUrl.pathname.startsWith("/admin") && 
      !request.nextUrl.pathname.startsWith("/admin/login")) {
    
    const token = request.cookies.get("session")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    try {
      await jwtVerify(token, key, {
        algorithms: ["HS256"],
      })
      
      return NextResponse.next()
    } catch (error) {
      console.error("Token inválido:", error)
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"]
}