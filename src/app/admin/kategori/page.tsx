import Link from "next/link"
import { revalidatePath } from "next/cache"

import { Button } from "@/components/ui/Button"
import { createClient } from "@/lib/supabase/server"

async function deleteKategori(formData: FormData) {
  "use server"

  const id = String(formData.get("id") ?? "")
  if (!id) return

  const supabase = await createClient()
  await supabase.from("Category").delete().eq("id", id)
  revalidatePath("/admin/kategori")
}

export default async function AdminKategoriPage() {
  const supabase = await createClient()
  const { data: kategoriItems } = await supabase.from("Category").select("id, name, slug").order("name")

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Kelola Kategori</h1>
        <p className="mt-2 text-muted-foreground">Atur nama kategori dan deskripsinya.</p>
      </div>
      <Button asChild>
        <Link href="/admin/kategori/create">Tambah Kategori</Link>
      </Button>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          {(kategoriItems ?? []).map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between gap-3 rounded-lg border border-border p-4 md:flex-row md:items-center"
            >
              <div>
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="text-sm text-muted-foreground">Slug: {item.slug ?? "-"}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button asChild>
                  <Link href={`/admin/kategori/${item.id}/edit`}>Edit</Link>
                </Button>
                <form action={deleteKategori}>
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
