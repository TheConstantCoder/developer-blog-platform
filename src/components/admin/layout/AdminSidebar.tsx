'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  DocumentTextIcon,
  FolderIcon,
  TagIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon,
  PencilSquareIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface AdminSidebarProps {
  isOpen: boolean
  onToggle: () => void
}

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
  children?: NavItem[]
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: HomeIcon,
  },
  {
    name: 'Content',
    href: '/admin/posts',
    icon: DocumentTextIcon,
    children: [
      {
        name: 'All Posts',
        href: '/admin/posts',
        icon: DocumentTextIcon,
        badge: 'new'
      },
      {
        name: 'Create Post',
        href: '/admin/posts/new',
        icon: PencilSquareIcon,
      },
      {
        name: 'Drafts',
        href: '/admin/posts?status=draft',
        icon: DocumentTextIcon,
      }
    ]
  },
  {
    name: 'Projects',
    href: '/admin/projects',
    icon: FolderIcon,
  },
  {
    name: 'Tags',
    href: '/admin/tags',
    icon: TagIcon,
  },
  {
    name: 'Comments',
    href: '/admin/comments',
    icon: ChatBubbleLeftRightIcon,
    badge: 3
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: UsersIcon,
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: ChartBarIcon,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: CogIcon,
  },
]

export function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(['/admin/posts'])

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href]
    )
  }

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const renderNavItem = (item: NavItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.href)
    const active = isActive(item.href)

    return (
      <div key={item.href}>
        <div className="group">
          {hasChildren ? (
            <button
              onClick={() => toggleExpanded(item.href)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                active
                  ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              } ${level > 0 ? 'ml-4' : ''}`}
            >
              <div className="flex items-center">
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
                {item.badge && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full dark:bg-red-900 dark:text-red-200">
                    {item.badge}
                  </span>
                )}
              </div>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  isExpanded ? 'rotate-90' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <Link
              href={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                active
                  ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              } ${level > 0 ? 'ml-4' : ''}`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.name}</span>
              {item.badge && (
                <span className="ml-auto px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full dark:bg-red-900 dark:text-red-200">
                  {item.badge}
                </span>
              )}
            </Link>
          )}
        </div>

        {/* Render children if expanded */}
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <Link href="/admin/dashboard" className="flex items-center">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
              Admin
            </span>
          </Link>
          
          <button
            onClick={onToggle}
            className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navigation.map(item => renderNavItem(item))}
        </nav>

        {/* Quick actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-2">
            <Link
              href="/blog"
              className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <EyeIcon className="w-4 h-4 mr-2" />
              View Site
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
