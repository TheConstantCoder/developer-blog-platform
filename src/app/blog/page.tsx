import { Metadata } from 'next'
import { Suspense } from 'react'
import { BlogList } from '@/components/blog/BlogList'
import { BlogSearch } from '@/components/blog/BlogSearch'
import { BlogFilters } from '@/components/blog/BlogFilters'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Discover insights, tutorials, and thoughts on web development, software engineering, and technology.',
  keywords: [
    'blog',
    'web development',
    'software engineering',
    'programming tutorials',
    'technology insights',
    'Next.js',
    'React',
    'TypeScript',
    'Supabase'
  ],
  openGraph: {
    title: 'Blog | Glenn Geraghty',
    description: 'Discover insights, tutorials, and thoughts on web development, software engineering, and technology.',
    type: 'website',
    url: '/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Glenn Geraghty',
    description: 'Discover insights, tutorials, and thoughts on web development, software engineering, and technology.',
  }
}

interface BlogPageProps {
  searchParams: {
    page?: string
    search?: string
    tag?: string
    sort?: string
  }
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  const currentPage = parseInt(searchParams.page || '1', 10)
  const searchQuery = searchParams.search || ''
  const selectedTag = searchParams.tag || ''
  const sortBy = searchParams.sort || 'newest'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
              Blog
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Insights, tutorials, and thoughts on web development, software engineering, and technology.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Search */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Search Posts
                </h2>
                <Suspense fallback={<div className="h-10 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />}>
                  <BlogSearch initialQuery={searchQuery} />
                </Suspense>
              </div>

              {/* Filters */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Filter by Tag
                </h2>
                <Suspense fallback={<div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-8 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                  ))}
                </div>}>
                  <BlogFilters selectedTag={selectedTag} />
                </Suspense>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 mt-8 lg:mt-0">
            <Suspense fallback={
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                      <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 animate-pulse" />
                      <div className="space-y-3">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }>
              <BlogList 
                page={currentPage}
                search={searchQuery}
                tag={selectedTag}
                sort={sortBy}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
