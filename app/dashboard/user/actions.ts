"use server"

import { auth } from "@/lib/auth"
import { recordAttendance } from "@/lib/attendance"
import { revalidatePath } from "next/cache"

export async function submitAbsen() {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: "Kamu belum login" }
  }

  const result = await recordAttendance(session.user.id)

  if (result.success) {
    revalidatePath("/dashboard/user")
  }

  return result
}