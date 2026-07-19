import { auth, signOut } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AbsenIzin } from "@/components/dashboard/absen-izin"
import { getTodayDateOnly } from "@/lib/attendance-window"

export const revalidate = 0

export default async function UserDashboardPage() {
  const session = await auth()
  const today = getTodayDateOnly()

  const attendancesToday = await prisma.attendance.findMany({
    where: {
      userId: session?.user?.id,
      date: today,
    },
  })

  const absenPagi = attendancesToday.find((a) => a.session === "PAGI")
  const absenMalam = attendancesToday.find((a) => a.session === "MALAM")

  const sudahAbsenPagi = absenPagi?.status === "hadir"
  const sudahAbsenMalam = absenMalam?.status === "hadir"

  const izinPagi = absenPagi?.status === "izin"
  const izinMalam = absenMalam?.status === "izin"

  const statusPagi = sudahAbsenPagi ? "hadir" : izinPagi ? "izin" : "belum"
  const statusMalam = sudahAbsenMalam ? "hadir" : izinMalam ? "izin" : "belum"

  const badgeClass = (status: "hadir" | "izin" | "belum") => {
    if (status === "hadir") return "bg-green-100 text-green-700 hover:bg-green-100"
    if (status === "izin") return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
    return "bg-gray-100 text-gray-500 hover:bg-gray-100"
  }

  const badgeLabel = (status: "hadir" | "izin" | "belum") => {
    if (status === "hadir") return "Sudah Absen"
    if (status === "izin") return "Izin Diajukan"
    return "Belum Absen"
  }

  return (
    <div className="min-h-screen bg-muted p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Absensi KKN</h1>
            <p className="text-muted-foreground">
              Halo, {session?.user?.name}
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

        <Card>
          <CardHeader>
            <CardTitle>Absen Sekarang</CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AbsenIzin
              sudahAbsenPagi={sudahAbsenPagi}
              sudahAbsenMalam={sudahAbsenMalam}
              izinPagi={izinPagi}
              izinMalam={izinMalam}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Absen Pagi
              </CardTitle>
              <CardDescription>06:00 – 07:00</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge className={badgeClass(statusPagi)}>
                {badgeLabel(statusPagi)}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Absen Malam
              </CardTitle>
              <CardDescription>20:00 – 21:00</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge className={badgeClass(statusMalam)}>
                {badgeLabel(statusMalam)}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}