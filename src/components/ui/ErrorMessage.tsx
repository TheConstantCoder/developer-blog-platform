'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { XMarkIcon } from '@heroicons/react/24/outline'

export function ErrorMessage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const errorParam = searchParams.get('error')
    const messageParam = searchParams.get('message')
    
    if (errorParam) {
      setError(errorParam)
      setMessage(messageParam)
    }
  }, [searchParams])

  const handleDismiss = () => {
    setError(null)
    setMessage(null)
    
    // Remove error parameters from URL
    const url = new URL(window.location.href)
    url.searchParams.delete('error')
    url.searchParams.delete('message')
    router.replace(url.pathname + url.search)
  }

  if (!error) {
    return null
  }

  const getErrorTitle = (errorType: string) => {
    switch (errorType) {
      case 'unauthorized':
        return 'Access Denied'
      case 'authentication_required':
        return 'Authentication Required'
      default:
        return 'Error'
    }
  }

  const getErrorIcon = (errorType: string) => {
    switch (errorType) {
      case 'unauthorized':
        return '🚫'
      case 'authentication_required':
        return '🔒'
      default:
        return '⚠️'
    }
  }

  return (
    <div className="container mx-auto px-4 pt-4">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-2xl" role="img" aria-label="Error">
              {getErrorIcon(error)}
            </span>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              {getErrorTitle(error)}
            </h3>
            {message && (
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                {message}
              </p>
            )}
          </div>
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={handleDismiss}
                className="inline-flex rounded-md bg-red-50 dark:bg-red-900/20 p-1.5 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50 dark:focus:ring-offset-red-900/20"
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
