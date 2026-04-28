import { AdminContentForm } from "@/components/features/admin/forms/AdminContentForm"

export default function CreateKategoriPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Tambah Kategori</h1>
        <p className="mt-2 text-muted-foreground">Buat kategori baru untuk pengelompokan berita.</p>
      </div>
      <AdminContentForm
        entity="kategori"
        mode="create"
        entityLabel="Kategori"
        submitLabel="Simpan Kategori"
        cancelHref="/admin/kategori"
        initialData={{ title: "", content: "" }}
      />
    </section>
  )
}
