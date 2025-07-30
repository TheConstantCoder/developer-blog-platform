'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabase'

interface ProjectFiltersProps {
  selectedTech?: string
  selectedStatus?: string
}

interface TechStackItem {
  name: string
  count: number
}

const statusOptions = [
  { label: 'All Projects', value: '' },
  { label: 'Completed', value: 'completed' },
  { label: 'Active', value: 'active' },
  { label: 'Archived', value: 'archived' },
]

export function ProjectFilters({ selectedTech = '', selectedStatus = '' }: ProjectFiltersProps) {
  const [techStack, setTechStack] = useState<TechStackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAllTech, setShowAllTech] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    fetchTechStack()
  }, [])

  const fetchTechStack = async () => {
    try {
      setLoading(true)
      
      // Get all projects with their tech stacks
      const { data: projects, error } = await supabase
        .from('projects')
        .select('tech_stack')

      if (error) throw error

      // Count occurrences of each technology
      const techCounts: { [key: string]: number } = {}
      
      projects?.forEach(project => {
        if (project.tech_stack && Array.isArray(project.tech_stack)) {
          project.tech_stack.forEach(tech => {
            techCounts[tech] = (techCounts[tech] || 0) + 1
          })
        }
      })

      // Convert to array and sort by count
      const techArray = Object.entries(techCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)

      setTechStack(techArray)
    } catch (error) {
      console.error('Error fetching tech stack:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTechFilter = (tech: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (tech && tech !== selectedTech) {
      params.set('tech', tech)
    } else {
      params.delete('tech')
    }
    
    // Reset to first page when filtering
    params.delete('page')
    
    const queryString = params.toString()
    const url = queryString ? `/projects?${queryString}` : '/projects'
    router.push(url)
  }

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (status) {
      params.set('status', status)
    } else {
      params.delete('status')
    }
    
    // Reset to first page when filtering
    params.delete('page')
    
    const queryString = params.toString()
    const url = queryString ? `/projects?${queryString}` : '/projects'
    router.push(url)
  }

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('tech')
    params.delete('status')
    params.delete('page')
    
    const queryString = params.toString()
    const url = queryString ? `/projects?${queryString}` : '/projects'
    router.push(url)
  }

  const hasActiveFilters = selectedTech || selectedStatus

  const displayedTechStack = showAllTech ? techStack : techStack.slice(0, 8)

  return (
    <div className="space-y-6">
      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Active Filters
          </span>
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Status Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Project Status
        </h3>
        <div className="space-y-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusFilter(option.value)}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                selectedStatus === option.value
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Technology Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Technologies
        </h3>
        
        {loading ? (
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {displayedTechStack.map((tech) => (
                <button
                  key={tech.name}
                  onClick={() => handleTechFilter(tech.name)}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedTech === tech.name
                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <span>{tech.name}</span>
                  <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">
                    {tech.count}
                  </span>
                </button>
              ))}
            </div>
            
            {techStack.length > 8 && (
              <button
                onClick={() => setShowAllTech(!showAllTech)}
                className="flex items-center justify-center w-full mt-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <span>{showAllTech ? 'Show Less' : `Show ${techStack.length - 8} More`}</span>
                <ChevronDownIcon 
                  className={`ml-1 h-4 w-4 transition-transform ${showAllTech ? 'rotate-180' : ''}`} 
                />
              </button>
            )}
          </>
        )}
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Applied Filters
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedTech && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                Tech: {selectedTech}
                <button
                  onClick={() => handleTechFilter('')}
                  className="ml-2 hover:text-blue-900 dark:hover:text-blue-100"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedStatus && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                Status: {statusOptions.find(s => s.value === selectedStatus)?.label}
                <button
                  onClick={() => handleStatusFilter('')}
                  className="ml-2 hover:text-green-900 dark:hover:text-green-100"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
