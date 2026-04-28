import { AdminContentForm } from "@/components/features/admin/forms/AdminContentForm"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

interface EditKategoriPageProps {
  params: Promise<{ id: string }>
}

export default async function EditKategoriPage({ params }: EditKategoriPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: kategori } = await supabase.from("Category").select("id, name, slug").eq("id", id).single()

  if (!kategori) {
    notFound()
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Kategori</h1>
        <p className="mt-2 text-muted-foreground">Slug kategori: {id}</p>
      </div>
      <AdminContentForm
        entity="kategori"
        mode="edit"
        recordId={kategori.id}
        entityLabel="Kategori"
        submitLabel="Perbarui Kategori"
        cancelHref="/admin/kategori"
        initialData={{
          title: kategori.name ?? "",
          content: `<p>Slug kategori: ${kategori.slug ?? "-"}</p>`,
        }}
      />
    </section>
  )
}
