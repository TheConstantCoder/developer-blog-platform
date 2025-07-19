import Link from 'next/link'
import { CalendarIcon, ClockIcon, EyeIcon, UserIcon, TagIcon } from '@heroicons/react/24/outline'
import { Post } from '@/types'

interface PostMetaProps {
  post: Post
}

export function PostMeta({ post }: PostMetaProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
      {/* Author Info */}
      {post.author && (
        <div className="flex items-center mb-6">
          {post.author.avatar_url ? (
            <img
              src={post.author.avatar_url}
              alt={post.author.full_name || 'Author'}
              className="w-12 h-12 rounded-full mr-4"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-4">
              <UserIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {post.author.full_name || 'Anonymous'}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              {post.author.bio && (
                <span>{post.author.bio}</span>
              )}
              {post.author.github_username && (
                <a
                  href={`https://github.com/${post.author.github_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                >
                  @{post.author.github_username}
                </a>
              )}
              {post.author.website_url && (
                <a
                  href={post.author.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                >
                  Website
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Post Meta */}
      <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
        {/* Published Date */}
        <div className="flex items-center">
          <CalendarIcon className="w-4 h-4 mr-2" />
          <time dateTime={post.published_at || post.created_at}>
            Published on {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        </div>

        {/* Reading Time */}
        {post.reading_time && (
          <div className="flex items-center">
            <ClockIcon className="w-4 h-4 mr-2" />
            <span>{post.reading_time} min read</span>
          </div>
        )}

        {/* View Count */}
        {post.view_count > 0 && (
          <div className="flex items-center">
            <EyeIcon className="w-4 h-4 mr-2" />
            <span>{post.view_count.toLocaleString()} views</span>
          </div>
        )}

        {/* Last Updated */}
        {post.updated_at !== post.created_at && (
          <div className="flex items-center text-xs">
            <span>
              Last updated {new Date(post.updated_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        )}
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center mb-3">
            <TagIcon className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tagged with:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/blog?tag=${tag.slug}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: tag.color ? `${tag.color}20` : '#f3f4f6',
                  color: tag.color || '#6b7280',
                  border: `1px solid ${tag.color ? `${tag.color}40` : '#d1d5db'}`
                }}
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
