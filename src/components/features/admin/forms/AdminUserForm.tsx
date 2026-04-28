"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { createClient } from "@/lib/supabase/client"

type UserRole = "USER" | "ADMIN" | "ADMINISTRATOR"

interface AdminUserFormProps {
  mode: "create" | "edit"
  userId?: string
  cancelHref: string
  initialData?: {
    name: string
    email: string
    role: UserRole
  }
}

export function AdminUserForm({ mode, userId, cancelHref, initialData }: AdminUserFormProps) {
  const supabase = React.useMemo(() => createClient(), [])
  const router = useRouter()
  const [name, setName] = React.useState(initialData?.name ?? "")
  const [email, setEmail] = React.useState(initialData?.email ?? "")
  const [role, setRole] = React.useState<UserRole>(initialData?.role ?? "USER")
  const [isSaving, setIsSaving] = React.useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)

    try {
      const query =
        mode === "create"
          ? supabase.from("User").insert({ name, email, role })
          : supabase.from("User").update({ name, email, role }).eq("id", userId ?? "")

      const { error } = await query
      if (error) throw error

      toast.success(`Pengguna berhasil ${mode === "create" ? "ditambahkan" : "diperbarui"}`)
      router.push(cancelHref)
      router.refresh()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Gagal menyimpan pengguna"
      toast.error(message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">Nama Pengguna</label>
        <Input value={name} onChange={(event) => setName(event.target.value)} required />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">Email</label>
        <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">Role</label>
        <select
          value={role}
          onChange={(event) => setRole(event.target.value as UserRole)}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
          <option value="ADMINISTRATOR">ADMINISTRATOR</option>
        </select>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push(cancelHref)} disabled={isSaving}>
          Batal
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Menyimpan..." : mode === "create" ? "Tambah Pengguna" : "Perbarui Pengguna"}
        </Button>
      </div>
    </form>
  )
}
