import Link from "next/link"

import { Button } from "@/components/ui/Button"
import { createClient } from "@/lib/supabase/server"

export default async function AdminPromoPage() {
  const supabase = await createClient()
  const { data: promoItems } = await supabase
    .from("Promo")
    .select("id, title, isActive")
    .order("id", { ascending: false })
    .limit(20)

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Kelola Promo Banner</h1>
        <p className="mt-2 text-muted-foreground">Kelola teks promosi banner dengan rich text editor.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          {(promoItems ?? []).map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between gap-3 rounded-lg border border-border p-4 md:flex-row md:items-center"
            >
              <div>
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">Status: {item.isActive ? "Aktif" : "Nonaktif"}</p>
              </div>
              <Button asChild>
                <Link href={`/admin/promo/${item.id}/edit`}>Edit</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
