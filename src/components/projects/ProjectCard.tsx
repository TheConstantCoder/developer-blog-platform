'use client'

import Link from 'next/link'
import { 
  CalendarIcon, 
  CodeBracketIcon, 
  ArrowTopRightOnSquareIcon,
  StarIcon,
  CheckCircleIcon,
  ClockIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline'
import { Project } from '@/types'

interface ProjectCardProps {
  project: Project
}

const statusConfig = {
  completed: {
    icon: CheckCircleIcon,
    label: 'Completed',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
  },
  active: {
    icon: ClockIcon,
    label: 'Active',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
  },
  archived: {
    icon: CalendarIcon,
    label: 'Archived',
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-900/20',
  },
}

export function ProjectCard({ project }: ProjectCardProps) {
  const status = statusConfig[project.status] || statusConfig.completed
  const StatusIcon = status.icon

  return (
    <article className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <Link href={`/projects/${project.slug}`} className="block">
        {/* Featured Image */}
        {project.featured_image_url && (
          <div className="aspect-video overflow-hidden">
            <img
              src={project.featured_image_url}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {project.title}
              </h3>
              {project.featured && (
                <div className="flex items-center mt-1">
                  <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                    Featured
                  </span>
                </div>
              )}
            </div>
            
            {/* Status Badge */}
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {status.label}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
            {project.description}
          </p>

          {/* Tech Stack */}
          {project.tech_stack && project.tech_stack.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {project.tech_stack.slice(0, 4).map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
                {project.tech_stack.length > 4 && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                    +{project.tech_stack.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {project.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: tag.color ? `${tag.color}20` : '#f3f4f6',
                      color: tag.color || '#6b7280'
                    }}
                  >
                    {tag.name}
                  </span>
                ))}
                {project.tags.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                    +{project.tags.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Date */}
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {new Date(project.created_at).toLocaleDateString()}
            </div>

            {/* Links */}
            <div className="flex items-center space-x-2">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                  title="View Source Code"
                >
                  <CodeBracketIcon className="h-4 w-4" />
                </a>
              )}
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                  title="View Live Demo"
                >
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
