"use client"

import { useState, useEffect } from "react"
import { AbsenButton } from "@/components/dashboard/absen-button"
import { IzinDialog } from "@/components/dashboard/izin-dialog"
import { getCurrentSession } from "@/lib/attendance-window"

export function AbsenIzin({
  sudahAbsenPagi,
  sudahAbsenMalam,
  izinPagi,
  izinMalam,
}: {
  sudahAbsenPagi: boolean
  sudahAbsenMalam: boolean
  izinPagi: boolean
  izinMalam: boolean
}) {
  const [currentSession, setCurrentSession] = useState<string | null>(null)

  useEffect(() => {
    const update = () => setCurrentSession(getCurrentSession())
    update()
    const interval = setInterval(update, 1000 * 30)
    return () => clearInterval(interval)
  }, [])

  const sudahAbsenSesiIni =
    (currentSession === "PAGI" && sudahAbsenPagi) ||
    (currentSession === "MALAM" && sudahAbsenMalam)

  const sudahIzinSesiIni =
    (currentSession === "PAGI" && izinPagi) ||
    (currentSession === "MALAM" && izinMalam)

  return (
    <div className="space-y-3">
      <AbsenButton
        sudahAbsenPagi={sudahAbsenPagi}
        sudahAbsenMalam={sudahAbsenMalam}
      />

      {currentSession && !sudahAbsenSesiIni && !sudahIzinSesiIni && (
        <IzinDialog
          session={currentSession as "PAGI" | "MALAM"}
          label={currentSession === "PAGI" ? "Pagi" : "Malam"}
        />
      )}
    </div>
  )
}