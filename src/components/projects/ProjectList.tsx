'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Project } from '@/types'
import { supabase } from '@/lib/supabase'
import { ProjectCard } from './ProjectCard'
import { Pagination } from '@/components/ui/Pagination'
import { SortSelect } from '@/components/ui/SortSelect'

interface ProjectListProps {
  page: number
  search: string
  tech: string
  status: string
  sort: string
}

const PROJECTS_PER_PAGE = 6

const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Featured First', value: 'featured' },
  { label: 'Recently Updated', value: 'updated' },
]

const statusOptions = [
  { label: 'All Projects', value: '' },
  { label: 'Completed', value: 'completed' },
  { label: 'Active', value: 'active' },
  { label: 'Archived', value: 'archived' },
]

export function ProjectList({ page, search, tech, status, sort }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [totalProjects, setTotalProjects] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    fetchProjects()
  }, [page, search, tech, status, sort])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)

      // Build the query
      let query = supabase
        .from('projects')
        .select(`
          *,
          author:profiles(
            id,
            full_name,
            avatar_url
          ),
          project_tags(
            tags(
              id,
              name,
              slug,
              color
            )
          )
        `, { count: 'exact' })

      // Apply filters
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,content.ilike.%${search}%`)
      }

      if (status) {
        query = query.eq('status', status)
      }

      if (tech) {
        query = query.contains('tech_stack', [tech])
      }

      // Apply sorting
      switch (sort) {
        case 'oldest':
          query = query.order('created_at', { ascending: true })
          break
        case 'featured':
          query = query.order('featured', { ascending: false }).order('created_at', { ascending: false })
          break
        case 'updated':
          query = query.order('updated_at', { ascending: false })
          break
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false })
          break
      }

      // Apply pagination
      const from = (page - 1) * PROJECTS_PER_PAGE
      const to = from + PROJECTS_PER_PAGE - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) {
        throw error
      }

      // Transform the data to include tags
      const transformedProjects = data?.map((project: any) => ({
        ...project,
        tags: project.project_tags?.map((pt: any) => pt.tags) || []
      })) || []

      setProjects(transformedProjects)
      setTotalProjects(count || 0)
    } catch (error) {
      console.error('Error fetching projects:', error)
      setError('Failed to load projects. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', newSort)
    params.delete('page') // Reset to first page when sorting changes
    router.push(`/projects?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`/projects?${params.toString()}`)
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32" />
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
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
          onClick={fetchProjects}
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No projects found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {search || tech || status
            ? 'Try adjusting your search criteria or filters.'
            : 'No projects have been published yet.'}
        </p>
      </div>
    )
  }

  const totalPages = Math.ceil(totalProjects / PROJECTS_PER_PAGE)

  return (
    <div className="space-y-8">
      {/* Header with count and sort */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {search && (
            <span>Search results for "{search}" • </span>
          )}
          {tech && (
            <span>Tech: "{tech}" • </span>
          )}
          {status && (
            <span>Status: "{statusOptions.find(s => s.value === status)?.label}" • </span>
          )}
          Showing {projects.length} of {totalProjects} projects
        </div>
        
        <SortSelect
          options={sortOptions}
          value={sort}
          onChange={handleSortChange}
        />
      </div>

      {/* Projects Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}
