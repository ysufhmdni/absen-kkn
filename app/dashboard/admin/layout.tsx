import { auth } from "@/lib/auth"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <SidebarProvider>
      <AppSidebar
        userRole={session?.user?.role ?? ""}
        userName={session?.user?.name ?? ""}
        userNim={session?.user?.nim ?? ""}
      />
      <main className="w-full">
        <div className="flex items-center gap-2 border-b p-4">
          <SidebarTrigger />
          <span className="text-sm text-muted-foreground">Menu</span>
        </div>
        <div className="p-2">{children}</div>
      </main>
    </SidebarProvider>
  )
}