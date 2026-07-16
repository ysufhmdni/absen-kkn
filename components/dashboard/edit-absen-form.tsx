"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateAbsenStatus, deleteAbsen } from "@/app/dashboard/admin/actions"

type Props = {
  attendanceId: string
  currentStatus: string
  userName: string
  userNim: string
  userDivisi: string | null
  checkInAt: Date
}

export function EditAbsenForm({
  attendanceId,
  currentStatus,
  userName,
  userNim,
  userDivisi,
  checkInAt,
}: Props) {
  const [status, setStatus] = useState(currentStatus)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSave() {
    setError(null)
    startTransition(async () => {
      const res = await updateAbsenStatus(
        attendanceId,
        status as "hadir" | "izin" | "alpha"
      )
      if (res.success) {
        router.push("/dashboard/admin")
      } else {
        setError(res.message)
      }
    })
  }

  function handleDelete() {
    if (!confirm(`Yakin mau hapus data absen ${userName}?`)) return

    setError(null)
    startTransition(async () => {
      const res = await deleteAbsen(attendanceId)
      if (res.success) {
        router.push("/dashboard/admin")
      } else {
        setError(res.message)
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">NIM</p>
          <p className="font-medium">{userNim}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Nama</p>
          <p className="font-medium">{userName}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Divisi</p>
          <p className="font-medium">{userDivisi ?? "-"}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Waktu Absen</p>
          <p className="font-medium">
            {new Date(checkInAt).toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Status Absen</label>
        <Select
          value={status}
          onValueChange={(value) => {
            if (value !== null) setStatus(value)
          }}
          disabled={isPending}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hadir">Hadir</SelectItem>
            <SelectItem value="izin">Izin</SelectItem>
            <SelectItem value="alpha">Alpha</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-between pt-2">
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isPending}
        >
          Hapus Absen
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/admin")}
            disabled={isPending}
          >
            Batal
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            Simpan Perubahan
          </Button>
        </div>
      </div>
    </div>
  )
}