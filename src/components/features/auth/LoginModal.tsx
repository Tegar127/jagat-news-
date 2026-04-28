"use client"

import * as React from "react"
import { X, Mail, Lock, User, Globe } from "lucide-react"

import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export function LoginModal() {
  const { isModalOpen, modalType, closeModal, openModal } = useAuth()
  const [loading, setLoading] = React.useState(false)
  const supabase = createClient()

  // Form states
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [name, setName] = React.useState("")

  React.useEffect(() => {
    if (!isModalOpen) {
      setEmail("")
      setPassword("")
      setName("")
      setLoading(false)
    }
  }, [isModalOpen])

  if (!isModalOpen) return null

  const isLogin = modalType === "login"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        toast.success("Berhasil masuk!")
        closeModal()
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
          },
        })
        if (error) throw error
        toast.success("Registrasi berhasil! Silakan cek email Anda untuk verifikasi.")
        closeModal()
      }
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      toast.error(error.message || "Gagal masuk dengan Google")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={closeModal}
      />
      <div className="relative w-full max-w-md animate-fade-in overflow-hidden rounded-2xl bg-card shadow-2xl border border-border">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {isLogin ? "Selamat Datang Kembali" : "Buat Akun Baru"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {isLogin
                ? "Masuk untuk melanjutkan ke Jagat News."
                : "Daftar untuk mulai berdiskusi dan menyimpan berita."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? isLogin
                  ? "Memasukkan..."
                  : "Mendaftarkan..."
                : isLogin
                ? "Masuk"
                : "Daftar"}
            </Button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-border" />
            <span className="bg-card px-4 text-xs uppercase text-muted-foreground">
              Atau lanjutkan dengan
            </span>
            <div className="flex-1 border-t border-border" />
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
            Google
          </Button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
            <button
              onClick={() => openModal(isLogin ? "register" : "login")}
              className="font-semibold text-blue-600 transition-colors hover:text-blue-500"
            >
              {isLogin ? "Daftar Sekarang" : "Masuk"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
