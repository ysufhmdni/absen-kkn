import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
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
import { Badge } from "@/components/ui/badge"
import { AddAdminDialog } from "@/components/dashboard/add-admin-dialog"
import { DeleteAdminButton } from "@/components/dashboard/delete-admin-dialog"

export const revalidate = 0

export default async function KelolaAdminPage() {
  const session = await auth()

  // Proteksi tambahan: hanya superadmin yang boleh akses halaman ini
  if (session?.user?.role !== "SUPERADMIN") {
    redirect("/dashboard/admin")
  }

  const admins = await prisma.user.findMany({
    where: { role: { in: ["ADMIN", "SUPERADMIN"] } },
    orderBy: { name: "asc" },
  })

  return (
    <div className="min-h-screen bg-muted p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Kelola Admin</h1>
            <p className="text-muted-foreground">
              Total {admins.length} admin terdaftar
            </p>
          </div>
          <AddAdminDialog />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NIM</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.nim}</TableCell>
                    <TableCell>{a.name}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          a.role === "SUPERADMIN"
                            ? "bg-purple-100 text-purple-700 hover:bg-purple-100"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-100"
                        }
                      >
                        {a.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {a.id !== session.user.id && (
                        <DeleteAdminButton id={a.id} />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}