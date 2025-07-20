'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  StarIcon,
  CodeBracketIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

interface Project {
  id: string
  title: string
  slug: string
  description: string
  status: 'active' | 'completed' | 'archived'
  featured: boolean
  demo_url: string | null
  github_url: string | null
  created_at: string
  updated_at: string
  view_count: number
  author: {
    full_name: string
    email: string
  }
  project_technologies: Array<{
    technologies: {
      name: string
      color: string
    }
  }>
}

export function AdminProjectsList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'archived'>('all')
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchProjects()
  }, [filter])

  const fetchProjects = async () => {
    try {
      let query = supabase
        .from('projects')
        .select(`
          *,
          author:profiles(full_name, email),
          project_technologies(
            technologies(name, color)
          )
        `)
        .order('updated_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching projects:', error)
        return
      }

      setProjects(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProjectStatus = async (projectId: string, newStatus: 'active' | 'completed' | 'archived') => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', projectId)

      if (error) {
        console.error('Error updating project status:', error)
        return
      }

      fetchProjects()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const toggleFeatured = async (projectId: string, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ featured: !currentFeatured })
        .eq('id', projectId)

      if (error) {
        console.error('Error updating featured status:', error)
        return
      }

      fetchProjects()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const deleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)

      if (error) {
        console.error('Error deleting project:', error)
        return
      }

      fetchProjects()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
            Active
          </span>
        )
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-1"></div>
            Completed
          </span>
        )
      case 'archived':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
            <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
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
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
              Projects
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {projects.length} {projects.length === 1 ? 'project' : 'projects'} total
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Projects</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
            
            {/* Create Project Button */}
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              New Project
            </Link>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {projects.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <CodeBracketIcon className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No projects found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating your first project.
            </p>
            <div className="mt-6">
              <Link
                href="/admin/projects/new"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Project
              </Link>
            </div>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                      {project.title}
                    </h3>
                    {getStatusBadge(project.status)}
                    {project.featured && (
                      <StarIcon className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                  
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>By {project.author?.full_name || 'Unknown'}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      {new Date(project.updated_at).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span className="flex items-center">
                      <EyeIcon className="w-3 h-3 mr-1" />
                      {project.view_count} views
                    </span>
                  </div>
                  
                  {/* Technologies */}
                  {project.project_technologies && project.project_technologies.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {project.project_technologies.slice(0, 4).map((projectTech, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          {projectTech.technologies?.name}
                        </span>
                      ))}
                      {project.project_technologies.length > 4 && (
                        <span className="text-xs text-gray-500">
                          +{project.project_technologies.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Links */}
                  <div className="mt-2 flex items-center space-x-4">
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Live Demo →
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        GitHub →
                      </a>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  {/* View Project */}
                  <Link
                    href={`/projects/${project.slug}`}
                    target="_blank"
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                    title="View Project"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </Link>
                  
                  {/* Edit Project */}
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    title="Edit Project"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Link>
                  
                  {/* Toggle Featured */}
                  <button
                    onClick={() => toggleFeatured(project.id, project.featured)}
                    className={`p-2 transition-colors duration-200 ${
                      project.featured
                        ? 'text-yellow-500 hover:text-yellow-600'
                        : 'text-gray-400 hover:text-yellow-500'
                    }`}
                    title={project.featured ? 'Remove from Featured' : 'Add to Featured'}
                  >
                    <StarIcon className="w-4 h-4" />
                  </button>
                  
                  {/* Delete Project */}
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                    title="Delete Project"
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
