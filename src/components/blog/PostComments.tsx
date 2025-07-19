'use client'

import { useState, useEffect } from 'react'
import { ChatBubbleLeftIcon, UserIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { supabase } from '@/lib/supabase'
import { Comment } from '@/types'

interface PostCommentsProps {
  postId: string
}

export function PostComments({ postId }: PostCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { user, profile } = useAuth()

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          author:profiles(
            full_name,
            avatar_url,
            github_username
          )
        `)
        .eq('post_id', postId)
        .is('parent_id', null) // Only top-level comments for now
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching comments:', error)
        return
      }

      setComments(data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !profile || !newComment.trim()) {
      return
    }

    try {
      setSubmitting(true)

      const { data, error } = await supabase
        .from('comments')
        .insert({
          content: newComment.trim(),
          post_id: postId,
          author_id: user.id
        })
        .select(`
          *,
          author:profiles(
            full_name,
            avatar_url,
            github_username
          )
        `)
        .single()

      if (error) {
        console.error('Error submitting comment:', error)
        return
      }

      setComments([...comments, data])
      setNewComment('')
    } catch (error) {
      console.error('Error submitting comment:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex space-x-3">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <ChatBubbleLeftIcon className="w-6 h-6 text-gray-500 dark:text-gray-400 mr-3" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      {user && profile ? (
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div className="flex space-x-3">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || 'Your avatar'}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newComment.trim() || submitting}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Sign in to join the conversation
          </p>
          <a
            href="/auth/signin"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            Sign In
          </a>
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              {comment.author?.avatar_url ? (
                <img
                  src={comment.author.avatar_url}
                  alt={comment.author.full_name || 'Commenter'}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
              )}
              
              <div className="flex-1">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {comment.author?.full_name || 'Anonymous'}
                    </h4>
                    <time
                      dateTime={comment.created_at}
                      className="text-xs text-gray-500 dark:text-gray-400"
                    >
                      {new Date(comment.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </time>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <ChatBubbleLeftIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      )}
    </div>
  )
}
