"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createAdmin } from "@/app/dashboard/admin/kelola-admin/actions"
import { Plus } from "lucide-react"

export function AddAdminDialog() {
  const [open, setOpen] = useState(false)
  const [role, setRole] = useState("ADMIN")
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (formData: FormData) => {
    formData.set("role", role)
    startTransition(async () => {
      const res = await createAdmin(formData)
      if (!res.success) {
        toast.error("Gagal menambah admin", { description: res.message })
        return
      }
      toast.success("Berhasil", { description: res.message })
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-2 h-4 w-4" />
        Tambah Admin
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Admin Baru</DialogTitle>
          <DialogDescription>
            Akun ini akan memiliki akses ke dashboard admin
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
            <Label>Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="SUPERADMIN">Superadmin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Menyimpan..." : "Simpan Admin"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}