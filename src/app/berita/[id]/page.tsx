import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, User, MessageSquare } from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { stripHtml, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/Badge"
import { CommentForm } from "@/components/features/comments/CommentForm"
import { CommentList } from "@/components/features/comments/CommentList"

// Revalidate every 60 seconds
export const revalidate = 60

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const supabase = await createClient()
  const { data: news } = await supabase
    .from("Post")
    .select("title, content, images:Image(url)")
    .eq("id", params.id)
    .single()

  if (!news) return { title: "Berita Tidak Ditemukan" }

  const description = stripHtml(news.content).substring(0, 160)
  const imageUrl = news.images?.[0]?.url || ""

  return {
    title: news.title,
    description: description,
    openGraph: {
      title: news.title,
      description: description,
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

// Separate component for comments section to handle client-side interactivity if needed
function CommentsSection({ postId, comments }: { postId: string, comments: any[] }) {
  // We can pass initial comments, but since CommentList fetches them on the client
  // We'll let CommentList handle it. Wait, the old code fetched comments on the client.
  // Actually, Server Components can fetch initial comments and pass them down,
  // but to keep it simple and match the old React implementation's interactivity,
  // we'll just render a wrapper. 
  // Oh wait, `CommentList` needs to fetch. I need to update `CommentList` to handle its own fetch or pass it here.
  return null;
}

export default async function BeritaDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const supabase = await createClient()

  // Increment view count (fire and forget, though we should ideally use an API route, 
  // doing it in Server Component might trigger on every render which is fine for simple apps,
  // but better to use the edge function or API route. The old code used supabase.functions.invoke)
  supabase.functions.invoke("increment-view-count", {
    body: { postId: params.id },
  }).catch(console.error)

  const { data: news, error } = await supabase
    .from("Post")
    .select("*, author:User(name), category:Category(name), images:Image(id, url)")
    .eq("id", params.id)
    .single()

  if (error || !news) {
    notFound()
  }

  // Fetch comments initially on server
  const { data: initialComments } = await supabase
    .from("Comment")
    .select("*, User(name, avatar)")
    .eq("postId", params.id)
    .order("created_at", { ascending: false })

  const canCopyClass = news.canBeCopied ? "" : "select-none"

  return (
    <div className={`min-h-screen bg-background pb-16 pt-8 ${canCopyClass}`}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-8">
          <Link
            href="/berita"
            className="group inline-flex items-center text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Kembali ke Daftar Berita
          </Link>
        </div>

        <article className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
            {/* Image Gallery / Hero Image */}
            <div className="relative aspect-video w-full bg-muted">
              {news.images && news.images.length > 0 ? (
                <Image
                  src={news.images[0].url}
                  alt={news.title}
                  fill
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="text-muted-foreground">Tidak ada gambar</span>
                </div>
              )}
            </div>

            <div className="p-8 md:p-12">
              <Badge className="mb-4">
                {news.category?.name || "Tanpa Kategori"}
              </Badge>
              
              <h1 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight text-card-foreground md:text-4xl lg:text-5xl">
                {news.title}
              </h1>

              <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-4 border-y border-border py-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="mr-2 h-4 w-4" />
                  <span className="font-medium text-foreground">
                    {news.author?.name || "Admin"}
                  </span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  <time dateTime={news.publishedAt}>
                    {formatDate(news.publishedAt, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </div>

              <div
                className="article-content"
                dangerouslySetInnerHTML={{
                  __html: news.content?.replace(/\n/g, "<br />") || "Konten tidak tersedia.",
                }}
              />
            </div>
          </div>
        </article>

        {/* Client-side comments section wrapper. We need a specific component for this. */}
        <div className="mx-auto mt-12 max-w-4xl">
           <div className="rounded-2xl border border-border bg-card p-8 shadow-lg md:p-10">
              <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold text-card-foreground">
                <MessageSquare className="text-blue-600 dark:text-blue-400" />
                Komentar
              </h2>
              {/* Note: I'll use a wrapper component here to hold state, but for now let's just 
                  use a Client Component that fetches its own data to be fully identical to old logic. 
                  Wait, I need a wrapper component that uses `CommentForm` and `CommentList` together 
                  and manages the `fetchComments` state. Let's create `CommentsSection.tsx`. */}
              <CommentsSectionClient postId={params.id} />
           </div>
        </div>
      </div>
    </div>
  )
}

// For simplicity, I'll inline the Client Component for the comments section here
// In a real large app, this would be in its own file.
import { CommentsSectionClient } from "@/components/features/comments/CommentsSectionClient"
