'use client'

import Link from 'next/link'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  searchParams: URLSearchParams
  maxVisiblePages?: number
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  baseUrl, 
  searchParams,
  maxVisiblePages = 5 
}: PaginationProps) {
  if (totalPages <= 1) return null

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page === 1) {
      params.delete('page')
    } else {
      params.set('page', page.toString())
    }
    const queryString = params.toString()
    return queryString ? `${baseUrl}?${queryString}` : baseUrl
  }

  // Calculate which page numbers to show
  const getVisiblePages = () => {
    const pages: (number | string)[] = []
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)
      
      // Calculate start and end of middle section
      let start = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2))
      let end = Math.min(totalPages - 1, start + maxVisiblePages - 3)
      
      // Adjust start if end is at the limit
      start = Math.max(2, end - maxVisiblePages + 3)
      
      // Add ellipsis if there's a gap after first page
      if (start > 2) {
        pages.push('...')
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      // Add ellipsis if there's a gap before last page
      if (end < totalPages - 1) {
        pages.push('...')
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        {/* Mobile pagination */}
        {currentPage > 1 ? (
          <Link
            href={createPageUrl(currentPage - 1)}
            className="relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Previous
          </Link>
        ) : (
          <span className="relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-400 dark:text-gray-500 cursor-not-allowed">
            Previous
          </span>
        )}
        
        {currentPage < totalPages ? (
          <Link
            href={createPageUrl(currentPage + 1)}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Next
          </Link>
        ) : (
          <span className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-400 dark:text-gray-500 cursor-not-allowed">
            Next
          </span>
        )}
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Showing page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            {/* Previous button */}
            {currentPage > 1 ? (
              <Link
                href={createPageUrl(currentPage - 1)}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </Link>
            ) : (
              <span className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-300 dark:text-gray-600 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 cursor-not-allowed">
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </span>
            )}

            {/* Page numbers */}
            {visiblePages.map((page, index) => {
              if (page === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:outline-offset-0"
                  >
                    ...
                  </span>
                )
              }

              const pageNumber = page as number
              const isCurrentPage = pageNumber === currentPage

              return isCurrentPage ? (
                <span
                  key={pageNumber}
                  className="relative z-10 inline-flex items-center bg-primary-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  {pageNumber}
                </span>
              ) : (
                <Link
                  key={pageNumber}
                  href={createPageUrl(pageNumber)}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0"
                >
                  {pageNumber}
                </Link>
              )
            })}

            {/* Next button */}
            {currentPage < totalPages ? (
              <Link
                href={createPageUrl(currentPage + 1)}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </Link>
            ) : (
              <span className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-300 dark:text-gray-600 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 cursor-not-allowed">
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </span>
            )}
          </nav>
        </div>
      </div>
    </nav>
  )
}
