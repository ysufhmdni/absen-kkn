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
import { AbsenButton } from "@/components/dashboard/absen-button"
import { IzinDialog } from "@/components/dashboard/izin-dialog"
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

  const getBadge = (status?: "hadir" | "izin" | "alpha" | undefined) => {
    if (status === "hadir")
      return { text: "Sudah Absen", className: "bg-green-100 text-green-700 hover:bg-green-100" }
    if (status === "izin")
      return { text: "Izin", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" }
    return { text: "Belum Absen", className: "bg-gray-100 text-gray-500 hover:bg-gray-100" }
  }

  const badgePagi = getBadge(absenPagi?.status)
  const badgeMalam = getBadge(absenMalam?.status)

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
            <AbsenButton
              sudahAbsenPagi={sudahAbsenPagi || izinPagi}
              sudahAbsenMalam={sudahAbsenMalam || izinMalam}
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
            <CardContent className="space-y-3">
              <Badge className={badgePagi.className}>{badgePagi.text}</Badge>
              {izinPagi && absenPagi?.keterangan && (
                <p className="text-xs text-muted-foreground">
                  Alasan: {absenPagi.keterangan}
                </p>
              )}
              {!sudahAbsenPagi && !izinPagi && (
                <IzinDialog session="PAGI" label="Pagi" />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Absen Malam
              </CardTitle>
              <CardDescription>20:00 – 21:00</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge className={badgeMalam.className}>{badgeMalam.text}</Badge>
              {izinMalam && absenMalam?.keterangan && (
                <p className="text-xs text-muted-foreground">
                  Alasan: {absenMalam.keterangan}
                </p>
              )}
              {!sudahAbsenMalam && !izinMalam && (
                <IzinDialog session="MALAM" label="Malam" />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}