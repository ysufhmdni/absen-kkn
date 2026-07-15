"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Helper: pastikan yang manggil action ini benar-benar admin/superadmin
async function requireAdmin() {
  const session = await auth()
  const role = session?.user?.role

  if (!session?.user?.id || (role !== "ADMIN" && role !== "SUPERADMIN")) {
    return { authorized: false as const, message: "Kamu tidak punya akses untuk ini" }
  }

  return { authorized: true as const, session }
}

export async function updateAbsenStatus(
  attendanceId: string,
  newStatus: "hadir" | "izin" | "alpha"
) {
  const check = await requireAdmin()
  if (!check.authorized) {
    return { success: false, message: check.message }
  }

  const existing = await prisma.attendance.findUnique({
    where: { id: attendanceId },
  })

  if (!existing) {
    return { success: false, message: "Data absen tidak ditemukan" }
  }

  await prisma.attendance.update({
    where: { id: attendanceId },
    data: { status: newStatus },
  })

  revalidatePath("/dashboard/admin")

  return { success: true, message: "Status absen berhasil diubah" }
}

export async function deleteAbsen(attendanceId: string) {
  const check = await requireAdmin()
  if (!check.authorized) {
    return { success: false, message: check.message }
  }

  const existing = await prisma.attendance.findUnique({
    where: { id: attendanceId },
  })

  if (!existing) {
    return { success: false, message: "Data absen tidak ditemukan" }
  }

  await prisma.attendance.delete({
    where: { id: attendanceId },
  })

  revalidatePath("/dashboard/admin")

  return { success: true, message: "Data absen berhasil dihapus" }
}