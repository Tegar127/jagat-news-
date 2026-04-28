"use client"

import * as React from "react"
import { useAuth } from "@/hooks/useAuth"
import { ProtectedRoute } from "@/components/features/auth/ProtectedRoute"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { UserCircle, Camera, Save } from "lucide-react"

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const supabase = createClient()
  
  const [name, setName] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (user) {
      setName(user.name || "")
    }
  }, [user])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from("User")
        .update({ name })
        .eq("id", user.id)

      if (error) throw error

      updateUser({ name })
      toast.success("Profil berhasil diperbarui")
    } catch (error: any) {
      toast.error("Gagal memperbarui profil: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="bg-background min-h-screen py-12 lg:py-20">
        <div className="container mx-auto max-w-2xl px-4">
          <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32"></div>
            
            <div className="px-8 pb-8">
              <div className="relative -mt-16 mb-6 flex justify-center">
                <div className="relative h-32 w-32 rounded-full border-4 border-card bg-muted">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle className="h-full w-full text-muted-foreground p-2" />
                  )}
                  <button className="absolute bottom-0 right-0 rounded-full bg-blue-600 p-2 text-white shadow-lg transition-transform hover:scale-105">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-foreground">{user?.name}</h1>
                <p className="text-muted-foreground">{user?.email}</p>
                <div className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  {user?.role}
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6 border-t border-border pt-8">
                <h2 className="text-lg font-semibold text-foreground">Edit Profil</h2>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Nama Lengkap
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-muted opacity-50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email tidak dapat diubah saat ini.
                  </p>
                </div>

                <Button type="submit" disabled={loading} className="w-full sm:w-auto flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
