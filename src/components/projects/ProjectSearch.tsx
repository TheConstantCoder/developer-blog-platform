'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface ProjectSearchProps {
  initialQuery?: string
}

export function ProjectSearch({ initialQuery = '' }: ProjectSearchProps) {
  const [query, setQuery] = useState(initialQuery)
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  const handleSearch = (searchQuery: string) => {
    setIsSearching(true)
    
    const params = new URLSearchParams(searchParams.toString())
    
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim())
    } else {
      params.delete('search')
    }
    
    // Reset to first page when searching
    params.delete('page')
    
    const queryString = params.toString()
    const url = queryString ? `/projects?${queryString}` : '/projects'
    
    router.push(url)
    
    // Reset searching state after a short delay
    setTimeout(() => setIsSearching(false), 500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  const handleClear = () => {
    setQuery('')
    handleSearch('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon 
            className={`h-5 w-5 transition-colors ${
              isSearching 
                ? 'text-blue-500 animate-pulse' 
                : 'text-gray-400 dark:text-gray-500'
            }`} 
          />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search projects..."
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors"
          disabled={isSearching}
        />
        
        {query && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              disabled={isSearching}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
      
      {/* Search suggestions or recent searches could go here */}
      {query.length > 0 && (
        <div className="mt-2">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Press Enter to search or Escape to clear
          </div>
        </div>
      )}
    </form>
  )
}
