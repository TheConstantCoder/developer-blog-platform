'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CalendarIcon, ClockIcon, TagIcon } from '@heroicons/react/24/outline'
import { Post } from '@/types'
import { supabase } from '@/lib/supabase'

export function FeaturedPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            author:profiles(full_name, avatar_url),
            post_tags(
              tags(name, slug, color)
            )
          `)
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(3)

        if (error) {
          console.error('Error fetching featured posts:', error)
          setPosts([])
        } else {
          // Transform the data to include tags
          const transformedPosts = data?.map(post => ({
            ...post,
            tags: post.post_tags?.map((pt: any) => pt.tags) || []
          })) || []
          setPosts(transformedPosts)
        }
      } catch (error) {
        console.error('Error fetching featured posts:', error)
        setPosts([])
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
              {post.featured_image_url && (
                <div className="aspect-video mb-4 overflow-hidden rounded-lg">
                  <img
                    src={post.featured_image_url}
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
                        key={tag.id || tag.slug}
                        className="inline-flex items-center gap-1 rounded-full bg-primary-50 dark:bg-primary-900/20 px-2 py-1 text-xs font-medium text-primary-700 dark:text-primary-300"
                      >
                        <TagIcon className="h-3 w-3" />
                        {tag.name}
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