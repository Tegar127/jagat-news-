"use client"

import * as React from "react"
import { Send } from "lucide-react"
import { toast } from "sonner"

import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/Button"
import { createClient } from "@/lib/supabase/client"

interface CommentFormProps {
  postId: string
  onCommentPosted: () => void
}

export function CommentForm({ postId, onCommentPosted }: CommentFormProps) {
  const { user } = useAuth()
  const [content, setContent] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !user) return

    setLoading(true)
    try {
      const { error } = await supabase.from("Comment").insert({
        content: content.trim(),
        postId: postId,
        userId: user.id,
      })

      if (error) throw error

      setContent("")
      onCommentPosted()
      toast.success("Komentar berhasil dikirim")
    } catch (error: any) {
      toast.error("Gagal mengirim komentar: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 animate-fade-in">
      <div className="flex items-start gap-4">
        <img
          src={user?.avatar || "https://placehold.co/40x40"}
          alt={user?.name || "User"}
          className="h-10 w-10 shrink-0 rounded-full object-cover shadow-sm"
        />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tulis komentar Anda..."
            className="w-full rounded-xl border border-border bg-input p-4 text-sm text-foreground shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
            rows={4}
            required
            disabled={loading}
          />
          <div className="mt-3 flex justify-end">
            <Button
              type="submit"
              disabled={loading || !content.trim()}
              className="rounded-full shadow-md"
            >
              {loading ? (
                <>
                  <span className="mr-2 animate-pulse">•</span>
                  Mengirim...
                </>
              ) : (
                <>
                  Kirim Komentar
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
