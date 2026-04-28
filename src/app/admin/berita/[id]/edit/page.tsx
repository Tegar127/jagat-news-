import { AdminContentForm } from "@/components/features/admin/forms/AdminContentForm"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

interface EditBeritaPageProps {
  params: Promise<{ id: string }>
}

export default async function EditBeritaPage({ params }: EditBeritaPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: berita } = await supabase.from("Post").select("id, title, content").eq("id", id).single()

  if (!berita) {
    notFound()
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Berita</h1>
        <p className="mt-2 text-muted-foreground">ID berita: {id}</p>
      </div>
      <AdminContentForm
        entity="berita"
        mode="edit"
        recordId={berita.id}
        entityLabel="Berita"
        submitLabel="Perbarui Berita"
        cancelHref="/admin/berita"
        initialData={{
          title: berita.title ?? "",
          content: berita.content ?? "",
        }}
      />
    </section>
  )
}
