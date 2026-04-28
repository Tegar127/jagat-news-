import { AdminContentForm } from "@/components/features/admin/forms/AdminContentForm"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

interface EditPromoPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPromoPage({ params }: EditPromoPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: promo } = await supabase
    .from("Promo")
    .select("id, title, imageUrl")
    .eq("id", id)
    .single()

  if (!promo) {
    notFound()
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Promo Banner</h1>
        <p className="mt-2 text-muted-foreground">ID promo: {id}</p>
      </div>
      <AdminContentForm
        entity="promo"
        mode="edit"
        recordId={promo.id}
        entityLabel="Promo"
        submitLabel="Perbarui Promo"
        cancelHref="/admin/promo"
        initialData={{
          title: promo.title ?? "",
          content: "",
        }}
        initialImageUrls={promo.imageUrl ? [promo.imageUrl] : []}
      />
    </section>
  )
}
