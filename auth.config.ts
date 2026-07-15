import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.nim = user.nim
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.nim = token.nim as string
        session.user.id = token.sub as string
      }
      return session
    },
  },
  providers: [], // provider (Credentials) diisi di lib/auth.ts, bukan di sini
}