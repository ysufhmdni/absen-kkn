"use client"

import { useState, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { getCurrentSession } from "@/lib/attendance-window"
import { submitAbsen } from "@/app/dashboard/user/actions"
import { CheckCircle2, Clock } from "lucide-react"

export function AbsenButton({
  sudahAbsenPagi,
  sudahAbsenMalam,
}: {
  sudahAbsenPagi: boolean
  sudahAbsenMalam: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null)
  const [currentSession, setCurrentSession] = useState<string | null>(null)

  useEffect(() => {
    const update = () => {
      const s = getCurrentSession()
      setCurrentSession(s)
    }
    update()
    const interval = setInterval(update, 1000 * 30) // cek tiap 30 detik
    return () => clearInterval(interval)
  }, [])

  const alreadyAbsenThisSession =
    (currentSession === "PAGI" && sudahAbsenPagi) ||
    (currentSession === "MALAM" && sudahAbsenMalam)

  const handleAbsen = () => {
    startTransition(async () => {
      const res = await submitAbsen()
      setMessage({ success: res.success, text: res.message })
    })
  }

  if (!currentSession) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-dashed p-4 text-muted-foreground">
        <Clock className="h-5 w-5" />
        <p className="text-sm">
          Di luar jam absen. Absen pagi: 06:00–07:00, absen malam: 20:00–21:00
        </p>
      </div>
    )
  }

  if (alreadyAbsenThisSession) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
        <CheckCircle2 className="h-5 w-5" />
        <p className="text-sm font-medium">
          Kamu sudah absen {currentSession.toLowerCase()} hari ini
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Button onClick={handleAbsen} disabled={isPending} className="w-full" size="lg">
        {isPending ? "Memproses..." : `Absen ${currentSession === "PAGI" ? "Pagi" : "Malam"} Sekarang`}
      </Button>
      {message && (
        <p className={`text-sm ${message.success ? "text-green-600" : "text-destructive"}`}>
          {message.text}
        </p>
      )}
    </div>
  )
}