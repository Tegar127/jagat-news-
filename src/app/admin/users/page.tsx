import Link from "next/link"
import { revalidatePath } from "next/cache"

import { Button } from "@/components/ui/Button"
import { createClient } from "@/lib/supabase/server"

async function deleteUser(formData: FormData) {
  "use server"

  const id = String(formData.get("id") ?? "")
  if (!id) return

  const supabase = await createClient()
  await supabase.from("User").delete().eq("id", id)
  revalidatePath("/admin/users")
}

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: userItems } = await supabase.from("User").select("id, name, role").order("createdAt", { ascending: false }).limit(20)

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Kelola Pengguna</h1>
        <p className="mt-2 text-muted-foreground">Pilih pengguna untuk mengubah data profil atau catatan internal.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          {(userItems ?? []).map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between gap-3 rounded-lg border border-border p-4 md:flex-row md:items-center"
            >
              <div>
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="text-sm text-muted-foreground">Role: {item.role}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button asChild>
                  <Link href={`/admin/users/${item.id}/edit`}>Edit</Link>
                </Button>
                <form action={deleteUser}>
                  <input type="hidden" name="id" value={item.id} />
                  <Button type="submit" variant="destructive">
                    Hapus
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
