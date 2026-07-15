"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  ClipboardList,
  LogOut,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { signOut } from "next-auth/react"

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Kelola Absen",
    url: "/dashboard/admin",
    icon: ClipboardList,
  },
  {
    title: "Kelola Peserta",
    url: "/dashboard/admin/peserta",
    icon: Users,
  },
]

export function AppSidebar({
  userRole,
  userName,
  userNim,
}: {
  userRole: string
  userName: string
  userNim: string
}) {
  const pathname = usePathname()

  const items =
    userRole === "SUPERADMIN"
      ? [
          ...menuItems,
          {
            title: "Kelola Admin",
            url: "/dashboard/admin/kelola-admin",
            icon: ShieldCheck,
          },
        ]
      : menuItems

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight">
            Absensi KKN
          </span>
          <span className="text-xs text-muted-foreground">Panel Admin</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, index) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={`${item.url}-${index}`}>
                    <SidebarMenuButton
                      isActive={isActive}
                      render={
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-medium">{userName}</span>
            <span className="truncate text-xs text-muted-foreground">
              {userNim}
            </span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}