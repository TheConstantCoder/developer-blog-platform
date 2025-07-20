import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types'

// Define user roles type
type UserRole = 'user' | 'admin' | 'moderator'

// Define route protection configuration
interface RouteConfig {
  path: string
  requiresAuth: boolean
  allowedRoles?: UserRole[]
  redirectTo?: string
}

const routeConfigs: RouteConfig[] = [
  // Admin login - public access (separate from main auth)
  { path: '/admin/login', requiresAuth: false },

  // Specific admin routes - require admin role, redirect to admin login
  { path: '/admin/dashboard', requiresAuth: true, allowedRoles: ['admin'], redirectTo: '/admin/login' },
  { path: '/admin/posts', requiresAuth: true, allowedRoles: ['admin'], redirectTo: '/admin/login' },
  { path: '/admin/projects', requiresAuth: true, allowedRoles: ['admin'], redirectTo: '/admin/login' },
  { path: '/admin/tags', requiresAuth: true, allowedRoles: ['admin'], redirectTo: '/admin/login' },
  { path: '/admin/comments', requiresAuth: true, allowedRoles: ['admin'], redirectTo: '/admin/login' },
  { path: '/admin/users', requiresAuth: true, allowedRoles: ['admin'], redirectTo: '/admin/login' },
  { path: '/admin/settings', requiresAuth: true, allowedRoles: ['admin'], redirectTo: '/admin/login' },

  // Catch-all admin routes - require admin role, redirect to admin login
  { path: '/admin', requiresAuth: true, allowedRoles: ['admin'], redirectTo: '/admin/login' },

  // Dashboard routes - require any authenticated user
  { path: '/dashboard', requiresAuth: true, allowedRoles: ['user', 'admin', 'moderator'] },

  // Profile edit routes - require authenticated user
  { path: '/profile/edit', requiresAuth: true, allowedRoles: ['user', 'admin', 'moderator'] },

  // Auth routes - redirect if already authenticated
  { path: '/auth/signin', requiresAuth: false, redirectTo: '/' },
  { path: '/auth/signup', requiresAuth: false, redirectTo: '/' },

  // Public routes - no authentication required
  { path: '/', requiresAuth: false },
  { path: '/blog', requiresAuth: false },
  { path: '/projects', requiresAuth: false },
  { path: '/auth/callback', requiresAuth: false },
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Create response first
  const response = NextResponse.next()

  // Create Supabase client for middleware
  const supabase = createMiddlewareClient<Database>({ req: request, res: response })

  // Find matching route configuration
  const routeConfig = routeConfigs.find(config =>
    pathname.startsWith(config.path)
  )

  // Add debug logging
  console.log(`[Middleware] ${pathname} - Route config:`, routeConfig?.path || 'none')

  try {
    // Get user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    console.log(`[Middleware] Session exists:`, !!session, 'User:', session?.user?.email || 'none')

    if (sessionError) {
      console.error('Session error in middleware:', sessionError)
    }

    // Handle route protection
    if (routeConfig) {
      const response = await handleRouteProtection(
        request,
        supabase,
        session,
        routeConfig,
        pathname
      )

      if (response) {
        return addSecurityHeaders(response)
      }
    } else {
      // For unmatched routes, check if it's an admin route and block it
      if (pathname.startsWith('/admin')) {
        console.log(`[Security] Blocking unmatched admin route: ${pathname}`)
        const adminLoginUrl = new URL('/admin/login', request.url)
        return NextResponse.redirect(adminLoginUrl)
      }
    }

    // Continue with security headers for unmatched routes
    return addSecurityHeaders(NextResponse.next())

  } catch (error) {
    console.error('Middleware error:', error)
    // On error, if it's an admin route, redirect to admin login for security
    if (pathname.startsWith('/admin')) {
      console.log(`[Security] Error on admin route, redirecting to login: ${pathname}`)
      const adminLoginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(adminLoginUrl)
    }
    // For other routes, continue with security headers
    return addSecurityHeaders(NextResponse.next())
  }
}

async function handleRouteProtection(
  request: NextRequest,
  supabase: any,
  session: any,
  routeConfig: RouteConfig,
  pathname: string
): Promise<NextResponse | null> {
  const user = session?.user

  console.log(`[Route Protection] Path: ${pathname}, User: ${user?.email || 'none'}, Config: ${routeConfig.path}`)

  // Handle auth routes - redirect if already authenticated
  if (pathname.startsWith('/auth/signin') || pathname.startsWith('/auth/signup')) {
    console.log(`[Auth Route] User authenticated: ${!!user}`)
    if (user) {
      const redirectUrl = new URL(routeConfig.redirectTo || '/', request.url)
      console.log(`[Auth Route] Redirecting authenticated user to: ${redirectUrl.toString()}`)
      return NextResponse.redirect(redirectUrl)
    }
    return null // Continue normally
  }

  // Handle routes that require authentication
  if (routeConfig.requiresAuth) {
    console.log(`[Protected Route] ${pathname} requires auth, user: ${!!user}`)

    if (!user) {
      // User not authenticated - redirect based on route type
      if (pathname.startsWith('/admin')) {
        // Admin routes redirect to admin login
        const adminLoginUrl = new URL('/admin/login', request.url)
        console.log(`[Protected Route] Redirecting to admin login: ${adminLoginUrl.toString()}`)
        return NextResponse.redirect(adminLoginUrl)
      } else {
        // Regular routes redirect to main signin
        const signInUrl = new URL('/auth/signin', request.url)
        signInUrl.searchParams.set('returnUrl', pathname)
        console.log(`[Protected Route] Redirecting to signin: ${signInUrl.toString()}`)
        return NextResponse.redirect(signInUrl)
      }
    }

    // User is authenticated - check role permissions if specified
    if (routeConfig.allowedRoles && routeConfig.allowedRoles.length > 0) {
      console.log(`[Role Check] Required roles: ${routeConfig.allowedRoles.join(', ')}`)

      try {
        // Fetch user profile to get role
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching user profile:', error)
          // On error, redirect to home for safety
          const homeUrl = new URL('/', request.url)
          return NextResponse.redirect(homeUrl)
        }

        const userRole = profile?.role as UserRole
        console.log(`[Role Check] User role: ${userRole}, allowed: ${routeConfig.allowedRoles.includes(userRole)}`)

        // Check if user role is allowed for this route
        if (!routeConfig.allowedRoles.includes(userRole)) {
          // User doesn't have required role - redirect with error
          const redirectUrl = new URL(routeConfig.redirectTo || '/', request.url)
          redirectUrl.searchParams.set('error', 'unauthorized')

          // Customize error message based on route
          if (pathname.startsWith('/admin')) {
            redirectUrl.searchParams.set('message', 'Admin access required. You need administrator privileges to access this page.')
          } else {
            redirectUrl.searchParams.set('message', 'You do not have permission to access this page.')
          }

          console.log(`[Role Check] Access denied, redirecting to: ${redirectUrl.toString()}`)
          return NextResponse.redirect(redirectUrl)
        }

        console.log(`[Role Check] Access granted for ${userRole}`)
      } catch (error) {
        console.error('Role check error:', error)
        // On error, redirect to home for safety
        const homeUrl = new URL('/', request.url)
        return NextResponse.redirect(homeUrl)
      }
    }
  }

  return null // Continue normally
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  // Security Headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.supabase.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' *.supabase.co wss://*.supabase.co; frame-ancestors 'none';"
  )

  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (robots file)
     * - sitemap.xml (sitemap file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
