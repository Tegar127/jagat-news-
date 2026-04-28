import Link from "next/link"

import { Button } from "@/components/ui/Button"
import { createClient } from "@/lib/supabase/server"

export default async function AdminKategoriPage() {
  const supabase = await createClient()
  const { data: kategoriItems } = await supabase.from("Category").select("id, name, slug").order("name")

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Kelola Kategori</h1>
        <p className="mt-2 text-muted-foreground">Atur nama kategori dan deskripsinya.</p>
      </div>

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
              <Button asChild>
                <Link href={`/admin/kategori/${item.id}/edit`}>Edit</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
