import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const superadmin = await prisma.user.upsert({
    where: { nim: "23416255201171" },
    update: {},
    create: {
      nim: "23416255201171",
      name: "Super Admin",
      divisi: "HEKER",
      prodi: "-",
      role: "SUPERADMIN",
    },
  })

  console.log("Superadmin berhasil dibuat:", superadmin)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })