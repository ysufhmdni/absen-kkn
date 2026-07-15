"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getCurrentSession, getTodayDateOnly } from "@/lib/attendance-window"
import { revalidatePath } from "next/cache"

export async function submitAbsen() {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: "Kamu belum login" }
  }

  const currentSession = getCurrentSession()
  if (!currentSession) {
    return {
      success: false,
      message: "Di luar jam absen. Absen pagi: 11:00–13:00, absen malam: 20:00–21:00",
    }
  }

  const today = getTodayDateOnly()

  const existing = await prisma.attendance.findUnique({
    where: {
      userId_date_session: {
        userId: session.user.id,
        date: today,
        session: currentSession,
      },
    },
  })

  if (existing) {
    return {
      success: false,
      message: `Kamu sudah absen ${currentSession.toLowerCase()} hari ini`,
    }
  }

  try {
    await prisma.attendance.create({
      data: {
        userId: session.user.id,
        date: today,
        session: currentSession,
        status: "hadir",
      },
    })
  } catch (error: any) {
    // Tangani race condition: record sudah keburu dibuat oleh request lain
    if (error.code === "P2002") {
      return {
        success: false,
        message: `Kamu sudah absen ${currentSession.toLowerCase()} hari ini`,
      }
    }
    throw error
  }

  revalidatePath("/dashboard/user")

  return {
    success: true,
    message: `Absen ${currentSession.toLowerCase()} berhasil dicatat!`,
  }
}