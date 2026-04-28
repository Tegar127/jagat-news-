import Link from "next/link"

import { Button } from "@/components/ui/Button"
import { createClient } from "@/lib/supabase/server"

export default async function AdminBeritaPage() {
  const supabase = await createClient()
  const { data: beritaItems } = await supabase
    .from("Post")
    .select("id, title, status")
    .order("createdAt", { ascending: false })
    .limit(20)

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Kelola Berita</h1>
        <p className="mt-2 text-muted-foreground">Pilih berita untuk diedit dengan editor konten.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          {(beritaItems ?? []).map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between gap-3 rounded-lg border border-border p-4 md:flex-row md:items-center"
            >
              <div>
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">Status: {item.status}</p>
              </div>
              <Button asChild>
                <Link href={`/admin/berita/${item.id}/edit`}>Edit</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
