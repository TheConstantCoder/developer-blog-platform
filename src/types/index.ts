// Database types
export interface Database {
  public: {
    Tables: {
      posts: {
        Row: Post
        Insert: Omit<Post, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Post, 'id' | 'created_at'>>
      }
      projects: {
        Row: Project
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Project, 'id' | 'created_at'>>
      }
      comments: {
        Row: Comment
        Insert: Omit<Comment, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Comment, 'id' | 'created_at'>>
      }
      tags: {
        Row: Tag
        Insert: Omit<Tag, 'id' | 'created_at'>
        Update: Partial<Omit<Tag, 'id' | 'created_at'>>
      }
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
    }
  }
}

// Core entity types
export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  featured_image?: string
  published: boolean
  published_at?: string
  author_id: string
  created_at: string
  updated_at: string
  view_count: number
  tags?: Tag[]
  author?: Profile
  comments?: Comment[]
  reading_time?: number
  seo_title?: string
  seo_description?: string
}

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  content?: string
  featured_image?: string
  demo_url?: string
  github_url?: string
  tech_stack: string[]
  status: 'planning' | 'in-progress' | 'completed' | 'archived'
  featured: boolean
  author_id: string
  created_at: string
  updated_at: string
  tags?: Tag[]
  author?: Profile
}

export interface Comment {
  id: string
  content: string
  post_id: string
  author_id: string
  parent_id?: string
  created_at: string
  updated_at: string
  author?: Profile
  replies?: Comment[]
}

export interface Tag {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  created_at: string
  post_count?: number
}

export interface Profile {
  id: string
  email: string
  full_name?: string
  username?: string
  avatar_url?: string
  bio?: string
  website?: string
  github_username?: string
  twitter_username?: string
  linkedin_url?: string
  role: 'admin' | 'author' | 'user'
  created_at: string
  updated_at: string
}

// API response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Form types
export interface PostFormData {
  title: string
  content: string
  excerpt?: string
  featured_image?: string
  published: boolean
  tags: string[]
  seo_title?: string
  seo_description?: string
}

export interface ProjectFormData {
  title: string
  description: string
  content?: string
  featured_image?: string
  demo_url?: string
  github_url?: string
  tech_stack: string[]
  status: Project['status']
  featured: boolean
  tags: string[]
}

export interface CommentFormData {
  content: string
  post_id: string
  parent_id?: string
}

export interface ProfileFormData {
  full_name?: string
  username?: string
  bio?: string
  website?: string
  github_username?: string
  twitter_username?: string
  linkedin_url?: string
}

// UI component types
export interface NavItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  external?: boolean
}

export interface SocialLink {
  platform: string
  url: string
  icon: React.ComponentType<{ className?: string }>
}

// Search and filter types
export interface SearchFilters {
  query?: string
  tags?: string[]
  author?: string
  published?: boolean
  dateFrom?: string
  dateTo?: string
}

export interface SortOption {
  label: string
  value: string
  direction: 'asc' | 'desc'
}

// Analytics types
export interface PostAnalytics {
  post_id: string
  views: number
  unique_views: number
  comments_count: number
  shares: number
  reading_time: number
  bounce_rate: number
}

export interface SiteAnalytics {
  total_posts: number
  total_projects: number
  total_views: number
  total_comments: number
  popular_posts: Post[]
  recent_activity: ActivityItem[]
}

export interface ActivityItem {
  id: string
  type: 'post_published' | 'comment_added' | 'project_updated'
  title: string
  description: string
  timestamp: string
  user?: Profile
}

// Newsletter types
export interface NewsletterSubscriber {
  id: string
  email: string
  subscribed: boolean
  created_at: string
  confirmed_at?: string
}

// SEO types
export interface SEOData {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
}