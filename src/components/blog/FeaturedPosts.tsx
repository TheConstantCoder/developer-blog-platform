'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CalendarIcon, ClockIcon, TagIcon } from '@heroicons/react/24/outline'
import { Post } from '@/types'
import { supabase } from '@/lib/supabase'

// Mock data for now - will be replaced with real Supabase data
const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Building Modern Web Applications with Next.js 14',
    slug: 'building-modern-web-apps-nextjs-14',
    excerpt: 'Explore the latest features in Next.js 14 including the App Router, Server Components, and improved performance optimizations.',
    content: '',
    published: true,
    featured: true,
    author_id: '1',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    published_at: '2024-01-15T10:00:00Z',
    meta_title: null,
    meta_description: null,
    cover_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
    reading_time: 8,
    view_count: 1250,
    tags: ['Next.js', 'React', 'Web Development']
  },
  {
    id: '2',
    title: 'Mastering TypeScript: Advanced Patterns and Best Practices',
    slug: 'mastering-typescript-advanced-patterns',
    excerpt: 'Deep dive into advanced TypeScript patterns, utility types, and best practices for building type-safe applications.',
    content: '',
    published: true,
    featured: true,
    author_id: '1',
    created_at: '2024-01-10T14:30:00Z',
    updated_at: '2024-01-10T14:30:00Z',
    published_at: '2024-01-10T14:30:00Z',
    meta_title: null,
    meta_description: null,
    cover_image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
    reading_time: 12,
    view_count: 890,
    tags: ['TypeScript', 'JavaScript', 'Programming']
  },
  {
    id: '3',
    title: 'Database Design with Supabase: From Schema to Production',
    slug: 'database-design-supabase-schema-production',
    excerpt: 'Learn how to design scalable database schemas with Supabase, including RLS policies, triggers, and real-time subscriptions.',
    content: '',
    published: true,
    featured: true,
    author_id: '1',
    created_at: '2024-01-05T09:15:00Z',
    updated_at: '2024-01-05T09:15:00Z',
    published_at: '2024-01-05T09:15:00Z',
    meta_title: null,
    meta_description: null,
    cover_image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop',
    reading_time: 15,
    view_count: 567,
    tags: ['Supabase', 'Database', 'PostgreSQL']
  }
]

export function FeaturedPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Try to fetch from Supabase first
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('published', true)
          .eq('featured', true)
          .order('published_at', { ascending: false })
          .limit(3)

        if (error) {
          console.log('Supabase not configured yet, using mock data')
          setPosts(mockPosts)
        } else {
          setPosts(data || mockPosts)
        }
      } catch (error) {
        console.log('Using mock data:', error)
        setPosts(mockPosts)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <article key={post.id} className="group">
          <Link href={`/blog/${post.slug}`} className="block">
            <div className="card hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
              {/* Cover Image */}
              {post.cover_image && (
                <div className="aspect-video mb-4 overflow-hidden rounded-lg">
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}

              {/* Content */}
              <div className="space-y-3">
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full bg-primary-50 dark:bg-primary-900/20 px-2 py-1 text-xs font-medium text-primary-700 dark:text-primary-300"
                      >
                        <TagIcon className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" />
                      {post.reading_time} min read
                    </div>
                  </div>
                  {post.view_count && (
                    <div className="text-xs">
                      {post.view_count.toLocaleString()} views
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  )
}