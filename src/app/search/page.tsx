import { createClient } from "@/lib/supabase/server"
import { NewsList } from "@/components/features/news/NewsList"
import { Search } from "lucide-react"

export const metadata = {
  title: "Hasil Pencarian",
}

export default async function SearchResultsPage(props: {
  searchParams: Promise<{ q?: string }>
}) {
  const searchParams = await props.searchParams
  const query = searchParams.q || ""
  
  const supabase = await createClient()

  let news: any[] = []

  if (query) {
    const { data } = await supabase
      .from("Post")
      .select("*, category:Category(name), images:Image(url), author:User(name)")
      .eq("status", "PUBLISHED")
      .ilike("title", `%${query}%`)
      .order("publishedAt", { ascending: false })
      
    news = data || []
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="border-b border-border bg-gradient-to-b from-muted/50 to-background px-6 pb-12 pt-16 text-center">
        <div className="container mx-auto">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            <Search className="h-4 w-4" />
            Pencarian
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            Hasil Pencarian untuk: &quot;{query}&quot;
          </h1>
          <p className="mt-4 text-muted-foreground">
            Ditemukan {news.length} berita yang cocok dengan kata kunci Anda.
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        {query ? (
          <NewsList news={news} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h2 className="text-xl font-semibold text-foreground">
              Masukkan kata kunci
            </h2>
            <p className="mt-2 text-muted-foreground">
              Silakan gunakan kotak pencarian di navigasi untuk mencari berita.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
