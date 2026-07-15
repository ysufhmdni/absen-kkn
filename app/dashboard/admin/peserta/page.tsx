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
import { AddPesertaDialog } from "@/components/dashboard/add-peserta-dialog"
import { DeletePesertaButton } from "@/components/dashboard/delete-peserta-button"

export const revalidate = 0

export default async function PesertaPage() {
  const peserta = await prisma.user.findMany({
    where: { role: "USER" },
    orderBy: { name: "asc" },
  })

  return (
    <div className="min-h-screen bg-muted p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Kelola Peserta</h1>
            <p className="text-muted-foreground">
              Total {peserta.length} peserta terdaftar
            </p>
          </div>
          <AddPesertaDialog />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Peserta</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NIM</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Prodi</TableHead>
                  <TableHead>Divisi</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {peserta.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      Belum ada peserta terdaftar
                    </TableCell>
                  </TableRow>
                ) : (
                  peserta.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.nim}</TableCell>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.prodi}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{p.divisi}</Badge>
                      </TableCell>
                      <TableCell>
                        <DeletePesertaButton id={p.id} />
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