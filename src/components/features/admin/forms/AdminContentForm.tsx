"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { createClient } from "@/lib/supabase/client"

const RichTextEditor = dynamic(
  () => import("@/components/features/admin/editor/RichTextEditor").then((mod) => mod.RichTextEditor),
  {
    ssr: false,
    loading: () => <div className="h-64 animate-pulse rounded-md bg-muted" />,
  }
)

interface AdminContentFormProps {
  entity: "berita" | "kategori" | "promo" | "users"
  mode: "create" | "edit"
  recordId?: string
  entityLabel: string
  submitLabel: string
  cancelHref: string
  initialData?: {
    title: string
    content: string
  }
}

export function AdminContentForm({
  entity,
  mode,
  recordId,
  entityLabel,
  submitLabel,
  cancelHref,
  initialData,
}: AdminContentFormProps) {
  const supabase = React.useMemo(() => createClient(), [])
  const router = useRouter()
  const [title, setTitle] = React.useState(initialData?.title ?? "")
  const [content, setContent] = React.useState(initialData?.content ?? "")
  const [isSaving, setIsSaving] = React.useState(false)

  const htmlToText = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)

    try {
      if (entity === "berita") {
        const query =
          mode === "create"
            ? supabase.from("Post").insert({ title, content, status: "DRAFT" })
            : supabase.from("Post").update({ title, content }).eq("id", recordId ?? "")
        const { error } = await query
        if (error) throw error
      }

      if (entity === "kategori") {
        const query =
          mode === "create"
            ? supabase.from("Category").insert({ name: title, slug: slugify(title) })
            : supabase
                .from("Category")
                .update({ name: title, slug: slugify(title) })
                .eq("id", recordId ?? "")
        const { error } = await query
        if (error) throw error
      }

      if (entity === "promo") {
        const query =
          mode === "create"
            ? supabase.from("Promo").insert({
                title,
                subtitle: htmlToText(content),
                isActive: true,
              })
            : supabase
                .from("Promo")
                .update({ title, subtitle: htmlToText(content) })
                .eq("id", recordId ?? "")
        const { error } = await query
        if (error) throw error
      }

      if (entity === "users") {
        const query =
          mode === "create"
            ? supabase.from("User").insert({ name: title, email: content, role: "USER" })
            : supabase.from("User").update({ name: title }).eq("id", recordId ?? "")
        const { error } = await query
        if (error) throw error
      }

      toast.success(`${entityLabel} berhasil diperbarui`)
      router.push(cancelHref)
      router.refresh()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan data"
      toast.error(message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">Judul {entityLabel}</label>
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={`Masukkan judul ${entityLabel.toLowerCase()}`}
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">Konten {entityLabel}</label>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push(cancelHref)} disabled={isSaving}>
          Batal
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Menyimpan..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
