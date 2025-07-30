'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CalendarIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { Project } from '@/types'
import { supabase } from '@/lib/supabase'

interface RelatedProjectsProps {
  currentProjectId: string
  techStack: string[]
  tags: string[]
}

export function RelatedProjects({ currentProjectId, techStack, tags }: RelatedProjectsProps) {
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRelatedProjects()
  }, [currentProjectId, techStack, tags])

  const fetchRelatedProjects = async () => {
    try {
      setLoading(true)

      // First, try to find projects with similar tech stack
      let query = supabase
        .from('projects')
        .select(`
          id,
          title,
          slug,
          description,
          tech_stack,
          status,
          created_at,
          featured_image_url
        `)
        .neq('id', currentProjectId)
        .limit(4)

      // If we have tech stack, prioritize projects with overlapping technologies
      if (techStack && techStack.length > 0) {
        // Use overlap operator to find projects with any matching tech
        query = query.overlaps('tech_stack', techStack)
      }

      const { data: techRelatedProjects, error: techError } = await query

      if (techError) throw techError

      let finalProjects = techRelatedProjects || []

      // If we don't have enough tech-related projects, get more recent projects
      if (finalProjects.length < 3) {
        const { data: recentProjects, error: recentError } = await supabase
          .from('projects')
          .select(`
            id,
            title,
            slug,
            description,
            tech_stack,
            status,
            created_at,
            featured_image_url
          `)
          .neq('id', currentProjectId)
          .not('id', 'in', `(${finalProjects.map(p => p.id).join(',') || 'null'})`)
          .order('created_at', { ascending: false })
          .limit(3 - finalProjects.length)

        if (recentError) throw recentError

        finalProjects = [...finalProjects, ...(recentProjects || [])]
      }

      setRelatedProjects(finalProjects.slice(0, 3))
    } catch (error) {
      console.error('Error fetching related projects:', error)
      setRelatedProjects([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Related Projects
        </h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (relatedProjects.length === 0) {
    return null
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Related Projects
      </h3>
      <div className="space-y-4">
        {relatedProjects.map((project) => (
          <article key={project.id} className="group">
            <Link href={`/projects/${project.slug}`} className="block">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
                {/* Project Image */}
                {project.featured_image_url && (
                  <div className="aspect-video mb-3 overflow-hidden rounded">
                    <img
                      src={project.featured_image_url}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}

                {/* Project Info */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {project.title}
                  </h4>
                  
                  {project.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  {/* Tech Stack */}
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {project.tech_stack.slice(0, 3).map((tech, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.tech_stack.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                            +{project.tech_stack.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Date */}
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {new Date(project.created_at).toLocaleDateString()}
                    </div>
                    <ArrowTopRightOnSquareIcon className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {/* View All Projects Link */}
      <div className="mt-6">
        <Link
          href="/projects"
          className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          View All Projects
          <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
