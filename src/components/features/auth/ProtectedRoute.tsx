"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/")
      } else if (requireAdmin && user?.role !== "ADMIN" && user?.role !== "ADMINISTRATOR") {
        router.push("/")
      }
    }
  }, [loading, isAuthenticated, user, router, requireAdmin])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated || (requireAdmin && user?.role !== "ADMIN" && user?.role !== "ADMINISTRATOR")) {
    return null
  }

  return <>{children}</>
}
