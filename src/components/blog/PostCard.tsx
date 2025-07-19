import Link from 'next/link'
import { CalendarIcon, ClockIcon, EyeIcon, UserIcon } from '@heroicons/react/24/outline'
import { Post } from '@/types'

interface PostCardProps {
  post: Post
  featured?: boolean
}

export function PostCard({ post, featured = false }: PostCardProps) {
  const cardClasses = featured 
    ? "group block bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    : "group block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"

  const imageClasses = featured ? "aspect-[16/9]" : "aspect-video"

  return (
    <Link href={`/blog/${post.slug}`} className={cardClasses}>
      <article>
        {/* Featured Image */}
        {post.featured_image_url && (
          <div className={`${imageClasses} overflow-hidden`}>
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}

        {/* Content */}
        <div className={featured ? "p-8" : "p-6"}>
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: tag.color ? `${tag.color}20` : '#f3f4f6',
                    color: tag.color || '#6b7280'
                  }}
                >
                  {tag.name}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h2 className={`font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 ${
            featured ? 'text-2xl mb-4' : 'text-xl mb-3'
          }`}>
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className={`text-gray-600 dark:text-gray-300 leading-relaxed ${
              featured ? 'text-base mb-6' : 'text-sm mb-4'
            }`}>
              {post.excerpt}
            </p>
          )}

          {/* Author Info */}
          {post.author && (
            <div className="flex items-center mb-4">
              {post.author.avatar_url ? (
                <img
                  src={post.author.avatar_url}
                  alt={post.author.full_name || 'Author'}
                  className="w-8 h-8 rounded-full mr-3"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                  <UserIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
              )}
              <div className="text-sm">
                <p className="text-gray-900 dark:text-white font-medium">
                  {post.author.full_name || 'Anonymous'}
                </p>
                {post.author.github_username && (
                  <p className="text-gray-500 dark:text-gray-400">
                    @{post.author.github_username}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Meta Information */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              {/* Published Date */}
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-1" />
                <time dateTime={post.published_at || post.created_at}>
                  {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </time>
              </div>

              {/* Reading Time */}
              {post.reading_time && (
                <div className="flex items-center">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  <span>{post.reading_time} min read</span>
                </div>
              )}
            </div>

            {/* View Count */}
            {post.view_count > 0 && (
              <div className="flex items-center">
                <EyeIcon className="w-4 h-4 mr-1" />
                <span>{post.view_count.toLocaleString()} views</span>
              </div>
            )}
          </div>

          {/* Read More Indicator */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center text-primary-600 dark:text-primary-400 text-sm font-medium group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-200">
              Read full article
              <svg
                className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
