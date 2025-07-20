import { Metadata } from 'next'
import { AdminLayout } from '@/components/admin/layout/AdminLayout'
import { StatsCards } from '@/components/admin/dashboard/StatsCards'
import { QuickActions } from '@/components/admin/dashboard/QuickActions'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin dashboard for managing the developer blog platform.',
}

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your blog platform content and users.
        </p>
      </div>

      {/* Stats Cards with Real Data */}
      <StatsCards />

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activity */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                New blog post published: "Building Modern Apps"
              </p>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                User registration: john@example.com
              </p>
              <span className="text-xs text-gray-500">4 hours ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Comment pending moderation on "TypeScript Guide"
              </p>
              <span className="text-xs text-gray-500">6 hours ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Notice */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-2xl" role="img" aria-label="Admin">
              👑
            </span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Admin Dashboard Active
            </h3>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
              You have full administrative access to manage content, users, and site settings.
              All admin actions are logged for security purposes.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
