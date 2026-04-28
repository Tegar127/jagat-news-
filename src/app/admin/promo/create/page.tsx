import { AdminContentForm } from "@/components/features/admin/forms/AdminContentForm"

export default function CreatePromoPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Tambah Promo Banner</h1>
        <p className="mt-2 text-muted-foreground">Upload satu gambar promo untuk ditampilkan di beranda.</p>
      </div>
      <AdminContentForm
        entity="promo"
        mode="create"
        entityLabel="Promo"
        submitLabel="Simpan Promo"
        cancelHref="/admin/promo"
        initialData={{ title: "", content: "" }}
        initialImageUrls={[]}
      />
    </section>
  )
}
