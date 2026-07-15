"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function LoginPage() {
  const [nim, setNim] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await signIn("credentials", {
      nim,
      redirect: false,
    })

    if (res?.error) {
      setLoading(false)
      toast.error("Login gagal", {
        description: "NIM gaada kampang. Yang bener dong masukin NIM nya. maaf kasar",
      })
      return
    }

    const sessionRes = await fetch("/api/auth/session")
    const sessionData = await sessionRes.json()
    const role = sessionData?.user?.role

    setLoading(false)
    toast.success("Login berhasil", {
      description: `Selamat datang, ${sessionData?.user?.name}`,
    })

    if (role === "ADMIN" || role === "SUPERADMIN") {
      router.push("/dashboard/admin")
    } else {
      router.push("/dashboard/user")
    }
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login Absensi KKN</CardTitle>
          <CardDescription>
            Masukkan NIM kamu untuk masuk ke akun
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form id="login-form" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="nim">NIM</Label>
                <Input
                  id="nim"
                  type="text"
                  placeholder="Contoh: 234162"
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            form="login-form"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}