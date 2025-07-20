import { Metadata } from 'next'
import { AdminLayout } from '@/components/admin/layout/AdminLayout'
import { AdminPostsList } from '@/components/admin/posts/AdminPostsList'

export const metadata: Metadata = {
  title: 'Manage Posts | Admin Dashboard',
  description: 'Manage blog posts - create, edit, publish, and delete posts.',
}

export default function AdminPostsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Manage Posts
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Create, edit, and manage your blog posts.
            </p>
          </div>
        </div>

        {/* Posts List */}
        <AdminPostsList />
      </div>
    </AdminLayout>
  )
}
