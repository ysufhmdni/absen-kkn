"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { deleteAdmin } from "@/app/dashboard/admin/kelola-admin/actions"
import { Trash2 } from "lucide-react"

export function DeleteAdminButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm("Yakin ingin menghapus admin ini?")) return
    startTransition(async () => {
      const res = await deleteAdmin(id)
      if (!res.success) {
        toast.error("Gagal menghapus", { description: res.message })
        return
      }
      toast.success(res.message ?? "Admin berhasil dihapus")
    })
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isPending}>
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  )
}