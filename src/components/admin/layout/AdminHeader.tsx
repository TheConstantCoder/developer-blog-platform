'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  CogIcon,
  UserIcon
} from '@heroicons/react/24/outline'

interface AdminHeaderProps {
  onMenuToggle: () => void
  user?: {
    full_name?: string
    email?: string
    avatar_url?: string
  }
}

export function AdminHeader({ onMenuToggle, user }: AdminHeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/signin')
  }

  // Mock notifications - replace with real data
  const notifications = [
    {
      id: 1,
      title: 'New comment on "Building Modern Apps"',
      time: '5 minutes ago',
      unread: true
    },
    {
      id: 2,
      title: 'User registration: john@example.com',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      title: 'Weekly analytics report ready',
      time: '2 hours ago',
      unread: false
    }
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>

          {/* Search */}
          <div className="hidden md:block ml-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search posts, users, comments..."
                className="block w-80 pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Mobile search button */}
          <button className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700">
            <MagnifyingGlassIcon className="w-6 h-6" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 relative"
            >
              <BellIcon className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                        notification.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="p-4">
                  <Link
                    href="/admin/notifications"
                    className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
            >
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name || user.email || 'User'}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <UserCircleIcon className="w-8 h-8" />
              )}
              <span className="hidden md:block ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.full_name || user?.email || 'Admin'}
              </span>
            </button>

            {/* Profile dropdown menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.full_name || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
                <div className="py-2">
                  <Link
                    href="/profile/edit"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <UserIcon className="w-4 h-4 mr-3" />
                    Profile Settings
                  </Link>
                  <Link
                    href="/admin/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <CogIcon className="w-4 h-4 mr-3" />
                    Admin Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(isProfileOpen || isNotificationsOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsProfileOpen(false)
            setIsNotificationsOpen(false)
          }}
        />
      )}
    </header>
  )
}
