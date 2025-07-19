'use client'

import { useAuth } from '@/app/providers'
import { useState } from 'react'

export default function DebugAuthPage() {
  const { user, profile, loading } = useAuth()
  const [testResults, setTestResults] = useState<string[]>([])

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testRoute = async (url: string, description: string) => {
    try {
      addResult(`Testing ${description} - ${url}`)
      const response = await fetch(url, { method: 'HEAD' })
      addResult(`Response: ${response.status} ${response.statusText}`)
      
      if (response.redirected) {
        addResult(`Redirected to: ${response.url}`)
      }
    } catch (error) {
      addResult(`Error: ${error}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Authentication Debug Page
        </h1>

        {/* Current Auth State */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Current Authentication State
          </h2>
          
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <div className="space-y-2">
              <p><strong>Authenticated:</strong> {user ? '✅ Yes' : '❌ No'}</p>
              {user && (
                <>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Provider:</strong> {user.app_metadata?.provider}</p>
                </>
              )}
              <p><strong>Profile Loaded:</strong> {profile ? '✅ Yes' : '❌ No'}</p>
              {profile && (
                <p><strong>Role:</strong> <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{profile.role}</span></p>
              )}
            </div>
          )}
        </div>

        {/* Test Buttons */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Test Authentication Flow
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <button
              onClick={() => window.location.href = '/admin/dashboard'}
              className="btn-primary"
            >
              Test Admin Access
            </button>
            
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="btn-secondary"
            >
              Test User Dashboard
            </button>
            
            <button
              onClick={() => window.location.href = '/auth/signin'}
              className="btn-secondary"
            >
              Test Auth Redirect
            </button>
            
            <button
              onClick={() => {
                setTestResults([])
                addResult('Starting route tests...')
              }}
              className="btn-secondary"
            >
              Clear Results
            </button>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Test Results
          </h2>
          
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded max-h-64 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-500">No test results yet. Click the test buttons above.</p>
            ) : (
              <div className="space-y-1 font-mono text-sm">
                {testResults.map((result, index) => (
                  <div key={index} className="text-gray-800 dark:text-gray-200">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Expected Behavior */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Expected Behavior
          </h2>
          
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">If NOT authenticated:</h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 ml-4">
                <li>Admin/Dashboard access → Redirect to /auth/signin?returnUrl=...</li>
                <li>Auth pages → Show login form</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">If authenticated as USER:</h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 ml-4">
                <li>Admin access → Redirect to /?error=unauthorized</li>
                <li>Dashboard access → Allow access</li>
                <li>Auth pages → Redirect to /</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">If authenticated as ADMIN:</h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 ml-4">
                <li>Admin access → Allow access</li>
                <li>Dashboard access → Allow access</li>
                <li>Auth pages → Redirect to /</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
