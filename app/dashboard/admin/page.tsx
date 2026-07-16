import { auth, signOut } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DateFilter } from "@/components/dashboard/date-filter"
import { ExportReportButton } from "@/components/dashboard/export-report-button"
import { recordAttendance } from "@/lib/attendance"
import { getCurrentSession } from "@/lib/attendance-window"

export const revalidate = 0 // selalu ambil data terbaru setiap request

const JAKARTA_TZ = "Asia/Jakarta"
const JAKARTA_OFFSET_MS = 7 * 60 * 60 * 1000 // WIB = UTC+7

// Ambil tahun/bulan/tanggal versi Jakarta, baik dari dateParam ("YYYY-MM-DD")
// maupun dari waktu "sekarang".
function getJakartaDateParts(dateParam?: string) {
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

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const session = await auth()
  const { date: dateParam } = await searchParams

  // Auto-absen untuk ADMIN/SUPERADMIN setiap buka dashboard, kalau lagi jam absen
  if (
    (session?.user?.role === "ADMIN" || session?.user?.role === "SUPERADMIN") &&
    getCurrentSession() &&
    session?.user?.id
  ) {
    await recordAttendance(session.user.id)
  }

  const { year, month, day } = getJakartaDateParts(dateParam)

  // Representasi tanggal terpilih (untuk ditampilkan di DateFilter)
  const selectedDate = new Date(Date.UTC(year, month, day))

  // Awal & akhir hari dalam zona waktu Jakarta, dikonversi ke UTC untuk query Prisma
  const startOfDay = new Date(Date.UTC(year, month, day, 0, 0, 0) - JAKARTA_OFFSET_MS)
  const endOfDay = new Date(Date.UTC(year, month, day, 23, 59, 59, 999) - JAKARTA_OFFSET_MS)

  const [totalPeserta, attendances] = await Promise.all([
    prisma.user.count({
      where: { role: { in: ["USER", "ADMIN", "SUPERADMIN"] } },
    }),
    prisma.attendance.findMany({
      where: {
        date: { gte: startOfDay, lte: endOfDay },
      },
      include: { user: true },
      orderBy: { date: "desc" },
    }),
  ])

  const totalHadir = attendances.filter((a) => a.status === "hadir").length
  const totalIzin = attendances.filter((a) => a.status === "izin").length
  const belumAbsen = totalPeserta - attendances.length

  const statusColor: Record<string, string> = {
    hadir: "bg-green-100 text-green-700 hover:bg-green-100",
    izin: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
    alpha: "bg-red-100 text-red-700 hover:bg-red-100",
  }

  return (
    <div className="min-h-screen bg-muted p-6">
      <div className="mx-auto max-w-6xl space-y-6 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard Admin</h1>
            <p className="text-muted-foreground">
              Selamat datang, {session?.user?.name}
            </p>
          </div>

          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/login" })
            }}
          >
            <Button type="submit" variant="outline">
              Logout
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Peserta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalPeserta}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Hadir Hari Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">{totalHadir}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Izin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-yellow-600">{totalIzin}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Belum Absen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">{belumAbsen}</p>
            </CardContent>
          </Card>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NIM</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Divisi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Waktu Absen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      Belum ada data absensi untuk tanggal ini
                    </TableCell>
                  </TableRow>
                ) : (
                  attendances.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>{a.user.nim}</TableCell>
                      <TableCell>{a.user.name}</TableCell>
                      <TableCell>{a.user.divisi}</TableCell>
                      <TableCell>
                        <Badge className={statusColor[a.status] ?? ""}>
                          {a.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(a.checkInAt).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: JAKARTA_TZ,
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}