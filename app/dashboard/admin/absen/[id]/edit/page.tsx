import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { EditAbsenForm } from "@/components/dashboard/edit-absen-form"

export default async function EditAbsenPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  const role = session?.user?.role

  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    redirect("/dashboard/user")
  }

  const { id } = await params

  const attendance = await prisma.attendance.findUnique({
    where: { id },
    include: { user: true },
  })

  if (!attendance) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-muted p-6">
      <div className="mx-auto max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Edit Absen — {attendance.user.name ?? attendance.user.nim}</CardTitle>
          </CardHeader>
          <CardContent>
            <EditAbsenForm
              attendanceId={attendance.id}
              currentStatus={attendance.status}
              userName={attendance.user.name ?? attendance.user.nim}
              userNim={attendance.user.nim}
              userDivisi={attendance.user.divisi}
              checkInAt={attendance.checkInAt}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}