'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'

interface BreadcrumbItem {
  name: string
  href: string
  current?: boolean
}

const routeMap: Record<string, string> = {
  'admin': 'Admin',
  'dashboard': 'Dashboard',
  'posts': 'Posts',
  'projects': 'Projects',
  'tags': 'Tags',
  'comments': 'Comments',
  'users': 'Users',
  'analytics': 'Analytics',
  'settings': 'Settings',
  'new': 'Create New',
  'edit': 'Edit',
}

export function AdminBreadcrumbs() {
  const pathname = usePathname()
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []
    
    // Always start with Admin Dashboard
    breadcrumbs.push({
      name: 'Dashboard',
      href: '/admin/dashboard',
    })
    
    // Skip the first 'admin' segment since we already have Dashboard
    const relevantSegments = pathSegments.slice(1)
    
    let currentPath = '/admin'
    
    relevantSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      
      // Skip if it's the dashboard segment (already added)
      if (segment === 'dashboard') return
      
      // Get display name from route map or format the segment
      const displayName = routeMap[segment] || formatSegment(segment)
      
      breadcrumbs.push({
        name: displayName,
        href: currentPath,
        current: index === relevantSegments.length - 1
      })
    })
    
    return breadcrumbs
  }
  
  const formatSegment = (segment: string): string => {
    // Handle UUIDs or slugs
    if (segment.length > 20 || segment.includes('-')) {
      return 'Details'
    }
    
    // Capitalize first letter
    return segment.charAt(0).toUpperCase() + segment.slice(1)
  }
  
  const breadcrumbs = generateBreadcrumbs()
  
  // Don't show breadcrumbs on the main dashboard
  if (pathname === '/admin/dashboard') {
    return null
  }
  
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRightIcon className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2" />
            )}
            
            <div className="flex items-center">
              {index === 0 && (
                <HomeIcon className="flex-shrink-0 h-4 w-4 text-gray-400 mr-2" />
              )}
              
              {item.current ? (
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                >
                  {item.name}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}
