import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { authConfig } from "@/auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        nim: { label: "NIM", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.nim) return null

        const user = await prisma.user.findUnique({
          where: { nim: credentials.nim as string },
        })

        if (!user) return null

        return {
          id: user.id,
          nim: user.nim,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
})