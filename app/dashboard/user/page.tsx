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

  const sudahAbsenPagi = attendancesToday.some((a) => a.session === "PAGI")
  const sudahAbsenMalam = attendancesToday.some((a) => a.session === "MALAM")

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
              sudahAbsenPagi={sudahAbsenPagi}
              sudahAbsenMalam={sudahAbsenMalam}
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
              <Badge
                className={
                  sudahAbsenPagi
                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-100"
                }
              >
                {sudahAbsenPagi ? "Sudah Absen" : "Belum Absen"}
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
              <Badge
                className={
                  sudahAbsenMalam
                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-100"
                }
              >
                {sudahAbsenMalam ? "Sudah Absen" : "Belum Absen"}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}