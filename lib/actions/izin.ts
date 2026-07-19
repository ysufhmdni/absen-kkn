"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getTodayDateOnly } from "@/lib/attendance-window"
import { revalidatePath } from "next/cache"
import { Session } from "@prisma/client"

export async function ajukanIzin(session: Session, keterangan: string) {
  const authSession = await auth()
  const userId = authSession?.user?.id

  if (!userId) {
    return { success: false, message: "Anda belum login." }
  }

  if (!keterangan || keterangan.trim().length < 5) {
    return { success: false, message: "Alasan izin minimal 5 karakter." }
  }

  const today = getTodayDateOnly()

  try {
    await prisma.attendance.create({
      data: {
        userId,
        date: today,
        session,
        status: "izin",
        keterangan: keterangan.trim(),
      },
    })
  } catch (error: any) {
    // P2002 = unique constraint violation (sudah ada record untuk sesi ini)
    if (error.code === "P2002") {
      return {
        success: false,
        message: "Anda sudah absen atau mengajukan izin untuk sesi ini.",
      }
    }
    return { success: false, message: "Terjadi kesalahan, coba lagi." }
  }

  revalidatePath("/dashboard")
  return { success: true, message: "Izin berhasil diajukan." }
}