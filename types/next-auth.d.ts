import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      nim: string
      role: string
    } & DefaultSession["user"]
  }

  interface User {
    nim: string
    role: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    nim: string
    role: string
  }
}