import { createClient } from "@/lib/supabase/server"
import { PromoBanner } from "@/components/features/promo/PromoBanner"
import { CategorySection } from "@/components/features/news/CategorySection"
import { NewsList } from "@/components/features/news/NewsList"
import { SidebarNews } from "@/components/features/news/SidebarNews"
import Link from "next/link"

export const revalidate = 60 // Revalidate every 60 seconds

export default async function HomePage() {
  const supabase = await createClient()

  // Parallel data fetching for performance
  const [promoRes, latestRes, popularRes] = await Promise.all([
    supabase.from("Promo").select("*").eq("isActive", true),
    supabase
      .from("Post")
      .select("*, category:Category(name), images:Image(url), author:User(name)")
      .eq("status", "PUBLISHED")
      .order("publishedAt", { ascending: false })
      .limit(6),
    supabase
      .from("Post")
      .select("*, category:Category(name), images:Image(url), author:User(name)")
      .eq("status", "PUBLISHED")
      .order("viewCount", { ascending: false })
      .limit(5),
  ])

  const promos = promoRes.data || []
  const latestNews = latestRes.data || []
  const popularNews = popularRes.data || []

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 pt-4 lg:pt-8">
        <PromoBanner promos={promos} />
      </div>

      <CategorySection />

      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Berita Terbaru */}
            <div className="lg:col-span-2">
              <div className="mb-8 flex items-end justify-between border-b border-border/50 pb-4">
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                  Berita Terbaru
                </h2>
                <Link
                  href="/berita"
                  className="hidden text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 md:block"
                >
                  Lihat Semua &rarr;
                </Link>
              </div>

              <NewsList news={latestNews} />

              <div className="mt-8 md:hidden">
                <Link
                  href="/berita"
                  className="block w-full rounded-xl bg-muted p-4 text-center font-semibold text-foreground transition-colors hover:bg-muted/80"
                >
                  Lihat Semua Berita
                </Link>
              </div>
            </div>

            {/* Sidebar Berita Populer */}
            <aside className="space-y-8">
              <SidebarNews
                title="Berita Terpopuler"
                news={popularNews}
                showRanking={true}
              />
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
