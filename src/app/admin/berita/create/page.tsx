import { AdminContentForm } from "@/components/features/admin/forms/AdminContentForm"

export default function CreateBeritaPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Tambah Berita</h1>
        <p className="mt-2 text-muted-foreground">Buat berita baru dengan editor konten.</p>
      </div>
      <AdminContentForm
        entity="berita"
        mode="create"
        entityLabel="Berita"
        submitLabel="Simpan Berita"
        cancelHref="/admin/berita"
        initialData={{ title: "", content: "" }}
      />
    </section>
  )
}
