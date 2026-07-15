import { prisma } from "@/lib/prisma"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DateFilter } from "@/components/dashboard/date-filter"
import { ExportReportButton } from "@/components/dashboard/export-report-button"
import { AbsenTable } from "@/components/dashboard/absen-table"

export const revalidate = 0

export default async function KelolaAbsenPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const { date: dateParam } = await searchParams

  const selectedDate = dateParam ? new Date(dateParam) : new Date()
  const startOfDay = new Date(
    Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
  )
  const endOfDay = new Date(
    Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59, 999)
  )

  const attendances = await prisma.attendance.findMany({
    where: {
      date: { gte: startOfDay, lte: endOfDay },
    },
    include: { user: true },
    orderBy: { date: "desc" },
  })

  return (
    <div className="min-h-screen bg-muted p-6">
      <div className="mx-auto max-w-6xl space-y-6 p-4">
        <div>
          <h1 className="text-2xl font-bold">Kelola Absen</h1>
          <p className="text-muted-foreground">
            Edit atau hapus data absensi peserta
          </p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Laporan Absensi Harian</CardTitle>
            <div className="flex items-center gap-2">
              <DateFilter selectedDate={selectedDate} />
              <ExportReportButton />
            </div>
          </CardHeader>
          <CardContent>
            <AbsenTable attendances={attendances} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}