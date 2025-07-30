'use client'

import Link from 'next/link'
import { 
  CalendarIcon, 
  CodeBracketIcon, 
  ArrowTopRightOnSquareIcon,
  UserIcon,
  TagIcon,
  CheckCircleIcon,
  ClockIcon,
  PencilSquareIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline'
import { Project } from '@/types'

interface ProjectMetaProps {
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
    icon: ArchiveBoxIcon,
    label: 'Archived',
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-900/20',
  },
}

export function ProjectMeta({ project }: ProjectMetaProps) {
  const status = statusConfig[project.status] || statusConfig.completed
  const StatusIcon = status.icon

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
      <div className="flex flex-col space-y-4">
        {/* Status and Date */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          {/* Status */}
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.bgColor} ${status.color}`}>
            <StatusIcon className="h-4 w-4 mr-2" />
            {status.label}
          </div>

          {/* Created Date */}
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" />
            Created {new Date(project.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>

          {/* Updated Date */}
          {project.updated_at !== project.created_at && (
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              Updated {new Date(project.updated_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          )}
        </div>

        {/* Author */}
        {project.author && (
          <div className="flex items-center space-x-3">
            {project.author.avatar_url ? (
              <img
                src={project.author.avatar_url}
                alt={project.author.full_name || 'Author'}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {project.author.full_name || 'Anonymous'}
              </p>
              {project.author.bio && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {project.author.bio}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tech Stack */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
              <TagIcon className="h-4 w-4 mr-1" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/projects?tag=${tag.slug}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors hover:opacity-80"
                  style={{
                    backgroundColor: tag.color ? `${tag.color}20` : '#f3f4f6',
                    color: tag.color || '#6b7280'
                  }}
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Project Links */}
        <div className="flex flex-wrap gap-4">
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
            >
              <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2" />
              View Live Demo
            </a>
          )}
          
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <CodeBracketIcon className="h-4 w-4 mr-2" />
              View Source Code
            </a>
          )}
        </div>

        {/* Project Description */}
        {project.description && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Project Overview
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {project.description}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
