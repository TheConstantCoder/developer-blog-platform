import { Metadata } from 'next'
import { AdminLayout } from '@/components/admin/layout/AdminLayout'
import { AdminProjectsList } from '@/components/admin/projects/AdminProjectsList'

export const metadata: Metadata = {
  title: 'Manage Projects | Admin Dashboard',
  description: 'Manage projects - create, edit, and organize your project portfolio.',
}

export default function AdminProjectsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Manage Projects
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Create, edit, and manage your project portfolio.
            </p>
          </div>
        </div>

        {/* Projects List */}
        <AdminProjectsList />
      </div>
    </AdminLayout>
  )
}
