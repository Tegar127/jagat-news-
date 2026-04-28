import { createClient } from "@/lib/supabase/server"
import { NewsList } from "@/components/features/news/NewsList"
import { Newspaper } from "lucide-react"

export const revalidate = 60 // Revalidate every 60 seconds

export const metadata = {
  title: "Semua Berita",
  description: "Kumpulan berita terbaru dan terpopuler dari berbagai kategori di Jagat News.",
}

export default async function BeritaPage(props: {
  searchParams: Promise<{ kategori?: string }>
}) {
  const searchParams = await props.searchParams
  const categoryFilter = searchParams.kategori
  
  const supabase = await createClient()

  let query = supabase
    .from("Post")
    .select("*, category:Category!inner(name, slug), images:Image(url), author:User(name)")
    .eq("status", "PUBLISHED")
    .order("publishedAt", { ascending: false })

  if (categoryFilter) {
    // Note: Assuming 'name' is used for category filtering based on old code, 
    // ideally it should be 'slug'. Using ilike for case-insensitive match if needed.
    query = query.ilike("category.name", `%${categoryFilter}%`)
  }

  const { data: allNews, error } = await query

  // If error or category not found, allNews might be null.
  const news = allNews || []

  return (
    <div className="bg-background">
      <div className="border-b border-border bg-gradient-to-b from-muted/50 to-background px-6 pb-20 pt-24 text-center md:pb-28 md:pt-32">
        <div className="container mx-auto">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            <Newspaper className="h-5 w-5" />
            Pusat Berita
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            {categoryFilter ? `Berita: ${categoryFilter}` : "Kumpulan Berita"}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Jelajahi berita terbaru dan terpopuler dari berbagai kategori yang
            kami sediakan khusus untuk Anda.
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-16 lg:py-24">
        <NewsList news={news} />
      </main>
    </div>
  )
}
