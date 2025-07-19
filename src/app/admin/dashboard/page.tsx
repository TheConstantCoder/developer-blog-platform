import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin dashboard for managing the developer blog platform.',
}

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your blog platform content and users.
          </p>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Total Posts
            </h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              12
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Total Users
            </h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              45
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Comments
            </h3>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              128
            </p>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="btn-primary text-left p-4 rounded-lg">
              <h3 className="font-semibold mb-1">Manage Posts</h3>
              <p className="text-sm opacity-80">Create, edit, and delete blog posts</p>
            </button>
            
            <button className="btn-secondary text-left p-4 rounded-lg">
              <h3 className="font-semibold mb-1">Manage Users</h3>
              <p className="text-sm opacity-80">View and manage user accounts</p>
            </button>
            
            <button className="btn-secondary text-left p-4 rounded-lg">
              <h3 className="font-semibold mb-1">Moderate Comments</h3>
              <p className="text-sm opacity-80">Review and moderate user comments</p>
            </button>
            
            <button className="btn-secondary text-left p-4 rounded-lg">
              <h3 className="font-semibold mb-1">Site Settings</h3>
              <p className="text-sm opacity-80">Configure site-wide settings</p>
            </button>
          </div>
        </div>

        {/* Access Notice */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-2xl" role="img" aria-label="Admin">
                👑
              </span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Admin Access Required
              </h3>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                This page is protected by authentication middleware and requires admin role access.
                Only users with admin privileges can view this content.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
