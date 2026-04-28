import Link from "next/link"
import { revalidatePath } from "next/cache"
import { FileText, ImageIcon, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { createClient } from "@/lib/supabase/server"

async function deleteBerita(formData: FormData) {
  "use server"

  const id = String(formData.get("id") ?? "")
  if (!id) return

  const supabase = await createClient()
  await supabase.from("Post").delete().eq("id", id)
  revalidatePath("/admin/berita")
}

export default async function AdminBeritaPage() {
  const supabase = await createClient()
  const { data: beritaItems } = await supabase
    .from("Post")
    .select("id, title, status, images:Image(id)")
    .order("createdAt", { ascending: false })
    .limit(20)

  const totalBerita = (beritaItems ?? []).length
  const draftCount = (beritaItems ?? []).filter((item) => item.status === "DRAFT").length

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Kelola Berita</h1>
          <p className="mt-2 text-muted-foreground">Kelola konten berita dan gambar slide untuk setiap artikel.</p>
        </div>
        <Button asChild className="w-full md:w-auto">
          <Link href="/admin/berita/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Berita
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Berita</p>
          <div className="mt-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <p className="text-2xl font-bold text-foreground">{totalBerita}</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Status Draft</p>
          <div className="mt-2 flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-amber-500" />
            <p className="text-2xl font-bold text-foreground">{draftCount}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          {(beritaItems ?? []).map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/30 md:flex-row md:items-center"
            >
              <div>
                <p className="font-semibold text-foreground">{item.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      item.status === "PUBLISHED"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.images?.length ?? 0} gambar</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button asChild>
                  <Link href={`/admin/berita/${item.id}/edit`}>Edit</Link>
                </Button>
                <form action={deleteBerita}>
                  <input type="hidden" name="id" value={item.id} />
                  <Button type="submit" variant="destructive">
                    Hapus
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
