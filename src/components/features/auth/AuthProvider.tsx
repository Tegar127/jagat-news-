"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase/client"
import type { UserProfile, AuthModalType } from "@/types/auth"
import type { User } from "@supabase/supabase-js"
import { toast } from "sonner"

interface AuthContextType {
  user: (User & UserProfile) | null
  loading: boolean
  isAuthenticated: boolean
  isModalOpen: boolean
  modalType: AuthModalType
  openModal: (type?: AuthModalType) => void
  closeModal: () => void
  logout: () => Promise<void>
  updateUser: (data: Partial<UserProfile>) => void
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<(User & UserProfile) | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [modalType, setModalType] = React.useState<AuthModalType>("login")

  const supabase = createClient()

  React.useEffect(() => {
    let mounted = true

    const handleSession = async (session: any) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from("User")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (mounted) {
          setUser({
            ...session.user,
            ...(profile || { role: "USER" }),
          })
        }
      } else {
        if (mounted) setUser(null)
      }
      if (mounted) setLoading(false)
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session)
    })

    // Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  const openModal = (type: AuthModalType = "login") => {
    setModalType(type)
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error("Gagal keluar: " + error.message)
    } else {
      toast.success("Berhasil keluar")
    }
  }

  const updateUser = (data: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null))
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isModalOpen,
    modalType,
    openModal,
    closeModal,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
