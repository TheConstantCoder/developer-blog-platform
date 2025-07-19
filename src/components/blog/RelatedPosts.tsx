'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline'
import { Post } from '@/types'
import { supabase } from '@/lib/supabase'

interface RelatedPostsProps {
  currentPostId: string
  tags: string[]
  limit?: number
}

export function RelatedPosts({ currentPostId, tags, limit = 3 }: RelatedPostsProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRelatedPosts()
  }, [currentPostId, tags])

  const fetchRelatedPosts = async () => {
    try {
      setLoading(true)

      if (tags.length === 0) {
        // If no tags, get recent posts
        const { data, error } = await supabase
          .from('posts')
          .select(`
            id,
            title,
            slug,
            excerpt,
            featured_image_url,
            published_at,
            reading_time,
            view_count
          `)
          .eq('status', 'published')
          .neq('id', currentPostId)
          .order('published_at', { ascending: false })
          .limit(limit)

        if (error) {
          console.error('Error fetching recent posts:', error)
          return
        }

        setPosts(data || [])
        return
      }

      // Get posts with similar tags
      const { data: relatedPostIds, error: tagsError } = await supabase
        .from('post_tags')
        .select('post_id')
        .in('tag_id', tags)
        .neq('post_id', currentPostId)

      if (tagsError) {
        console.error('Error fetching related post IDs:', tagsError)
        return
      }

      if (!relatedPostIds || relatedPostIds.length === 0) {
        // No related posts found, get recent posts instead
        const { data, error } = await supabase
          .from('posts')
          .select(`
            id,
            title,
            slug,
            excerpt,
            featured_image_url,
            published_at,
            reading_time,
            view_count
          `)
          .eq('status', 'published')
          .neq('id', currentPostId)
          .order('published_at', { ascending: false })
          .limit(limit)

        if (error) {
          console.error('Error fetching recent posts:', error)
          return
        }

        setPosts(data || [])
        return
      }

      // Get the actual posts
      const postIds = relatedPostIds.map(rp => rp.post_id)
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          slug,
          excerpt,
          featured_image_url,
          published_at,
          reading_time,
          view_count
        `)
        .eq('status', 'published')
        .in('id', postIds)
        .order('published_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching related posts:', error)
        return
      }

      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching related posts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
          </div>
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Related Posts
      </h3>
      
      <div className="space-y-4">
        {posts.map((post) => (
          <article key={post.id} className="group">
            <Link href={`/blog/${post.slug}`} className="block">
              <div className="flex space-x-3">
                {/* Thumbnail */}
                {post.featured_image_url && (
                  <div className="flex-shrink-0">
                    <img
                      src={post.featured_image_url}
                      alt={post.title}
                      className="w-16 h-16 rounded-lg object-cover group-hover:opacity-80 transition-opacity duration-200"
                    />
                  </div>
                )}
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 line-clamp-2">
                    {post.title}
                  </h4>
                  
                  {post.excerpt && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      <time dateTime={post.published_at}>
                        {new Date(post.published_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </time>
                    </div>
                    
                    {post.reading_time && (
                      <div className="flex items-center">
                        <ClockIcon className="w-3 h-3 mr-1" />
                        <span>{post.reading_time} min</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/blog"
          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
        >
          View all posts →
        </Link>
      </div>
    </div>
  )
}
