'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'
import { AdminBreadcrumbs } from './AdminBreadcrumbs'

interface AdminLayoutProps {
  children: React.ReactNode
}

interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role?: string
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (authUser) {
          // Get user profile with role
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single()

          setUser({
            id: authUser.id,
            email: authUser.email || '',
            full_name: profile?.full_name,
            avatar_url: profile?.avatar_url,
            role: profile?.role
          })
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [supabase])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <AdminHeader onMenuToggle={toggleSidebar} user={user} />

        {/* Page content */}
        <main className="flex-1">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {/* Breadcrumbs */}
            <AdminBreadcrumbs />
            
            {/* Page content */}
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
