"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createPeserta } from "@/app/dashboard/admin/peserta/actions"
import { Plus } from "lucide-react"

export function AddPesertaDialog() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (formData: FormData) => {
    setError("")
    startTransition(async () => {
      const res = await createPeserta(formData)
      if (!res.success) {
        setError(res.message)
        return
      }
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-2 h-4 w-4" />
        Tambah Peserta
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Peserta Baru</DialogTitle>
          <DialogDescription>
            Isi data peserta KKN yang akan didaftarkan
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="nim">NIM</Label>
            <Input id="nim" name="nim" placeholder="Contoh: 23416255201171" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Nama</Label>
            <Input id="name" name="name" placeholder="Nama lengkap" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="prodi">Program Studi</Label>
            <Input id="prodi" name="prodi" placeholder="Contoh: Teknik Informatika" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="divisi">Divisi</Label>
            <Input id="divisi" name="divisi" placeholder="Contoh: Pendidikan" required />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Menyimpan..." : "Simpan Peserta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}