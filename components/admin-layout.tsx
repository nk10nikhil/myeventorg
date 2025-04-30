"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { BarChart3, Home, LogOut, QrCode, Settings, Users } from "lucide-react"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r bg-muted/40 md:block">
        <div className="flex h-16 items-center border-b px-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="text-xl font-bold">TechFest Admin</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          <Link href="/admin/dashboard">
            <Button variant={isActive("/admin/dashboard") ? "secondary" : "ghost"} className="w-full justify-start">
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/admin/scan">
            <Button variant={isActive("/admin/scan") ? "secondary" : "ghost"} className="w-full justify-start">
              <QrCode className="mr-2 h-4 w-4" />
              Scan QR
            </Button>
          </Link>
          <Link href="/admin/registrations">
            <Button variant={isActive("/admin/registrations") ? "secondary" : "ghost"} className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Registrations
            </Button>
          </Link>
          <Link href="/admin/settings">
            <Button variant={isActive("/admin/settings") ? "secondary" : "ghost"} className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start mt-auto"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center border-b px-4 md:px-6">
          <Link href="/" className="lg:hidden">
            <Button variant="ghost" size="icon" className="mr-2">
              <Home className="h-5 w-5" />
              <span className="sr-only">Home</span>
            </Button>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
