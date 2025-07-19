'use client'

import { useAuth } from '@/app/providers'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'

export default function AuthTestPage() {
  const { user, profile, loading } = useAuth()
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [profileInfo, setProfileInfo] = useState<any>(null)

  useEffect(() => {
    const getSessionInfo = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      setSessionInfo({ session, error })
    }
    
    const getProfileInfo = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfileInfo({ data, error })
      }
    }

    getSessionInfo()
    getProfileInfo()
  }, [user])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Authentication Test Page
        </h1>

        {/* Loading State */}
        {loading && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <p className="text-blue-800 dark:text-blue-200">Loading authentication state...</p>
          </div>
        )}

        {/* Authentication Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* User Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              User Information
            </h2>
            {user ? (
              <div className="space-y-2">
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Provider:</strong> {user.app_metadata?.provider}</p>
                <p><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</p>
                <p><strong>Last Sign In:</strong> {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}</p>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Not authenticated</p>
            )}
          </div>

          {/* Profile Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Profile Information
            </h2>
            {profile ? (
              <div className="space-y-2">
                <p><strong>Full Name:</strong> {profile.full_name || 'Not set'}</p>
                <p><strong>Role:</strong> <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{profile.role}</span></p>
                <p><strong>GitHub:</strong> {profile.github_username || 'Not set'}</p>
                <p><strong>Public:</strong> {profile.is_public ? 'Yes' : 'No'}</p>
                <p><strong>Bio:</strong> {profile.bio || 'Not set'}</p>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No profile data</p>
            )}
          </div>
        </div>

        {/* Session Debug Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Session Debug Info
          </h2>
          <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(sessionInfo, null, 2)}
          </pre>
        </div>

        {/* Profile Debug Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Profile Debug Info
          </h2>
          <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(profileInfo, null, 2)}
          </pre>
        </div>

        {/* Test Links */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Test Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="/admin/dashboard" className="btn-primary text-center">
              Test Admin Access
            </a>
            <a href="/dashboard" className="btn-secondary text-center">
              Test User Dashboard
            </a>
            <a href="/profile/edit" className="btn-secondary text-center">
              Test Profile Edit
            </a>
            <a href="/auth/signin" className="btn-secondary text-center">
              Test Auth Redirect
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Actions
          </h2>
          <div className="space-x-4">
            {user ? (
              <button onClick={handleSignOut} className="btn-primary">
                Sign Out
              </button>
            ) : (
              <a href="/auth/signin" className="btn-primary">
                Sign In
              </a>
            )}
            <a href="/" className="btn-secondary">
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
