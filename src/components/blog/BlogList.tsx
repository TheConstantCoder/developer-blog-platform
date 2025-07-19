'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { CalendarIcon, ClockIcon, EyeIcon } from '@heroicons/react/24/outline'
import { Post } from '@/types'
import { supabase } from '@/lib/supabase'
import { PostCard } from './PostCard'
import { Pagination } from '@/components/ui/Pagination'
import { SortSelect } from '@/components/ui/SortSelect'

interface BlogListProps {
  page: number
  search: string
  tag: string
  sort: string
}

const POSTS_PER_PAGE = 6

const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Most Comments', value: 'comments' },
]

export function BlogList({ page, search, tag, sort }: BlogListProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPosts, setTotalPosts] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    fetchPosts()
  }, [page, search, tag, sort])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('posts')
        .select(`
          *,
          author:profiles(
            full_name,
            avatar_url,
            github_username
          ),
          post_tags(
            tags(
              id,
              name,
              slug,
              color
            )
          )
        `, { count: 'exact' })
        .eq('status', 'published')

      // Apply search filter
      if (search) {
        query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`)
      }

      // Apply tag filter
      if (tag) {
        // This requires a more complex query with joins
        const { data: taggedPosts } = await supabase
          .from('post_tags')
          .select('post_id')
          .eq('tags.slug', tag)

        if (taggedPosts && taggedPosts.length > 0) {
          const postIds = taggedPosts.map(tp => tp.post_id)
          query = query.in('id', postIds)
        } else {
          // No posts with this tag
          setPosts([])
          setTotalPosts(0)
          setLoading(false)
          return
        }
      }

      // Apply sorting
      switch (sort) {
        case 'oldest':
          query = query.order('published_at', { ascending: true })
          break
        case 'popular':
          query = query.order('view_count', { ascending: false })
          break
        case 'comments':
          // This would require a more complex query with comment counts
          query = query.order('created_at', { ascending: false })
          break
        case 'newest':
        default:
          query = query.order('published_at', { ascending: false })
          break
      }

      // Apply pagination
      const from = (page - 1) * POSTS_PER_PAGE
      const to = from + POSTS_PER_PAGE - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) {
        throw error
      }

      // Transform the data to include tags
      const transformedPosts = data?.map(post => ({
        ...post,
        tags: post.post_tags?.map((pt: any) => pt.tags) || []
      })) || []

      setPosts(transformedPosts)
      setTotalPosts(count || 0)
    } catch (error) {
      console.error('Error fetching posts:', error)
      setError('Failed to load blog posts. Please try again.')
      setPosts([])
      setTotalPosts(0)
    } finally {
      setLoading(false)
    }
  }

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', newSort)
    params.delete('page') // Reset to first page when sorting changes
    router.push(`/blog?${params.toString()}`)
  }

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 animate-pulse" />
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 dark:text-red-400 mb-4">
          {error}
        </div>
        <button
          onClick={fetchPosts}
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No posts found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {search || tag 
            ? 'Try adjusting your search or filter criteria.'
            : 'No blog posts have been published yet.'
          }
        </p>
        {(search || tag) && (
          <Link
            href="/blog"
            className="btn btn-primary"
          >
            View All Posts
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header with count and sort */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {search && (
            <span>Search results for "{search}" • </span>
          )}
          {tag && (
            <span>Tagged with "{tag}" • </span>
          )}
          Showing {posts.length} of {totalPosts} posts
        </div>
        
        <SortSelect
          options={sortOptions}
          value={sort}
          onChange={handleSortChange}
        />
      </div>

      {/* Posts Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/blog"
            searchParams={searchParams}
          />
        </div>
      )}
    </div>
  )
}
