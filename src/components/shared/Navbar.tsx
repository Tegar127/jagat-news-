"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import {
  Search,
  Menu,
  X,
  UserCircle,
  LogOut,
  User,
  LayoutDashboard,
} from "lucide-react"

import { useAuth } from "@/hooks/useAuth"
import { ThemeToggle } from "./ThemeToggle"
import { Button } from "../ui/Button"

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/berita", label: "Berita" },
  { href: "/tentang", label: "Tentang" },
  { href: "/kontak", label: "Kontak" },
]

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [scrolled, setScrolled] = React.useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const { user, logout, openModal } = useAuth()

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (pathname.startsWith("/admin")) {
    return null
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
      setSearchTerm("")
      setIsMenuOpen(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    setIsProfileMenuOpen(false)
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-background border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-1 group">
              <span className="text-2xl font-black tracking-tighter text-foreground">
                Jagat<span className="text-blue-600">.</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-foreground ${
                      isActive ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
              <input
                type="text"
                placeholder="Cari berita..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-40 xl:w-56 pl-9 pr-4 py-1.5 bg-transparent border border-border rounded-full text-sm text-foreground focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground transition-all placeholder:text-muted-foreground/70"
              />
            </form>

            <div className="h-4 w-px bg-border mx-1" />

            <ThemeToggle />

            {user ? (
              <div className="relative ml-1">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center focus:outline-none rounded-full ring-2 ring-transparent hover:ring-border transition-all"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle className="w-8 h-8 text-muted-foreground" />
                  )}
                </button>

                {isProfileMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-card rounded-lg shadow-lg py-1 z-50 border border-border animate-fade-in">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
                      </div>
                      
                      <div className="py-1">
                        {(user.role === "ADMIN" || user.role === "ADMINISTRATOR") && (
                          <Link
                            href="/admin/dashboard"
                            className="flex items-center px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            Dashboard Admin
                          </Link>
                        )}
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Profil Saya
                        </Link>
                      </div>
                      
                      <div className="border-t border-border py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Keluar
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-1">
                <Button variant="ghost" size="sm" className="font-medium" onClick={() => openModal("login")}>
                  Masuk
                </Button>
                <Button size="sm" className="font-medium rounded-full px-5" onClick={() => openModal("register")}>
                  Daftar
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border animate-slide-up">
          <div className="px-4 py-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari berita..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-transparent border border-border rounded-lg text-sm focus:outline-none focus:border-foreground"
              />
            </form>
          </div>
          
          <nav className="flex flex-col px-2 pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  pathname === link.href
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="pt-4 mt-2 border-t border-border">
                <div className="px-4 py-2 mb-2">
                  <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                
                {(user.role === "ADMIN" || user.role === "ADMINISTRATOR") && (
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center px-4 py-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4 mr-3" />
                    Dashboard
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="flex items-center px-4 py-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-4 h-4 mr-3" />
                  Kelola Profil
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsMenuOpen(false) }}
                  className="w-full flex items-center px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 rounded-md"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Keluar
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 px-4 pt-4 mt-2 border-t border-border">
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  onClick={() => { openModal("login"); setIsMenuOpen(false) }}
                >
                  Masuk
                </Button>
                <Button
                  className="w-full justify-center"
                  onClick={() => { openModal("register"); setIsMenuOpen(false) }}
                >
                  Daftar
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
