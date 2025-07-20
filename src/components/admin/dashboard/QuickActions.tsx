'use client'

import Link from 'next/link'
import {
  PlusIcon,
  PencilSquareIcon,
  UserPlusIcon,
  TagIcon,
  ChartBarIcon,
  CogIcon,
  DocumentDuplicateIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface QuickAction {
  name: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  primary?: boolean
}

const quickActions: QuickAction[] = [
  {
    name: 'Create New Post',
    description: 'Write and publish a new blog post',
    href: '/admin/posts/new',
    icon: PlusIcon,
    color: 'bg-primary-600 hover:bg-primary-700',
    primary: true
  },
  {
    name: 'Manage Posts',
    description: 'Edit, publish, or delete existing posts',
    href: '/admin/posts',
    icon: PencilSquareIcon,
    color: 'bg-blue-600 hover:bg-blue-700'
  },
  {
    name: 'Create Project',
    description: 'Add a new project to your portfolio',
    href: '/admin/projects/new',
    icon: DocumentDuplicateIcon,
    color: 'bg-green-600 hover:bg-green-700'
  },
  {
    name: 'Manage Tags',
    description: 'Organize and manage content tags',
    href: '/admin/tags',
    icon: TagIcon,
    color: 'bg-purple-600 hover:bg-purple-700'
  },
  {
    name: 'View Analytics',
    description: 'Check site performance and statistics',
    href: '/admin/analytics',
    icon: ChartBarIcon,
    color: 'bg-orange-600 hover:bg-orange-700'
  },
  {
    name: 'User Management',
    description: 'Manage user accounts and permissions',
    href: '/admin/users',
    icon: UserPlusIcon,
    color: 'bg-indigo-600 hover:bg-indigo-700'
  },
  {
    name: 'Site Settings',
    description: 'Configure site-wide settings',
    href: '/admin/settings',
    icon: CogIcon,
    color: 'bg-gray-600 hover:bg-gray-700'
  },
  {
    name: 'View Site',
    description: 'Visit the public site',
    href: '/blog',
    icon: EyeIcon,
    color: 'bg-teal-600 hover:bg-teal-700'
  }
]

export function QuickActions() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Quick Actions
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Common administrative tasks and shortcuts
        </p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className={`group relative p-4 rounded-lg text-white transition-all duration-200 hover:scale-105 hover:shadow-lg ${action.color} ${
                action.primary ? 'ring-2 ring-primary-200 dark:ring-primary-800' : ''
              }`}
            >
              <div className="flex items-center">
                <action.icon className="h-6 w-6 mr-3 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium truncate">
                    {action.name}
                  </h3>
                  <p className="text-xs opacity-90 mt-1 line-clamp-2">
                    {action.description}
                  </p>
                </div>
              </div>
              
              {action.primary && (
                <div className="absolute -top-1 -right-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Popular
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Need help? Check the documentation or contact support.
          </p>
          <Link
            href="/admin/help"
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
          >
            Get Help →
          </Link>
        </div>
      </div>
    </div>
  )
}
