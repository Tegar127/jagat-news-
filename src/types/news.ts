export interface Category {
  id: string
  name: string
  slug?: string
}

export interface Image {
  id: string
  url: string
}

export interface Author {
  id: string
  name: string
  avatar?: string | null
}

export interface Post {
  id: string
  title: string
  content: string
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
  publishedAt: string
  createdAt: string
  viewCount: number
  canBeCopied: boolean
  category: Category | null
  author: Author | null
  images: Image[]
}

export interface Comment {
  id: string
  content: string
  postId: string
  userId: string
  created_at: string
  User?: {
    name: string
    avatar?: string | null
  }
}

export interface PostSummary {
  id: string
  title: string
  content: string
  publishedAt: string
  viewCount: number
  category: Category | null
  author: Author | null
  images: Image[]
}
