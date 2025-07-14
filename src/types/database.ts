// Database types generated from Supabase schema
// This file contains TypeScript types for all database tables and relationships

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Custom enum types
export type UserRole = 'user' | 'admin' | 'moderator'
export type PostStatus = 'draft' | 'published' | 'archived'
export type ProjectStatus = 'active' | 'completed' | 'archived'

// Database table types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          role: UserRole
          github_username: string | null
          website_url: string | null
          location: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: UserRole
          github_username?: string | null
          website_url?: string | null
          location?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: UserRole
          github_username?: string | null
          website_url?: string | null
          location?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          author_id: string
          title: string
          slug: string
          excerpt: string | null
          content: string
          featured_image_url: string | null
          status: PostStatus
          published_at: string | null
          meta_title: string | null
          meta_description: string | null
          reading_time: number | null
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          author_id: string
          title: string
          slug: string
          excerpt?: string | null
          content: string
          featured_image_url?: string | null
          status?: PostStatus
          published_at?: string | null
          meta_title?: string | null
          meta_description?: string | null
          reading_time?: number | null
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          author_id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string
          featured_image_url?: string | null
          status?: PostStatus
          published_at?: string | null
          meta_title?: string | null
          meta_description?: string | null
          reading_time?: number | null
          view_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          author_id: string
          title: string
          slug: string
          description: string | null
          content: string | null
          featured_image_url: string | null
          demo_url: string | null
          github_url: string | null
          tech_stack: string[] | null
          status: ProjectStatus
          featured: boolean
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          author_id: string
          title: string
          slug: string
          description?: string | null
          content?: string | null
          featured_image_url?: string | null
          demo_url?: string | null
          github_url?: string | null
          tech_stack?: string[] | null
          status?: ProjectStatus
          featured?: boolean
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          author_id?: string
          title?: string
          slug?: string
          description?: string | null
          content?: string | null
          featured_image_url?: string | null
          demo_url?: string | null
          github_url?: string | null
          tech_stack?: string[] | null
          status?: ProjectStatus
          featured?: boolean
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          color?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          color?: string
          created_at?: string
        }
      }
      post_tags: {
        Row: {
          id: string
          post_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          tag_id?: string
          created_at?: string
        }
      }
      project_tags: {
        Row: {
          id: string
          project_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          tag_id?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          author_id: string
          parent_id: string | null
          content: string
          is_approved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          author_id: string
          parent_id?: string | null
          content: string
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          author_id?: string
          parent_id?: string | null
          content?: string
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          is_active: boolean
          subscribed_at: string
          unsubscribed_at: string | null
          confirmation_token: string | null
          is_confirmed: boolean
        }
        Insert: {
          id?: string
          email: string
          is_active?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
          confirmation_token?: string | null
          is_confirmed?: boolean
        }
        Update: {
          id?: string
          email?: string
          is_active?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
          confirmation_token?: string | null
          is_confirmed?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_slug: {
        Args: {
          title: string
        }
        Returns: string
      }
      calculate_reading_time: {
        Args: {
          content: string
        }
        Returns: number
      }
      increment_post_view_count: {
        Args: {
          post_id: string
        }
        Returns: undefined
      }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      is_moderator_or_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: UserRole
      post_status: PostStatus
      project_status: ProjectStatus
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for common operations
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific table types for easier use
export type Profile = Tables<'profiles'>
export type Post = Tables<'posts'>
export type Project = Tables<'projects'>
export type Tag = Tables<'tags'>
export type PostTag = Tables<'post_tags'>
export type ProjectTag = Tables<'project_tags'>
export type Comment = Tables<'comments'>
export type NewsletterSubscriber = Tables<'newsletter_subscribers'>

// Insert types
export type ProfileInsert = TablesInsert<'profiles'>
export type PostInsert = TablesInsert<'posts'>
export type ProjectInsert = TablesInsert<'projects'>
export type TagInsert = TablesInsert<'tags'>
export type CommentInsert = TablesInsert<'comments'>

// Update types
export type ProfileUpdate = TablesUpdate<'profiles'>
export type PostUpdate = TablesUpdate<'posts'>
export type ProjectUpdate = TablesUpdate<'projects'>
export type TagUpdate = TablesUpdate<'tags'>
export type CommentUpdate = TablesUpdate<'comments'>

// Extended types with relationships
export type PostWithAuthor = Post & {
  profiles: Pick<Profile, 'id' | 'full_name' | 'avatar_url' | 'github_username'>
}

export type PostWithTags = Post & {
  post_tags: Array<{
    tags: Tag
  }>
}

export type PostWithAuthorAndTags = PostWithAuthor & PostWithTags

export type ProjectWithAuthor = Project & {
  profiles: Pick<Profile, 'id' | 'full_name' | 'avatar_url' | 'github_username'>
}

export type ProjectWithTags = Project & {
  project_tags: Array<{
    tags: Tag
  }>
}

export type ProjectWithAuthorAndTags = ProjectWithAuthor & ProjectWithTags

export type CommentWithAuthor = Comment & {
  profiles: Pick<Profile, 'id' | 'full_name' | 'avatar_url'>
}

export type CommentWithReplies = CommentWithAuthor & {
  replies?: CommentWithAuthor[]
}

// API response types
export type ApiResponse<T> = {
  data: T | null
  error: string | null
  success: boolean
}

export type PaginatedResponse<T> = ApiResponse<T[]> & {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
