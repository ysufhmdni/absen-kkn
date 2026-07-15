import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const role = req.auth?.user?.role
  const path = req.nextUrl.pathname

  const isAdminArea = path.startsWith("/dashboard/admin")
  const isUserArea = path.startsWith("/dashboard/user")

  if (!isLoggedIn && (isAdminArea || isUserArea)) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (isAdminArea && !["ADMIN", "SUPERADMIN"].includes(role as string)) {
    return NextResponse.redirect(new URL("/dashboard/user", req.url))
  }

  if (isUserArea && role !== "USER") {
    return NextResponse.redirect(new URL("/dashboard/admin", req.url))
  }
})

export const config = {
  matcher: ["/dashboard/:path*"],
}