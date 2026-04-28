export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string | null
  role: 'USER' | 'ADMIN' | 'ADMINISTRATOR'
  createdAt?: string
}

export type AuthModalType = 'login' | 'register'
