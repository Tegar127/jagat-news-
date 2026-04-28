import { NewsCard } from "./NewsCard"
import type { PostSummary } from "@/types/news"

interface NewsListProps {
  news: PostSummary[]
}

export function NewsList({ news }: NewsListProps) {
  if (news.length === 0) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30">
        <p className="text-lg text-muted-foreground">
          Belum ada berita yang dipublikasikan.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {news.map((item, index) => (
        <div
          key={item.id}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <NewsCard news={item} priority={index < 3} />
        </div>
      ))}
    </div>
  )
}
