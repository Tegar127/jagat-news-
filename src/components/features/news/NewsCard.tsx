import Link from "next/link"
import Image from "next/image"
import { Calendar } from "lucide-react"

import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { stripHtml, formatDate } from "@/lib/utils"
import type { PostSummary } from "@/types/news"

interface NewsCardProps {
  news: PostSummary
  priority?: boolean // For LCP optimization of first image
}

export function NewsCard({ news, priority = false }: NewsCardProps) {
  const coverImage =
    news.images && news.images.length > 0
      ? news.images[0].url
      : "https://placehold.co/600x400?text=Jagat+News"

  const textContent = stripHtml(news.content)

  return (
    <Card className="group flex h-full flex-col overflow-hidden border-border/50 bg-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/10">
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={coverImage}
          alt={`Cover: ${news.title}`}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {news.category && (
          <Badge
            className="absolute right-3 top-3 z-10 shadow-sm"
            variant="default"
          >
            {news.category.name}
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          {news.author?.name || "Redaksi"}
        </p>
        <Link href={`/berita/${news.id}`} className="block">
          <h3 className="mb-3 line-clamp-2 text-xl font-bold leading-tight text-card-foreground transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {news.title}
          </h3>
        </Link>
        <p className="mb-4 line-clamp-3 flex-1 text-sm text-muted-foreground leading-relaxed">
          {textContent || "Konten tidak tersedia."}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <time dateTime={news.publishedAt}>
              {formatDate(news.publishedAt, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </time>
          </div>
          <Link
            href={`/berita/${news.id}`}
            className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Baca &rarr;
          </Link>
        </div>
      </div>
    </Card>
  )
}
