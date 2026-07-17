"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"

export function ExportReportButton() {
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const date = searchParams.get("date")

  async function handleExport() {
    setLoading(true)
    try {
      const url = date
        ? `/api/admin/export?date=${date}`
        : `/api/admin/export`
      const res = await fetch(url)
      if (!res.ok) throw new Error("Gagal export")

      const blob = await res.blob()
      const disposition = res.headers.get("Content-Disposition")
      const filenameMatch = disposition?.match(/filename="(.+)"/)
      const filename = filenameMatch?.[1] ?? "absensi.xlsx"

      const link = document.createElement("a")
      link.href = window.URL.createObjectURL(blob)
      link.download = filename
      link.click()
      window.URL.revokeObjectURL(link.href)
    } catch (err) {
      console.error(err)
      alert("Gagal export laporan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleExport} variant="outline" disabled={loading}>
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      Export Excel
    </Button>
  )
}