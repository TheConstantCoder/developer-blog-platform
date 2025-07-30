import { Metadata } from 'next'
import { Suspense } from 'react'
import { ProjectList } from '@/components/projects/ProjectList'
import { ProjectSearch } from '@/components/projects/ProjectSearch'
import { ProjectFilters } from '@/components/projects/ProjectFilters'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export const metadata: Metadata = {
  title: 'Projects | Glenn Geraghty - Developer Portfolio',
  description: 'Explore my portfolio of web development projects, including full-stack applications, open-source contributions, and technical experiments.',
  keywords: ['projects', 'portfolio', 'web development', 'full-stack', 'React', 'Next.js', 'TypeScript'],
  openGraph: {
    title: 'Projects | Glenn Geraghty',
    description: 'Explore my portfolio of web development projects and technical experiments.',
    type: 'website',
    url: '/projects',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects | Glenn Geraghty',
    description: 'Explore my portfolio of web development projects and technical experiments.',
  },
}

interface ProjectsPageProps {
  searchParams: {
    page?: string
    search?: string
    tech?: string
    status?: string
    sort?: string
  }
}

export default function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const page = parseInt(searchParams.page || '1', 10)
  const search = searchParams.search || ''
  const tech = searchParams.tech || ''
  const status = searchParams.status || ''
  const sort = searchParams.sort || 'newest'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
              My Projects
            </h1>
            <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A collection of web applications, tools, and experiments I've built using modern technologies. 
              From full-stack applications to open-source contributions.
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
                  Search Projects
                </h2>
                <Suspense fallback={<div className="h-10 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />}>
                  <ProjectSearch initialQuery={search} />
                </Suspense>
              </div>

              {/* Filters */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Filter Projects
                </h2>
                <Suspense fallback={
                  <div className="space-y-4">
                    <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-4 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                      ))}
                    </div>
                  </div>
                }>
                  <ProjectFilters 
                    selectedTech={tech}
                    selectedStatus={status}
                  />
                </Suspense>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 mt-8 lg:mt-0">
            <Suspense fallback={
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48" />
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32" />
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                      <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
                      <div className="space-y-3">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }>
              <ProjectList 
                page={page}
                search={search}
                tech={tech}
                status={status}
                sort={sort}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
