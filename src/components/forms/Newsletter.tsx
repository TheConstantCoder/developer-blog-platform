'use client'

import { useState } from 'react'
import { EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setStatus('error')
      setMessage('Please enter your email address')
      return
    }

    setStatus('loading')
    
    try {
      // TODO: Implement newsletter subscription with Supabase
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStatus('success')
      setMessage('Thanks for subscribing! You\'ll receive updates about new posts and projects.')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-2xl p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircleIcon className="h-12 w-12 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          You're all set!
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {message}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-2xl p-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-primary-100 dark:bg-primary-900/50 rounded-full p-3">
            <EnvelopeIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
        </div>

        {/* Heading */}
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Stay in the loop
        </h3>
        
        {/* Description */}
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Get notified when I publish new articles, tutorials, and project updates. 
          No spam, just quality content delivered to your inbox.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <div className="flex-1">
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="input-field"
              disabled={status === 'loading'}
            />
          </div>
          
          <button
            type="submit"
            disabled={status === 'loading'}
            className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Subscribing...
              </div>
            ) : (
              'Subscribe'
            )}
          </button>
        </form>

        {/* Error message */}
        {status === 'error' && (
          <p className="mt-4 text-red-600 dark:text-red-400 text-sm">
            {message}
          </p>
        )}

        {/* Privacy note */}
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          I respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  )
}