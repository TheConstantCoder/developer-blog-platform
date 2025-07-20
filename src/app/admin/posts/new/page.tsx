import { Metadata } from 'next'
import { AdminLayout } from '@/components/admin/layout/AdminLayout'
import { PostEditor } from '@/components/admin/posts/PostEditor'

export const metadata: Metadata = {
  title: 'Create New Post | Admin Dashboard',
  description: 'Create a new blog post.',
}

export default function NewPostPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create New Post
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Write and publish a new blog post.
          </p>
        </div>

        {/* Post Editor */}
        <PostEditor />
      </div>
    </AdminLayout>
  )
}
