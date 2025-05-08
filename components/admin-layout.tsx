"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Home,
  LogOut,
  QrCode,
  Settings,
  Users,
  Bell,
  Sun,
  Moon,
  HelpCircle,
  Menu,
  X
} from "lucide-react"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Wait for component to mount to access theme
  useEffect(() => {
    setMounted(true)
  }, [])

  const isActive = (path: string) => {
    return pathname === path
  }

  // Animation classes for sidebar items
  const getAnimationDelay = (index: number) => {
    return { animationDelay: `${index * 0.05}s` };
  };

  // Sidebar navigation items - defined once to reuse in both desktop and mobile views
  const navigationItems = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: <BarChart3 className="h-4 w-4" />,
      delay: 0
    },
    {
      href: "/admin/scan",
      label: "Scan QR",
      icon: <QrCode className="h-4 w-4" />,
      delay: 1
    },
    {
      href: "/admin/registrations",
      label: "Registrations",
      icon: <Users className="h-4 w-4" />,
      delay: 2
    },
    {
      href: "/admin/settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
      delay: 3
    }
  ];

  const renderNavItem = (item: any, isMobile: boolean = false) => (
    <div className={`${!isMobile ? "animate-slide-in-left" : ""}`} style={!isMobile ? getAnimationDelay(item.delay) : undefined}>
      <Link href={item.href}>
        <Button
          variant={isActive(item.href) ? "secondary" : "ghost"}
          className={`w-full justify-start hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 font-medium ${isMobile ? "h-12" : ""}`}
          onClick={() => isMobile && setMobileMenuOpen(false)}
        >
          <span className="mr-2">{item.icon}</span>
          {item.label}
        </Button>
      </Link>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 border-r bg-sidebar-background text-sidebar-foreground md:block">
        <div className="flex h-16 items-center border-b border-sidebar-border px-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
            <Image
              src="/techfest-logo.svg"
              alt="TechFest Logo"
              width={28}
              height={28}
              className="h-7 w-7"
            />
            <span className="text-xl font-bold">TechFest Admin</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navigationItems.map(item => renderNavItem(item))}

          <div className="mt-auto pt-4 animate-slide-in-left" style={getAnimationDelay(4)}>
            <Button
              variant="ghost"
              className="w-full justify-start hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 font-medium"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </nav>

        {/* Help section with improved contrast */}
        <div className="p-4 mt-4 bg-sidebar-accent/30 mx-4 rounded-lg border border-sidebar-border">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="h-4 w-4 text-sidebar-foreground" />
            <span className="text-sm font-medium text-sidebar-foreground">Need Help?</span>
          </div>
          <p className="text-xs mb-2 text-sidebar-foreground/80">Check our documentation or contact support if you're having issues.</p>
          <Button variant="outline" size="sm" className="w-full text-xs bg-sidebar-background/70 text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent">
            View Documentation
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar (Sheet/Drawer) */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[80%] max-w-[280px] p-0 border-r bg-sidebar-background text-sidebar-foreground">
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
            <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
              <Image
                src="/techfest-logo.svg"
                alt="TechFest Logo"
                width={28}
                height={28}
                className="h-7 w-7"
              />
              <span className="text-xl font-bold">TechFest Admin</span>
            </Link>
            <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </div>
          <nav className="flex flex-col gap-1 p-4">
            {navigationItems.map(item => renderNavItem(item, true))}

            <div className="mt-auto pt-4">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 font-medium h-12"
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </nav>

          {/* Help section for mobile */}
          <div className="p-4 mt-4 bg-sidebar-accent/30 mx-4 rounded-lg border border-sidebar-border">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="h-4 w-4 text-sidebar-foreground" />
              <span className="text-sm font-medium text-sidebar-foreground">Need Help?</span>
            </div>
            <p className="text-xs mb-2 text-sidebar-foreground/80">Check our documentation or contact support.</p>
            <Button variant="outline" size="sm" className="w-full text-xs bg-sidebar-background/70 text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent">
              View Documentation
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b px-4 md:px-6">
          <div className="flex items-center gap-2">
            {/* Mobile menu trigger */}
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>

            <Link href="/" className="lg:hidden">
              <Button variant="ghost" size="icon" className="mr-2">
                <Home className="h-5 w-5" />
                <span className="sr-only">Home</span>
              </Button>
            </Link>

            <div className="text-sm breadcrumbs hidden md:block">
              <span className="text-muted-foreground">
                Admin / {pathname.split('/').pop()?.charAt(0).toUpperCase() + pathname.split('/').pop()?.slice(1)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Theme toggle */}
            {mounted && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      className="rounded-full"
                    >
                      {theme === "dark" ? (
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                      ) : (
                        <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                      )}
                      <span className="sr-only">Toggle theme</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle theme</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Notifications */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full relative">
                    <Bell className="h-[1.2rem] w-[1.2rem]" />
                    {notifications > 0 && (
                      <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                        {notifications}
                      </span>
                    )}
                    <span className="sr-only">Notifications</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>You have {notifications} notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* User profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/speaker.jpg" alt="Admin User" />
                    <AvatarFallback>AU</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Admin User</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      admin@techfest.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>

        {/* Footer */}
        <footer className="border-t py-3 px-6 text-center text-sm text-muted-foreground">
          <p>© 2025 TechFest Admin Dashboard. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
