"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, Tags, Users, LogOut, Menu, Gift } from "lucide-react"

import { useAuth } from "@/hooks/useAuth"
import { ProtectedRoute } from "@/components/features/auth/ProtectedRoute"

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/berita", label: "Kelola Berita", icon: FileText },
  { href: "/admin/kategori", label: "Kategori", icon: Tags },
  { href: "/admin/promo", label: "Promo Banner", icon: Gift },
  { href: "/admin/users", label: "Pengguna", icon: Users },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const pathname = usePathname()
  const { logout, user } = useAuth()

  return (
    <ProtectedRoute requireAdmin>
      <div className="flex min-h-[calc(100vh-64px)] bg-muted/30">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed bottom-0 left-0 top-[64px] z-40 w-64 transform border-r border-border bg-card transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="p-6">
              <h2 className="text-lg font-bold text-foreground">Admin Panel</h2>
              <p className="text-sm text-muted-foreground">jagatnews.com</p>
            </div>

            <nav className="flex-1 space-y-1 px-4">
              {adminLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            <div className="border-t border-border p-4">
              <div className="mb-4 flex items-center gap-3 px-2">
                <div className="h-8 w-8 overflow-hidden rounded-full bg-muted">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Admin" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900/50 dark:text-blue-400">
                      {user?.name?.charAt(0) || "A"}
                    </div>
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium text-foreground">{user?.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={() => logout()}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                <LogOut className="h-5 w-5" />
                Keluar
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {/* Mobile header for sidebar toggle */}
          <div className="flex items-center border-b border-border bg-card p-4 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="mr-4 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-bold text-foreground">Admin Panel</h1>
          </div>

          <main className="h-full overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
