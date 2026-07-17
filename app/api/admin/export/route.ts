import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import ExcelJS from "exceljs"

const JAKARTA_TZ = "Asia/Jakarta"
const JAKARTA_OFFSET_MS = 7 * 60 * 60 * 1000

function getJakartaDateParts(dateParam?: string | null) {
  if (dateParam) {
    const [year, month, day] = dateParam.split("-").map(Number)
    return { year, month: month - 1, day }
  }
  const now = new Date()
  const jakartaNow = new Date(now.getTime() + JAKARTA_OFFSET_MS)
  return {
    year: jakartaNow.getUTCFullYear(),
    month: jakartaNow.getUTCMonth(),
    day: jakartaNow.getUTCDate(),
  }
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const dateParam = req.nextUrl.searchParams.get("date")
  const { year, month, day } = getJakartaDateParts(dateParam)

  const startOfDay = new Date(Date.UTC(year, month, day, 0, 0, 0) - JAKARTA_OFFSET_MS)
  const endOfDay = new Date(Date.UTC(year, month, day, 23, 59, 59, 999) - JAKARTA_OFFSET_MS)

  const attendances = await prisma.attendance.findMany({
    where: { date: { gte: startOfDay, lte: endOfDay } },
    include: { user: true },
    orderBy: { date: "desc" },
  })

  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet("Laporan Absensi")

  sheet.columns = [
    { header: "NIM", key: "nim", width: 15 },
    { header: "Nama", key: "nama", width: 25 },
    { header: "Divisi", key: "divisi", width: 20 },
    { header: "Status", key: "status", width: 12 },
    { header: "Waktu Absen", key: "waktu", width: 15 },
  ]

  sheet.getRow(1).font = { bold: true }
  sheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE5E7EB" },
  }

  attendances.forEach((a) => {
    sheet.addRow({
      nim: a.user.nim,
      nama: a.user.name,
      divisi: a.user.divisi,
      status: a.status,
      waktu: new Date(a.checkInAt).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: JAKARTA_TZ,
      }),
    })
  })

  const buffer = await workbook.xlsx.writeBuffer()
  const dateLabel = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="absensi-${dateLabel}.xlsx"`,
    },
  })
}