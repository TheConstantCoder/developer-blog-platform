'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  status: 'draft' | 'published' | 'archived'
  published_at: string | null
  created_at: string
  updated_at: string
  view_count: number
  reading_time: number | null
  author: {
    full_name: string
    email: string
  }
  post_tags: Array<{
    tags: {
      name: string
      color: string
    }
  }>
}

export function AdminPostsList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all')
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchPosts()
  }, [filter])

  const fetchPosts = async () => {
    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          author:profiles(full_name, email),
          post_tags(
            tags(name, color)
          )
        `)
        .order('updated_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching posts:', error)
        return
      }

      setPosts(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const updatePostStatus = async (postId: string, newStatus: 'draft' | 'published' | 'archived') => {
    try {
      const updateData: any = { status: newStatus }
      
      // Set published_at when publishing
      if (newStatus === 'published') {
        updateData.published_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', postId)

      if (error) {
        console.error('Error updating post status:', error)
        return
      }

      // Refresh the posts list
      fetchPosts()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const deletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

      if (error) {
        console.error('Error deleting post:', error)
        return
      }

      // Refresh the posts list
      fetchPosts()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Published
          </span>
        )
      case 'draft':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <ClockIcon className="w-3 h-3 mr-1" />
            Draft
          </span>
        )
      case 'archived':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
            <XCircleIcon className="w-3 h-3 mr-1" />
            Archived
          </span>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Blog Posts
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'} total
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Posts</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
              <option value="archived">Archived</option>
            </select>
            
            {/* Create Post Button */}
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              New Post
            </Link>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {posts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <PlusIcon className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No posts found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating your first blog post.
            </p>
            <div className="mt-6">
              <Link
                href="/admin/posts/new"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Post
              </Link>
            </div>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                      {post.title}
                    </h3>
                    {getStatusBadge(post.status)}
                  </div>
                  
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>By {post.author?.full_name || 'Unknown'}</span>
                    <span>•</span>
                    <span>{new Date(post.updated_at).toLocaleDateString()}</span>
                    {post.reading_time && (
                      <>
                        <span>•</span>
                        <span>{post.reading_time} min read</span>
                      </>
                    )}
                    <span>•</span>
                    <span>{post.view_count} views</span>
                  </div>
                  
                  {/* Tags */}
                  {post.post_tags && post.post_tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {post.post_tags.slice(0, 3).map((postTag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        >
                          {postTag.tags?.name}
                        </span>
                      ))}
                      {post.post_tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{post.post_tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  {/* View Post */}
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                    title="View Post"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </Link>
                  
                  {/* Edit Post */}
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    title="Edit Post"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Link>
                  
                  {/* Status Actions */}
                  {post.status === 'draft' && (
                    <button
                      onClick={() => updatePostStatus(post.id, 'published')}
                      className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                      title="Publish Post"
                    >
                      <CheckCircleIcon className="w-4 h-4" />
                    </button>
                  )}
                  
                  {post.status === 'published' && (
                    <button
                      onClick={() => updatePostStatus(post.id, 'draft')}
                      className="p-2 text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-200"
                      title="Unpublish Post"
                    >
                      <ClockIcon className="w-4 h-4" />
                    </button>
                  )}
                  
                  {/* Delete Post */}
                  <button
                    onClick={() => deletePost(post.id)}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                    title="Delete Post"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
