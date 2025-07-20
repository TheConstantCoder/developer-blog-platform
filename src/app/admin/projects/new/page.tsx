import { Metadata } from 'next'
import { AdminLayout } from '@/components/admin/layout/AdminLayout'
import { ProjectEditor } from '@/components/admin/projects/ProjectEditor'

export const metadata: Metadata = {
  title: 'Create New Project | Admin Dashboard',
  description: 'Create a new project for your portfolio.',
}

export default function NewProjectPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create New Project
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Add a new project to your portfolio.
          </p>
        </div>

        {/* Project Editor */}
        <ProjectEditor />
      </div>
    </AdminLayout>
  )
}
