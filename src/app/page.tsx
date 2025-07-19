import { Metadata } from 'next'
import { Hero } from '@/components/layout/Hero'
import { FeaturedPosts } from '@/components/blog/FeaturedPosts'
import { FeaturedProjects } from '@/components/projects/FeaturedProjects'
import { Newsletter } from '@/components/forms/Newsletter'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to Glenn Geraghty\'s developer blog. Discover insights, tutorials, and projects in web development and software engineering.',
}

export default function HomePage() {
  return (
    <div className="space-y-16 pb-16">
      {/* Error Message Display */}
      <ErrorMessage />

      {/* Hero Section */}
      <Hero />
      
      {/* Featured Posts */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Latest Posts
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore my latest thoughts on web development, software engineering, and technology trends.
          </p>
        </div>
        <FeaturedPosts />
      </section>

      {/* Featured Projects */}
      <section className="bg-gray-50 dark:bg-gray-800/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Check out some of my recent work and side projects.
            </p>
          </div>
          <FeaturedProjects />
        </div>
      </section>

      {/* Newsletter */}
      <section className="container mx-auto px-4">
        <Newsletter />
      </section>
    </div>
  )
}