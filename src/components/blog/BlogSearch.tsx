'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useDebounce } from '@/hooks/useDebounce'

interface BlogSearchProps {
  initialQuery?: string
}

export function BlogSearch({ initialQuery = '' }: BlogSearchProps) {
  const [query, setQuery] = useState(initialQuery)
  const debouncedQuery = useDebounce(query, 300)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (debouncedQuery !== initialQuery) {
      const params = new URLSearchParams(searchParams.toString())
      
      if (debouncedQuery.trim()) {
        params.set('search', debouncedQuery.trim())
      } else {
        params.delete('search')
      }
      
      // Reset to first page when search changes
      params.delete('page')
      
      router.push(`/blog?${params.toString()}`)
    }
  }, [debouncedQuery, initialQuery, router, searchParams])

  const handleClear = () => {
    setQuery('')
  }

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts..."
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>
      
      {/* Search suggestions or recent searches could go here */}
      {query.length > 0 && query.length < 3 && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Type at least 3 characters to search
          </p>
        </div>
      )}
    </div>
  )
}
