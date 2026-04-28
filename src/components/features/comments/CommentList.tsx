"use client"

import * as React from "react"
import { Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/Button"
import { createClient } from "@/lib/supabase/client"
import { formatDate } from "@/lib/utils"
import type { Comment } from "@/types/news"

interface CommentListProps {
  comments: Comment[]
  fetchComments: () => void
}

export function CommentList({ comments, fetchComments }: CommentListProps) {
  const { user } = useAuth()
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editContent, setEditContent] = React.useState("")
  const [isUpdating, setIsUpdating] = React.useState(false)

  const supabase = createClient()

  const handleEditClick = (comment: Comment) => {
    setEditingId(comment.id)
    setEditContent(comment.content)
  }

  const handleUpdate = async (id: string) => {
    if (!editContent.trim()) return

    setIsUpdating(true)
    try {
      const { error } = await supabase
        .from("Comment")
        .update({ content: editContent })
        .eq("id", id)

      if (error) throw error

      setEditingId(null)
      fetchComments()
      toast.success("Komentar diperbarui")
    } catch (error: any) {
      toast.error("Gagal memperbarui komentar: " + error.message)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Hapus komentar ini?")) return

    try {
      const { error } = await supabase.from("Comment").delete().eq("id", id)
      if (error) throw error

      fetchComments()
      toast.success("Komentar dihapus")
    } catch (error: any) {
      toast.error("Gagal menghapus komentar: " + error.message)
    }
  }

  if (comments.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground italic">
          Belum ada komentar. Jadilah yang pertama berkomentar!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {comments.map((comment, index) => (
        <div
          key={comment.id}
          className="flex items-start space-x-4 animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <img
            src={comment.User?.avatar || "https://placehold.co/40x40"}
            alt={comment.User?.name || "User"}
            className="h-10 w-10 shrink-0 rounded-full object-cover shadow-sm ring-2 ring-background"
          />
          <div className="flex-1">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-bold text-card-foreground">
                  {comment.User?.name || "Pengguna"}
                </p>
                {user?.id === comment.userId && editingId !== comment.id && (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEditClick(comment)}
                      className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-blue-500"
                      aria-label="Edit comment"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Delete comment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {editingId === comment.id ? (
                <div className="mt-3 animate-fade-in">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full rounded-xl border border-border bg-input p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    rows={3}
                  />
                  <div className="mt-3 flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      onClick={() => setEditingId(null)}
                      disabled={isUpdating}
                    >
                      Batal
                    </Button>
                    <Button
                      onClick={() => handleUpdate(comment.id)}
                      disabled={isUpdating || !editContent.trim()}
                    >
                      {isUpdating ? "Menyimpan..." : "Simpan"}
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {comment.content}
                </p>
              )}
            </div>
            <p className="ml-2 mt-2 text-xs text-muted-foreground">
              {formatDate(comment.created_at)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
