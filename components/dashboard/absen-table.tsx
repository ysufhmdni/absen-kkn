"use client"

import { useTransition } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { deleteAbsen } from "@/app/dashboard/admin/actions"

type Attendance = {
  id: string
  status: string
  checkInAt: Date
  user: {
    nim: string
    name: string | null
    divisi: string | null
  }
}

const statusColor: Record<string, string> = {
  hadir: "bg-green-100 text-green-700 hover:bg-green-100",
  izin: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  alpha: "bg-red-100 text-red-700 hover:bg-red-100",
}

export function AbsenTable({ attendances }: { attendances: Attendance[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>NIM</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>Divisi</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Waktu Absen</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attendances.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
              Belum ada data absensi untuk tanggal ini
            </TableCell>
          </TableRow>
        ) : (
          attendances.map((a) => <AbsenRow key={a.id} attendance={a} />)
        )}
      </TableBody>
    </Table>
  )
}

function AbsenRow({ attendance }: { attendance: Attendance }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (
      !confirm(
        `Yakin mau hapus data absen ${attendance.user.name ?? attendance.user.nim}?`
      )
    ) {
      return
    }

    startTransition(async () => {
      const res = await deleteAbsen(attendance.id)
      if (!res.success) {
        alert(res.message)
      }
    })
  }

  return (
    <TableRow>
      <TableCell>{attendance.user.nim}</TableCell>
      <TableCell>{attendance.user.name}</TableCell>
      <TableCell>{attendance.user.divisi}</TableCell>
      <TableCell>
        <Badge className={statusColor[attendance.status] ?? ""}>
          {attendance.status}
        </Badge>
      </TableCell>
      <TableCell>
        {new Date(attendance.checkInAt).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </TableCell>
      <TableCell className="text-right">
  <div className="flex justify-end gap-2">
    <Button
  variant="outline"
  size="sm"
  render={
    <Link href={`/dashboard/admin/absen/${attendance.id}/edit`} />
  }
>
  Edit
</Button>
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
    >
      Hapus
    </Button>
  </div>
</TableCell>
    </TableRow>
  )
}