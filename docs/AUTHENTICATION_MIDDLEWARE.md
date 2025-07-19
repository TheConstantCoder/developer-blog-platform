# Authentication Middleware Documentation

## Overview

The authentication middleware provides comprehensive route protection and security for the developer blog platform. It implements role-based access control, session management, and security headers while maintaining a seamless user experience.

## Features

### 🛡️ Route Protection
- **Admin Routes** (`/admin/*`) - Require admin role
- **User Routes** (`/dashboard/*`, `/profile/edit`) - Require authentication
- **Auth Routes** (`/auth/signin`, `/auth/signup`) - Redirect if authenticated
- **Public Routes** (`/`, `/blog/*`, `/projects/*`) - Open access

### 🔐 Authentication & Authorization
- JWT token validation using Supabase auth helpers
- Role-based access control (user, admin, moderator)
- Session refresh handling for expired tokens
- Profile-based role checking from database

### 🔄 Redirect Logic
- Preserve destination URL for post-login redirect
- Error messages for unauthorized access
- Graceful handling of authentication failures
- Session storage for return URL persistence

### 🔒 Security Headers
- XSS Protection
- Frame Options (clickjacking prevention)
- Content Security Policy
- Content Type Options
- Permissions Policy

## Implementation Details

### Route Configuration

```typescript
const routeConfigs: RouteConfig[] = [
  // Admin routes - require admin role
  { path: '/admin', requiresAuth: true, allowedRoles: ['admin'], redirectTo: '/' },
  
  // Dashboard routes - require any authenticated user
  { path: '/dashboard', requiresAuth: true, allowedRoles: ['user', 'admin', 'moderator'] },
  
  // Profile edit routes - require authenticated user
  { path: '/profile/edit', requiresAuth: true, allowedRoles: ['user', 'admin', 'moderator'] },
  
  // Auth routes - redirect if already authenticated
  { path: '/auth/signin', requiresAuth: false, redirectTo: '/' },
  
  // Public routes - no authentication required
  { path: '/', requiresAuth: false },
  { path: '/blog', requiresAuth: false },
  { path: '/projects', requiresAuth: false },
]
```

### Authentication Flow

1. **Extract Session**: Get user session from Supabase auth helpers
2. **Route Matching**: Find matching route configuration
3. **Auth Check**: Verify authentication status if required
4. **Role Check**: Validate user role against allowed roles
5. **Redirect**: Handle unauthorized access with appropriate redirects
6. **Security**: Apply security headers to all responses

### Error Handling

- **Session Errors**: Log and continue with security headers
- **Database Errors**: Redirect to home page for safety
- **Network Errors**: Graceful degradation with security headers
- **User-Friendly Messages**: Clear error messages for unauthorized access

## Testing

### Manual Testing Scenarios

1. **Unauthenticated Access to Admin**
   ```
   Visit: /admin/dashboard
   Expected: Redirect to /auth/signin?returnUrl=/admin/dashboard
   ```

2. **Non-Admin Access to Admin**
   ```
   Login as regular user, visit: /admin/dashboard
   Expected: Redirect to /?error=unauthorized&message=...
   ```

3. **Authenticated User Dashboard**
   ```
   Login as any user, visit: /dashboard
   Expected: Allow access
   ```

4. **Already Authenticated Auth Page**
   ```
   While logged in, visit: /auth/signin
   Expected: Redirect to /
   ```

5. **Return URL Flow**
   ```
   Visit protected route → Login → Redirect to original destination
   ```

### Test Script

Run the middleware test script:
```bash
npm run test:middleware
```

## File Structure

```
src/
├── middleware.ts                    # Main middleware implementation
├── app/
│   ├── auth/
│   │   ├── signin/page.tsx         # Enhanced with return URL handling
│   │   └── callback/page.tsx       # Enhanced with return URL redirect
│   ├── admin/
│   │   └── dashboard/page.tsx      # Protected admin page
│   ├── dashboard/page.tsx          # Protected user page
│   ├── profile/
│   │   └── edit/page.tsx          # Protected profile edit page
│   └── page.tsx                   # Enhanced with error message display
├── components/
│   └── ui/
│       └── ErrorMessage.tsx       # Error message component
└── scripts/
    └── test-middleware-auth.js     # Middleware test script
```

## Security Considerations

### Headers Applied
- `X-XSS-Protection: 1; mode=block`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: origin-when-cross-origin`
- `Content-Security-Policy: [comprehensive policy]`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### Authentication Security
- JWT tokens validated on every request
- Role-based access control prevents privilege escalation
- Session refresh handled automatically
- Secure redirect handling prevents open redirects

### Error Handling Security
- No sensitive information exposed in error messages
- Graceful degradation on authentication failures
- Safe defaults (redirect to home) on errors

## Dependencies

- `@supabase/auth-helpers-nextjs` - Supabase auth helpers for Next.js middleware
- `@supabase/supabase-js` - Supabase client library
- Next.js middleware system

## Configuration

The middleware is configured to run on all routes except:
- API routes (`/api/*`)
- Static files (`/_next/static/*`)
- Image optimization (`/_next/image/*`)
- Favicon and robots files

## Future Enhancements

1. **Rate Limiting**: Add rate limiting for authentication attempts
2. **Audit Logging**: Log authentication and authorization events
3. **Session Management**: Advanced session timeout handling
4. **IP Restrictions**: Geographic or IP-based access controls
5. **MFA Support**: Multi-factor authentication integration
