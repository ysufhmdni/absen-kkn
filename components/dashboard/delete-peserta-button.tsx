"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { deletePeserta } from "@/app/dashboard/admin/peserta/actions"
import { Trash2 } from "lucide-react"

export function DeletePesertaButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm("Yakin ingin menghapus peserta ini?")) return
    startTransition(() => {
      deletePeserta(id)
    })
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={isPending}
    >
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  )
}