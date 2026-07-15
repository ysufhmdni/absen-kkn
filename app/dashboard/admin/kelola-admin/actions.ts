"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createAdmin(formData: FormData) {
  const session = await auth()
  if (session?.user?.role !== "SUPERADMIN") {
    return { success: false, message: "Hanya superadmin yang bisa menambah admin" }
  }

  const nim = formData.get("nim") as string
  const name = formData.get("name") as string
  const role = formData.get("role") as string

  if (!nim || !name || !role) {
    return { success: false, message: "Semua field wajib diisi" }
  }

  if (!["ADMIN", "SUPERADMIN"].includes(role)) {
    return { success: false, message: "Role tidak valid" }
  }

  const existing = await prisma.user.findUnique({ where: { nim } })
  if (existing) {
    return { success: false, message: "NIM sudah terdaftar" }
  }

  await prisma.user.create({
    data: {
      nim,
      name,
      prodi: "-",
      divisi: "Panitia",
      role: role as "ADMIN" | "SUPERADMIN",
    },
  })

  revalidatePath("/dashboard/admin/kelola-admin")

  return { success: true, message: "Admin berhasil ditambahkan" }
}

export async function deleteAdmin(id: string) {
  const session = await auth()
  if (session?.user?.role !== "SUPERADMIN") {
    return { success: false, message: "Tidak diizinkan" }
  }

  // Cegah superadmin menghapus akunnya sendiri
  if (session.user.id === id) {
    return { success: false, message: "Tidak bisa menghapus akun sendiri" }
  }

  await prisma.user.delete({ where: { id } })
  revalidatePath("/dashboard/admin/kelola-admin")

  return { success: true, message: "Admin berhasil dihapus" }
}