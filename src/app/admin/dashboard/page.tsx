"use client"

import * as React from "react"
import { Users, FileText, Eye, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { createClient } from "@/lib/supabase/client"

export default function DashboardPage() {
  const [stats, setStats] = React.useState({
    totalUsers: 0,
    totalPosts: 0,
    totalViews: 0,
    totalComments: 0,
  })
  const [loading, setLoading] = React.useState(true)
  const supabase = createClient()

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, postsRes, commentsRes] = await Promise.all([
          supabase.from("User").select("id", { count: "exact" }),
          supabase.from("Post").select("id, viewCount"),
          supabase.from("Comment").select("id", { count: "exact" }),
        ])

        const totalViews = postsRes.data?.reduce((sum, post) => sum + (post.viewCount || 0), 0) || 0

        setStats({
          totalUsers: usersRes.count || 0,
          totalPosts: postsRes.data?.length || 0,
          totalViews,
          totalComments: commentsRes.count || 0,
        })
      } catch (error) {
        console.error("Failed to fetch stats", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [supabase])

  const statCards = [
    { title: "Total Pengguna", value: stats.totalUsers, icon: Users, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { title: "Total Berita", value: stats.totalPosts, icon: FileText, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
    { title: "Total Views", value: stats.totalViews, icon: Eye, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
    { title: "Komentar", value: stats.totalComments, icon: MessageSquare, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30" },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Ringkasan statistik dan aktivitas terbaru di Jagat News.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i} className="border-border/50 shadow-sm transition-all hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`rounded-2xl p-4 ${stat.bg} ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  {loading ? (
                    <div className="mt-1 h-8 w-16 animate-pulse rounded bg-muted" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground">{stat.value.toLocaleString()}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Aktivitas Terkini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-[300px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/30">
              <p className="text-sm text-muted-foreground">Grafik aktivitas akan ditampilkan di sini</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Berita Terpopuler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-[300px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/30">
              <p className="text-sm text-muted-foreground">Daftar berita terpopuler akan ditampilkan di sini</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
