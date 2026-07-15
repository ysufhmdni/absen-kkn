// lib/attendance.ts
import { prisma } from "@/lib/prisma"
import { getCurrentSession, getTodayDateOnly } from "@/lib/attendance-window"

type RecordAttendanceResult = {
  success: boolean
  message: string
}

export async function recordAttendance(userId: string): Promise<RecordAttendanceResult> {
  const currentSession = getCurrentSession()
  if (!currentSession) {
    return {
      success: false,
      message: "Di luar jam absen. Absen pagi: 11:00–18:00, absen malam: 20:00–21:00",
    }
  }

  const today = getTodayDateOnly()

  const existing = await prisma.attendance.findUnique({
    where: {
      userId_date_session: {
        userId,
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
        userId,
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

  return {
    success: true,
    message: `Absen ${currentSession.toLowerCase()} berhasil dicatat!`,
  }
}