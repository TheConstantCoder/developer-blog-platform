'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface PostContentProps {
  content: string
}

export function PostContent({ content }: PostContentProps) {
  // For now, let's use a simpler version without syntax highlighting to debug
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Simple code block rendering for now
          code({ node, inline, className, children, ...props }) {
            return (
              <code
                className={`${className} bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm`}
                {...props}
              >
                {children}
              </code>
            )
          },
          // Custom link rendering
          a({ href, children, ...props }) {
            const isExternal = href?.startsWith('http')
            return (
              <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
                {...props}
              >
                {children}
                {isExternal && (
                  <svg
                    className="inline w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                )}
              </a>
            )
          },
          // Custom blockquote rendering
          blockquote({ children, ...props }) {
            return (
              <blockquote
                className="border-l-4 border-primary-500 pl-6 py-2 my-6 bg-gray-50 dark:bg-gray-800/50 rounded-r-lg"
                {...props}
              >
                {children}
              </blockquote>
            )
          },
          // Custom table rendering
          table({ children, ...props }) {
            return (
              <div className="overflow-x-auto my-6">
                <table
                  className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg"
                  {...props}
                >
                  {children}
                </table>
              </div>
            )
          },
          thead({ children, ...props }) {
            return (
              <thead className="bg-gray-50 dark:bg-gray-800" {...props}>
                {children}
              </thead>
            )
          },
          th({ children, ...props }) {
            return (
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                {...props}
              >
                {children}
              </th>
            )
          },
          td({ children, ...props }) {
            return (
              <td
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 border-t border-gray-200 dark:border-gray-700"
                {...props}
              >
                {children}
              </td>
            )
          },
          // Custom image rendering
          img({ src, alt, ...props }) {
            return (
              <figure className="my-8">
                <img
                  src={src}
                  alt={alt}
                  className="rounded-lg shadow-lg w-full"
                  loading="lazy"
                  {...props}
                />
                {alt && (
                  <figcaption className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {alt}
                  </figcaption>
                )}
              </figure>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
