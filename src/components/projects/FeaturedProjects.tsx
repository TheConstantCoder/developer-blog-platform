'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  CodeBracketIcon, 
  ArrowTopRightOnSquareIcon, 
  StarIcon,
  EyeIcon 
} from '@heroicons/react/24/outline'
import { Project } from '@/types'
import { supabase } from '@/lib/supabase'

// Mock data for now - will be replaced with real Supabase data
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Jira Automation MCP Server',
    slug: 'jira-automation-mcp-server',
    description: 'A comprehensive Jira automation system built with Model Context Protocol (MCP) that provides AI-powered sprint planning and intelligent ticket management.',
    content: '',
    featured: true,
    status: 'completed',
    author_id: '1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    cover_image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop',
    demo_url: 'https://demo.example.com',
    github_url: 'https://github.com/username/jira-automation',
    tech_stack: ['Python', 'FastAPI', 'Jira API', 'AI/ML'],
    view_count: 2340,
    star_count: 45
  },
  {
    id: '2',
    title: 'Developer Blog Platform',
    slug: 'developer-blog-platform',
    description: 'A modern, full-stack developer blog platform built with Next.js, React, TypeScript, and Supabase featuring real-time comments and SEO optimization.',
    content: '',
    featured: true,
    status: 'in_progress',
    author_id: '1',
    created_at: '2023-12-15T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
    cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    demo_url: 'https://blog-demo.example.com',
    github_url: 'https://github.com/username/blog-platform',
    tech_stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    view_count: 1890,
    star_count: 32
  },
  {
    id: '3',
    title: 'Real-time Chat Application',
    slug: 'realtime-chat-app',
    description: 'A scalable real-time chat application with WebSocket support, user authentication, and message encryption built with Node.js and Socket.io.',
    content: '',
    featured: true,
    status: 'completed',
    author_id: '1',
    created_at: '2023-11-01T00:00:00Z',
    updated_at: '2023-12-01T00:00:00Z',
    cover_image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&h=400&fit=crop',
    demo_url: 'https://chat-demo.example.com',
    github_url: 'https://github.com/username/chat-app',
    tech_stack: ['Node.js', 'Socket.io', 'MongoDB', 'React'],
    view_count: 1567,
    star_count: 28
  }
]

const statusColors = {
  planning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  on_hold: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
}

const statusLabels = {
  planning: 'Planning',
  in_progress: 'In Progress',
  completed: 'Completed',
  on_hold: 'On Hold'
}

export function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Try to fetch from Supabase first
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('featured', true)
          .order('updated_at', { ascending: false })
          .limit(3)

        if (error) {
          console.log('Supabase not configured yet, using mock data')
          setProjects(mockProjects)
        } else {
          setProjects(data || mockProjects)
        }
      } catch (error) {
        console.log('Using mock data:', error)
        setProjects(mockProjects)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <article key={project.id} className="group">
          <div className="card hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
            {/* Cover Image */}
            {project.cover_image && (
              <div className="aspect-video mb-4 overflow-hidden rounded-lg">
                <img
                  src={project.cover_image}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )}

            {/* Content */}
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {project.title}
                  </h3>
                  <span className={`inline-block mt-2 rounded-full px-2 py-1 text-xs font-medium ${statusColors[project.status]}`}>
                    {statusLabels[project.status]}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                {project.description}
              </p>

              {/* Tech Stack */}
              {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="inline-block rounded bg-gray-100 dark:bg-gray-700 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech_stack.length > 4 && (
                    <span className="inline-block rounded bg-gray-100 dark:bg-gray-700 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                      +{project.tech_stack.length - 4} more
                    </span>
                  )}
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-4">
                  {project.view_count && (
                    <div className="flex items-center gap-1">
                      <EyeIcon className="h-4 w-4" />
                      {project.view_count.toLocaleString()}
                    </div>
                  )}
                  {project.star_count && (
                    <div className="flex items-center gap-1">
                      <StarIcon className="h-4 w-4" />
                      {project.star_count}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <Link
                  href={`/projects/${project.slug}`}
                  className="btn-primary flex-1 justify-center"
                >
                  <CodeBracketIcon className="h-4 w-4" />
                  View Details
                </Link>
                
                <div className="flex gap-2">
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost p-2"
                      title="Live Demo"
                    >
                      <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                    </a>
                  )}
                  
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost p-2"
                      title="View Source"
                    >
                      <CodeBracketIcon className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}