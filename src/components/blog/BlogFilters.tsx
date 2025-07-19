'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { TagIcon } from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabase'
import { Tag } from '@/types'

interface BlogFiltersProps {
  selectedTag?: string
}

export function BlogFilters({ selectedTag = '' }: BlogFiltersProps) {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select(`
          *,
          post_tags(count)
        `)
        .order('name')

      if (error) {
        console.error('Error fetching tags:', error)
        return
      }

      // Transform data to include post count
      const tagsWithCount = data?.map(tag => ({
        ...tag,
        post_count: tag.post_tags?.length || 0
      })) || []

      // Filter out tags with no posts
      const activeTags = tagsWithCount.filter(tag => tag.post_count > 0)
      
      setTags(activeTags)
    } catch (error) {
      console.error('Error fetching tags:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTagClick = (tagSlug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (tagSlug === selectedTag) {
      // Remove tag filter if clicking the same tag
      params.delete('tag')
    } else {
      // Set new tag filter
      params.set('tag', tagSlug)
    }
    
    // Reset to first page when filter changes
    params.delete('page')
    
    router.push(`/blog?${params.toString()}`)
  }

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('tag')
    params.delete('page')
    router.push(`/blog?${params.toString()}`)
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
        ))}
      </div>
    )
  }

  if (tags.length === 0) {
    return (
      <div className="text-center py-4">
        <TagIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No tags available
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Clear filters button */}
      {selectedTag && (
        <button
          onClick={handleClearFilters}
          className="w-full text-left px-3 py-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
        >
          ← Clear filters
        </button>
      )}

      {/* Tags list */}
      <div className="space-y-1">
        {tags.map((tag) => {
          const isSelected = tag.slug === selectedTag
          
          return (
            <button
              key={tag.id}
              onClick={() => handleTagClick(tag.slug)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                isSelected
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                    style={{ backgroundColor: tag.color || '#6b7280' }}
                  />
                  <span className="truncate">{tag.name}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isSelected
                    ? 'bg-primary-200 dark:bg-primary-800 text-primary-800 dark:text-primary-200'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                }`}>
                  {tag.post_count}
                </span>
              </div>
              {tag.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                  {tag.description}
                </p>
              )}
            </button>
          )
        })}
      </div>

      {/* Show all tags link if there are many */}
      {tags.length > 10 && (
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full text-left px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
            View all tags →
          </button>
        </div>
      )}
    </div>
  )
}
