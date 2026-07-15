"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createPeserta(formData: FormData) {
  const nim = formData.get("nim") as string
  const name = formData.get("name") as string
  const prodi = formData.get("prodi") as string
  const divisi = formData.get("divisi") as string

  if (!nim || !name || !prodi || !divisi) {
    return { success: false, message: "Semua field wajib diisi" }
  }

  const existing = await prisma.user.findUnique({ where: { nim } })
  if (existing) {
    return { success: false, message: "NIM sudah terdaftar" }
  }

  await prisma.user.create({
    data: {
      nim,
      name,
      prodi,
      divisi,
      role: "USER",
    },
  })

  revalidatePath("/dashboard/admin/peserta")

  return { success: true, message: "Peserta berhasil ditambahkan" }
}

export async function deletePeserta(id: string) {
  await prisma.user.delete({ where: { id } })
  revalidatePath("/dashboard/admin/peserta")
}