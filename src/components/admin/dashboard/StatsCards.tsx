'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  DocumentTextIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'

interface Stat {
  name: string
  value: string | number
  change?: string
  changeType?: 'increase' | 'decrease'
  icon: React.ComponentType<{ className?: string }>
  href?: string
}

interface StatsData {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalUsers: number
  totalComments: number
  totalViews: number
  pendingComments: number
}

export function StatsCards() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all stats in parallel
        const [
          { count: totalPosts },
          { count: publishedPosts },
          { count: draftPosts },
          { count: totalUsers },
          { count: totalComments },
          { count: pendingComments },
          { data: viewsData }
        ] = await Promise.all([
          supabase.from('posts').select('*', { count: 'exact', head: true }),
          supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'published'),
          supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('comments').select('*', { count: 'exact', head: true }),
          supabase.from('comments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('posts').select('view_count')
        ])

        // Calculate total views
        const totalViews = viewsData?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0

        setStats({
          totalPosts: totalPosts || 0,
          publishedPosts: publishedPosts || 0,
          draftPosts: draftPosts || 0,
          totalUsers: totalUsers || 0,
          totalComments: totalComments || 0,
          totalViews,
          pendingComments: pendingComments || 0
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [supabase])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
        <p className="text-red-800 dark:text-red-200">Failed to load statistics</p>
      </div>
    )
  }

  const statsConfig: Stat[] = [
    {
      name: 'Total Posts',
      value: stats.totalPosts,
      change: `${stats.publishedPosts} published`,
      changeType: 'increase',
      icon: DocumentTextIcon,
      href: '/admin/posts'
    },
    {
      name: 'Total Users',
      value: stats.totalUsers,
      change: '+12% from last month',
      changeType: 'increase',
      icon: UsersIcon,
      href: '/admin/users'
    },
    {
      name: 'Comments',
      value: stats.totalComments,
      change: stats.pendingComments > 0 ? `${stats.pendingComments} pending` : 'All reviewed',
      changeType: stats.pendingComments > 0 ? 'decrease' : 'increase',
      icon: ChatBubbleLeftRightIcon,
      href: '/admin/comments'
    },
    {
      name: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      change: '+8% from last week',
      changeType: 'increase',
      icon: EyeIcon,
      href: '/admin/analytics'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsConfig.map((stat) => (
        <div
          key={stat.name}
          className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow duration-200 p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                {stat.name}
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
            <div className="flex-shrink-0">
              {stat.icon && <stat.icon className="h-8 w-8 text-gray-400" />}
            </div>
          </div>
          
          {stat.change && (
            <div className="mt-4 flex items-center">
              {stat.changeType === 'increase' ? (
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${
                  stat.changeType === 'increase'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {stat.change}
              </span>
            </div>
          )}
          
          {stat.href && (
            <div className="mt-4">
              <a
                href={stat.href}
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
              >
                View details →
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
