"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ajukanIzin } from "@/lib/actions/izin"
import { Session } from "@prisma/client"
import { toast } from "sonner"

interface IzinDialogProps {
  session: Session
  label: string
}

export function IzinDialog({ session, label }: IzinDialogProps) {
  const [open, setOpen] = useState(false)
  const [keterangan, setKeterangan] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleSubmit = () => {
    startTransition(async () => {
      const result = await ajukanIzin(session, keterangan)
      if (result.success) {
        toast.success(result.message)
        setOpen(false)
        setKeterangan("")
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
  render={
    <Button size="lg" className="w-full">
      Izin {label}
    </Button>
  }
>
  Izin {label}
</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajukan Izin — {label}</DialogTitle>
          <DialogDescription>
            Jelaskan alasan Anda tidak bisa hadir pada sesi ini.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          placeholder="Contoh: Sakit demam, ada surat dokter menyusul."
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value)}
          rows={4}
        />

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Mengirim..." : "Kirim Izin"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}