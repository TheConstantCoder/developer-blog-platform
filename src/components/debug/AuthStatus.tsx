'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export function AuthStatus() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('Session error:', sessionError)
      }

      if (session?.user) {
        setUser(session.user)
        
        // Get profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profileError) {
          console.error('Profile error:', profileError)
        } else {
          setProfile(profile)
        }
      }
    } catch (error) {
      console.error('Auth check error:', error)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded z-50">
        Checking auth...
      </div>
    )
  }

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-300 shadow-lg rounded-lg p-4 z-50 max-w-sm">
      <h3 className="font-bold text-sm mb-2">Auth Status</h3>
      
      {user ? (
        <div className="space-y-2 text-xs">
          <div className="text-green-600">✅ Authenticated</div>
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>ID:</strong> {user.id}</div>
          {profile && (
            <>
              <div><strong>Name:</strong> {profile.full_name}</div>
              <div><strong>Role:</strong> <span className={profile.role === 'admin' ? 'text-red-600 font-bold' : 'text-blue-600'}>{profile.role}</span></div>
            </>
          )}
          <button
            onClick={signOut}
            className="mt-2 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="space-y-2 text-xs">
          <div className="text-red-600">❌ Not Authenticated</div>
          <div>No user session found</div>
        </div>
      )}
    </div>
  )
}
