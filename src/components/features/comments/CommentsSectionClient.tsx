"use client"

import * as React from "react"
import { useAuth } from "@/hooks/useAuth"
import { CommentForm } from "./CommentForm"
import { CommentList } from "./CommentList"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/Button"
import type { Comment } from "@/types/news"

export function CommentsSectionClient({ postId }: { postId: string }) {
  const { isAuthenticated, openModal } = useAuth()
  const [comments, setComments] = React.useState<Comment[]>([])
  const supabase = createClient()

  const fetchComments = React.useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("Comment")
        .select("*, User(name, avatar)")
        .eq("postId", postId)
        .order("created_at", { ascending: false })

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error("Gagal mengambil komentar:", error)
    }
  }, [postId, supabase])

  React.useEffect(() => {
    fetchComments()
  }, [fetchComments])

  return (
    <div>
      {isAuthenticated ? (
        <CommentForm postId={postId} onCommentPosted={fetchComments} />
      ) : (
        <div className="mb-8 rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center transition-colors hover:border-blue-300">
          <p className="mb-4 text-muted-foreground">
            Anda harus masuk untuk meninggalkan komentar.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => openModal("login")}>
              Masuk
            </Button>
            <Button onClick={() => openModal("register")}>Daftar</Button>
          </div>
        </div>
      )}

      <hr className="my-8 border-border" />

      <CommentList comments={comments} fetchComments={fetchComments} />
    </div>
  )
}
