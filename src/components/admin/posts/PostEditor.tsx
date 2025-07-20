'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  DocumentIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  TagIcon
} from '@heroicons/react/24/outline'

interface Tag {
  id: string
  name: string
  slug: string
  color: string
}

interface PostEditorProps {
  postId?: string
}

export function PostEditor({ postId }: PostEditorProps) {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchTags()
    if (postId) {
      fetchPost()
    }
  }, [postId])

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !postId) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setSlug(generatedSlug)
    }
  }, [title, postId])

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name')

      if (error) {
        console.error('Error fetching tags:', error)
        return
      }

      setAvailableTags(data || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const fetchPost = async () => {
    if (!postId) return

    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          post_tags(tag_id)
        `)
        .eq('id', postId)
        .single()

      if (error) {
        console.error('Error fetching post:', error)
        return
      }

      setTitle(data.title)
      setSlug(data.slug)
      setExcerpt(data.excerpt || '')
      setContent(data.content || '')
      setStatus(data.status)
      setSelectedTags(data.post_tags?.map((pt: any) => pt.tag_id) || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const savePost = async (publishNow = false) => {
    if (!title.trim()) {
      alert('Please enter a title')
      return
    }

    try {
      setSaving(true)
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('You must be logged in to save posts')
        return
      }

      const postData = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        status: publishNow ? 'published' : status,
        author_id: user.id,
        published_at: publishNow ? new Date().toISOString() : null,
        reading_time: Math.ceil(content.split(' ').length / 200) // Rough estimate
      }

      let savedPost
      
      if (postId) {
        // Update existing post
        const { data, error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', postId)
          .select()
          .single()

        if (error) {
          console.error('Error updating post:', error)
          alert('Error updating post')
          return
        }
        
        savedPost = data
      } else {
        // Create new post
        const { data, error } = await supabase
          .from('posts')
          .insert(postData)
          .select()
          .single()

        if (error) {
          console.error('Error creating post:', error)
          alert('Error creating post')
          return
        }
        
        savedPost = data
      }

      // Update tags
      if (savedPost) {
        // Remove existing tags
        await supabase
          .from('post_tags')
          .delete()
          .eq('post_id', savedPost.id)

        // Add new tags
        if (selectedTags.length > 0) {
          const tagInserts = selectedTags.map(tagId => ({
            post_id: savedPost.id,
            tag_id: tagId
          }))

          await supabase
            .from('post_tags')
            .insert(tagInserts)
        }
      }

      if (publishNow) {
        alert('Post published successfully!')
      } else {
        alert('Post saved successfully!')
      }

      // Redirect to posts list
      router.push('/admin/posts')
      
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Error saving post')
    } finally {
      setSaving(false)
    }
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Editor Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setPreviewMode(false)}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                !previewMode
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <DocumentIcon className="w-4 h-4 inline mr-2" />
              Edit
            </button>
            <button
              onClick={() => setPreviewMode(true)}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                previewMode
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <EyeIcon className="w-4 h-4 inline mr-2" />
              Preview
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
              className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            
            <button
              onClick={() => savePost(false)}
              disabled={saving}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors duration-200"
            >
              <ClockIcon className="w-4 h-4 inline mr-2" />
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            
            <button
              onClick={() => savePost(true)}
              disabled={saving}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
            >
              <CheckCircleIcon className="w-4 h-4 inline mr-2" />
              {saving ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-3 space-y-6">
          {!previewMode ? (
            <>
              {/* Title */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                <input
                  type="text"
                  placeholder="Enter post title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              {/* Slug */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL Slug
                </label>
                <input
                  type="text"
                  placeholder="post-url-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Excerpt */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Excerpt
                </label>
                <textarea
                  placeholder="Brief description of the post..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Content */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content (Markdown)
                </label>
                <textarea
                  placeholder="Write your post content in Markdown..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={20}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                />
              </div>
            </>
          ) : (
            /* Preview Mode */
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {title || 'Untitled Post'}
              </h1>
              {excerpt && (
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  {excerpt}
                </p>
              )}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap">{content}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tags */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              <TagIcon className="w-5 h-5 inline mr-2" />
              Tags
            </h3>
            <div className="space-y-2">
              {availableTags.map((tag) => (
                <label key={tag.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag.id)}
                    onChange={() => toggleTag(tag.id)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {tag.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Post Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Post Info
            </h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div>Words: {content.split(' ').filter(word => word.length > 0).length}</div>
              <div>Reading time: ~{Math.ceil(content.split(' ').length / 200)} min</div>
              <div>Characters: {content.length}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
