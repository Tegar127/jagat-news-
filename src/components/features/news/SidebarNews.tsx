import Link from "next/link"
import Image from "next/image"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"
import { formatShortDate } from "@/lib/utils"
import type { PostSummary } from "@/types/news"

interface SidebarNewsProps {
  title: string
  news: PostSummary[]
  loading?: boolean
  showRanking?: boolean
}

export function SidebarNews({
  title,
  news,
  loading = false,
  showRanking = false,
}: SidebarNewsProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-16 w-24 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (news.length === 0) {
    return null
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="border-b border-border/50 pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          {showRanking && <span className="text-blue-500">🔥</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border/50">
          {news.map((item, index) => {
            const coverImage =
              item.images && item.images.length > 0
                ? item.images[0].url
                : "https://placehold.co/100x100?text=News"

            return (
              <li key={item.id} className="group relative transition-colors hover:bg-muted/50">
                <Link
                  href={`/berita/${item.id}`}
                  className="flex items-start gap-4 p-4"
                >
                  {showRanking && (
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/50 dark:text-blue-400">
                      {index + 1}
                    </span>
                  )}
                  
                  <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-md border border-border/50">
                    <Image
                      src={coverImage}
                      alt={item.title}
                      fill
                      sizes="80px"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  
                  <div className="flex flex-1 flex-col justify-center">
                    <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {item.title}
                    </h4>
                    <p className="mt-1.5 text-xs text-muted-foreground font-medium">
                      {formatShortDate(item.publishedAt)} • {item.viewCount}x dibaca
                    </p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
