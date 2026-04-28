import { AdminContentForm } from "@/components/features/admin/forms/AdminContentForm"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

interface EditUserPageProps {
  params: Promise<{ id: string }>
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: user } = await supabase.from("User").select("id, name, role, email").eq("id", id).single()

  if (!user) {
    notFound()
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Pengguna</h1>
        <p className="mt-2 text-muted-foreground">ID pengguna: {id}</p>
      </div>
      <AdminContentForm
        entity="users"
        recordId={user.id}
        entityLabel="Pengguna"
        submitLabel="Perbarui Pengguna"
        cancelHref="/admin/users"
        initialData={{
          title: user.name ?? "",
          content: `<p>Role: ${user.role ?? "-"}<br/>Email: ${user.email ?? "-"}</p>`,
        }}
      />
    </section>
  )
}
