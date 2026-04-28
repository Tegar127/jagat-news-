import { AdminUserForm } from "@/components/features/admin/forms/AdminUserForm"

export default function CreateUserPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Tambah Pengguna</h1>
        <p className="mt-2 text-muted-foreground">
          Tambah data profil pengguna di tabel aplikasi (tidak membuat akun auth baru).
        </p>
      </div>
      <AdminUserForm mode="create" cancelHref="/admin/users" />
    </section>
  )
}
