import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'User Dashboard',
  description: 'User dashboard for managing your content and profile.',
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your content and profile settings.
          </p>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Your Posts
            </h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              3
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Comments
            </h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              12
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Profile Views
            </h3>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              89
            </p>
          </div>
        </div>

        {/* User Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="btn-primary text-left p-4 rounded-lg">
              <h3 className="font-semibold mb-1">Create New Post</h3>
              <p className="text-sm opacity-80">Write and publish a new blog post</p>
            </button>
            
            <button className="btn-secondary text-left p-4 rounded-lg">
              <h3 className="font-semibold mb-1">Edit Profile</h3>
              <p className="text-sm opacity-80">Update your profile information</p>
            </button>
            
            <button className="btn-secondary text-left p-4 rounded-lg">
              <h3 className="font-semibold mb-1">Manage Posts</h3>
              <p className="text-sm opacity-80">Edit or delete your existing posts</p>
            </button>
            
            <button className="btn-secondary text-left p-4 rounded-lg">
              <h3 className="font-semibold mb-1">Account Settings</h3>
              <p className="text-sm opacity-80">Update your account preferences</p>
            </button>
          </div>
        </div>

        {/* Access Notice */}
        <div className="mt-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-2xl" role="img" aria-label="User">
                👤
              </span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                Authenticated User Access
              </h3>
              <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                This page is protected by authentication middleware and requires user authentication.
                Any authenticated user (user, admin, or moderator) can access this content.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
