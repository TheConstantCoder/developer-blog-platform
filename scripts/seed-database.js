#!/usr/bin/env node

/**
 * Database Seeding Script for Developer Blog Platform
 * 
 * This script populates the database with realistic test data including:
 * - User profiles (admin and regular users)
 * - Blog posts with rich content
 * - Portfolio projects
 * - Tags and categorization
 * - Comments and interactions
 * 
 * Usage: node scripts/seed-database.js
 * Environment: Development only (safety checks included)
 */

const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config(); // Also load .env if it exists

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Safety check - only run in development
if (process.env.NODE_ENV === 'production') {
  console.error('❌ This script should not be run in production!');
  process.exit(1);
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Initialize Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Utility functions
function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Sample data generators
const generateUsers = () => [
  {
    email: 'glenn@example.com',
    full_name: 'Glenn Geraghty',
    bio: 'Full-stack developer passionate about building scalable web applications. Experienced in React, Node.js, and cloud technologies. Always learning and sharing knowledge through code and writing.',
    role: 'admin',
    github_username: 'TheConstantCoder',
    website_url: 'https://glenngeraghty.dev',
    location: 'Dublin, Ireland',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    is_public: true
  },
  {
    email: 'sarah.dev@example.com',
    full_name: 'Sarah Chen',
    bio: 'Frontend specialist with a passion for user experience and modern JavaScript frameworks. Love creating beautiful, accessible interfaces that users enjoy.',
    role: 'user',
    github_username: 'sarahchen',
    website_url: 'https://sarahchen.dev',
    location: 'San Francisco, CA',
    avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    is_public: true
  },
  {
    email: 'alex.backend@example.com',
    full_name: 'Alex Rodriguez',
    bio: 'Backend engineer focused on scalable architectures and DevOps. Experienced with microservices, containers, and cloud infrastructure.',
    role: 'user',
    github_username: 'alexrod',
    website_url: null,
    location: 'Austin, TX',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    is_public: true
  },
  {
    email: 'maria.fullstack@example.com',
    full_name: 'Maria Santos',
    bio: 'Full-stack developer and tech lead with expertise in React, Python, and database design. Mentor and advocate for diversity in tech.',
    role: 'moderator',
    github_username: 'mariasantos',
    website_url: 'https://mariasantos.tech',
    location: 'Barcelona, Spain',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    is_public: true
  }
];

const generateTags = () => [
  // Technology Tags
  { name: 'React', slug: 'react', description: 'JavaScript library for building user interfaces', color: '#61DAFB' },
  { name: 'Next.js', slug: 'nextjs', description: 'React framework for production applications', color: '#000000' },
  { name: 'TypeScript', slug: 'typescript', description: 'Typed superset of JavaScript', color: '#3178C6' },
  { name: 'Node.js', slug: 'nodejs', description: 'JavaScript runtime for server-side development', color: '#339933' },
  { name: 'Supabase', slug: 'supabase', description: 'Open source Firebase alternative', color: '#3ECF8E' },
  { name: 'Tailwind CSS', slug: 'tailwind-css', description: 'Utility-first CSS framework', color: '#06B6D4' },
  { name: 'PostgreSQL', slug: 'postgresql', description: 'Advanced open source relational database', color: '#336791' },
  { name: 'Python', slug: 'python', description: 'High-level programming language', color: '#3776AB' },
  { name: 'Docker', slug: 'docker', description: 'Platform for developing and running applications in containers', color: '#2496ED' },
  { name: 'AWS', slug: 'aws', description: 'Amazon Web Services cloud platform', color: '#FF9900' },
  
  // Topic Tags
  { name: 'Web Development', slug: 'web-development', description: 'Building applications for the web', color: '#FF6B6B' },
  { name: 'Full Stack', slug: 'full-stack', description: 'End-to-end application development', color: '#4ECDC4' },
  { name: 'Frontend', slug: 'frontend', description: 'User interface and experience development', color: '#45B7D1' },
  { name: 'Backend', slug: 'backend', description: 'Server-side application development', color: '#96CEB4' },
  { name: 'DevOps', slug: 'devops', description: 'Development and operations practices', color: '#FFEAA7' },
  { name: 'Database Design', slug: 'database-design', description: 'Designing efficient database schemas', color: '#DDA0DD' },
  { name: 'Authentication', slug: 'authentication', description: 'User identity and access management', color: '#98D8C8' },
  
  // Content Type Tags
  { name: 'Tutorial', slug: 'tutorial', description: 'Step-by-step learning content', color: '#74B9FF' },
  { name: 'Best Practices', slug: 'best-practices', description: 'Recommended approaches and patterns', color: '#00B894' },
  { name: 'Case Study', slug: 'case-study', description: 'Real-world project analysis', color: '#FDCB6E' },
  { name: 'Opinion', slug: 'opinion', description: 'Personal thoughts and perspectives', color: '#E17055' }
];

const generateBlogPosts = () => [
  {
    title: 'Building a Modern Blog Platform with Next.js 14 and Supabase',
    slug: 'building-modern-blog-nextjs-supabase',
    excerpt: 'Learn how to create a full-featured blog platform using the latest Next.js features, Supabase for backend services, and TypeScript for type safety.',
    content: `# Building a Modern Blog Platform with Next.js 14 and Supabase

In this comprehensive guide, we'll walk through building a modern blog platform from scratch using Next.js 14, Supabase, and TypeScript. This project demonstrates real-world application development with authentication, database design, and deployment.

## Why This Tech Stack?

**Next.js 14** brings us the latest React features with excellent performance optimizations, server-side rendering, and the new App Router. **Supabase** provides a complete backend solution with PostgreSQL, authentication, and real-time capabilities. **TypeScript** ensures type safety and better developer experience.

## Project Architecture

Our blog platform includes:
- User authentication with OAuth (GitHub, Google)
- Role-based access control (admin, user, moderator)
- Blog post creation and management
- Project portfolio showcase
- Comment system with moderation
- Tag-based content organization

## Database Schema Design

We designed a comprehensive schema with proper relationships:

\`\`\`sql
-- Core tables: profiles, posts, projects, tags
-- Junction tables: post_tags, project_tags, comments
-- Row Level Security (RLS) for data protection
\`\`\`

## Authentication Implementation

Using Supabase Auth with Next.js middleware for route protection:

\`\`\`typescript
// Middleware for protecting routes
export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient({ req: request });
  const { data: { session } } = await supabase.auth.getSession();

  // Route protection logic
}
\`\`\`

## Key Features Implemented

1. **Content Management**: Rich text editor with markdown support
2. **User Profiles**: Public profiles with social links
3. **Admin Dashboard**: User and content management
4. **SEO Optimization**: Meta tags, sitemaps, structured data
5. **Responsive Design**: Mobile-first approach with Tailwind CSS

## Performance Optimizations

- Server-side rendering for better SEO
- Image optimization with Next.js Image component
- Database query optimization with proper indexing
- Caching strategies for frequently accessed data

## Deployment and DevOps

The application is deployed on Vercel with:
- Automatic deployments from GitHub
- Environment variable management
- Database migrations with Supabase CLI
- Monitoring and analytics integration

## Lessons Learned

Building this platform taught us valuable lessons about:
- Database design for multi-tenant applications
- Authentication flow complexity
- Performance optimization techniques
- User experience considerations

## Next Steps

Future enhancements could include:
- Real-time notifications
- Advanced search functionality
- Content analytics dashboard
- Mobile application

This project serves as a solid foundation for any content-driven application and demonstrates modern web development best practices.`,
    featured_image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
    status: 'published',
    meta_title: 'Building a Modern Blog Platform with Next.js 14 and Supabase',
    meta_description: 'Complete guide to building a full-featured blog platform using Next.js 14, Supabase, and TypeScript with authentication and content management.',
    tags: ['Next.js', 'Supabase', 'TypeScript', 'Web Development', 'Full Stack', 'Tutorial']
  },
  {
    title: 'TypeScript Best Practices for React Applications in 2024',
    slug: 'typescript-best-practices-react-2024',
    excerpt: 'Discover the latest TypeScript patterns and best practices for building robust React applications with better type safety and developer experience.',
    content: `# TypeScript Best Practices for React Applications in 2024

TypeScript has become the standard for building large-scale React applications. In this post, we'll explore the latest best practices and patterns that will make your React TypeScript code more maintainable and type-safe.

## Component Type Definitions

### Functional Components with Props

\`\`\`typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  size = 'md',
  children,
  onClick,
  disabled = false
}) => {
  return (
    <button
      className={\`btn btn-\${variant} btn-\${size}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
\`\`\`

## Advanced Type Patterns

### Generic Components

\`\`\`typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}
\`\`\`

## State Management with TypeScript

### Using useState with Complex Types

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
}

const [user, setUser] = useState<User | null>(null);
const [users, setUsers] = useState<User[]>([]);
\`\`\`

### Custom Hooks with TypeScript

\`\`\`typescript
interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function useApi<T>(url: string): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
\`\`\`

## Form Handling Best Practices

### Type-Safe Form Validation

\`\`\`typescript
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be at least 18 years old')
});

type UserFormData = z.infer<typeof userSchema>;

const UserForm: React.FC = () => {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    age: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = userSchema.safeParse(formData);
    if (result.success) {
      // Handle valid form data
      console.log(result.data);
    } else {
      // Handle validation errors
      console.log(result.error.issues);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
\`\`\`

## API Integration Patterns

### Type-Safe API Calls

\`\`\`typescript
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  createdAt: string;
}

async function fetchPosts(): Promise<ApiResponse<Post[]>> {
  const response = await fetch('/api/posts');
  return response.json();
}

async function createPost(post: Omit<Post, 'id' | 'createdAt'>): Promise<ApiResponse<Post>> {
  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post)
  });
  return response.json();
}
\`\`\`

## Performance Optimization

### Memoization with TypeScript

\`\`\`typescript
interface ExpensiveComponentProps {
  data: ComplexData[];
  onItemClick: (id: string) => void;
}

const ExpensiveComponent = React.memo<ExpensiveComponentProps>(({
  data,
  onItemClick
}) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: true
    }));
  }, [data]);

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id} onClick={() => onItemClick(item.id)}>
          {item.name}
        </div>
      ))}
    </div>
  );
});
\`\`\`

## Testing TypeScript React Components

\`\`\`typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with correct variant class', () => {
    render(<Button variant="primary">Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-primary');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button variant="primary" onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
\`\`\`

## Conclusion

These TypeScript patterns will help you build more robust React applications with better type safety, improved developer experience, and easier maintenance. Remember to:

1. Use strict TypeScript configuration
2. Leverage utility types for better code reuse
3. Implement proper error handling
4. Write comprehensive tests
5. Keep types close to their usage

TypeScript continues to evolve, and staying up-to-date with the latest features and patterns will keep your React applications modern and maintainable.`,
    featured_image_url: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
    status: 'published',
    meta_title: 'TypeScript Best Practices for React Applications in 2024',
    meta_description: 'Learn the latest TypeScript patterns and best practices for building robust React applications with better type safety.',
    tags: ['TypeScript', 'React', 'Best Practices', 'Frontend', 'Tutorial']
  },
  {
    title: 'Implementing Authentication with Supabase and Next.js',
    slug: 'authentication-supabase-nextjs',
    excerpt: 'Complete guide to implementing secure authentication in Next.js applications using Supabase Auth with OAuth providers and row-level security.',
    content: `# Implementing Authentication with Supabase and Next.js

Authentication is a critical component of modern web applications. In this guide, we'll implement a complete authentication system using Supabase Auth and Next.js, including OAuth providers, protected routes, and role-based access control.

## Setting Up Supabase Auth

First, let's configure Supabase Auth in our Next.js application:

\`\`\`bash
npm install @supabase/auth-helpers-nextjs @supabase/supabase-js
\`\`\`

### Environment Configuration

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

## OAuth Provider Setup

### GitHub OAuth Configuration

1. Create a GitHub OAuth App in your GitHub settings
2. Configure the callback URL: \`https://your-project.supabase.co/auth/v1/callback\`
3. Add the credentials to Supabase Dashboard

### Google OAuth Configuration

1. Create a Google OAuth 2.0 client in Google Cloud Console
2. Configure authorized redirect URIs
3. Add credentials to Supabase

## Authentication Components

### Sign In Component

\`\`\`typescript
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();

  const handleGitHubSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: \`\${location.origin}/auth/callback\`
      }
    });

    if (error) {
      console.error('Error signing in:', error.message);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: \`\${location.origin}/auth/callback\`
      }
    });

    if (error) {
      console.error('Error signing in:', error.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>

      <div className="space-y-4">
        <button
          onClick={handleGitHubSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Continue with GitHub
        </button>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
\`\`\`

## Middleware for Route Protection

\`\`\`typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protected routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  // Admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
};
\`\`\`

## User Profile Management

### Profile Creation Trigger

\`\`\`sql
-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
\`\`\`

## Row Level Security (RLS)

### Profile Policies

\`\`\`sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view public profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (is_public = true);

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
\`\`\`

## Authentication Context

\`\`\`typescript
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User } from '@supabase/auth-helpers-nextjs';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
\`\`\`

## Testing Authentication

\`\`\`typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import SignIn from './SignIn';

// Mock Supabase client
jest.mock('@supabase/auth-helpers-nextjs');

const mockSupabase = {
  auth: {
    signInWithOAuth: jest.fn(),
  },
};

(createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase);

describe('SignIn Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls GitHub OAuth when GitHub button is clicked', async () => {
    render(<SignIn />);

    const githubButton = screen.getByText('Continue with GitHub');
    fireEvent.click(githubButton);

    await waitFor(() => {
      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'github',
        options: {
          redirectTo: expect.stringContaining('/auth/callback')
        }
      });
    });
  });
});
\`\`\`

## Security Best Practices

1. **Always use HTTPS** in production
2. **Implement proper CSRF protection**
3. **Use secure session management**
4. **Validate user permissions** on both client and server
5. **Implement rate limiting** for authentication endpoints
6. **Log authentication events** for security monitoring

## Conclusion

This authentication implementation provides a solid foundation for secure user management in Next.js applications. The combination of Supabase Auth, OAuth providers, and proper middleware ensures both security and user experience.

Key takeaways:
- OAuth providers simplify user onboarding
- Middleware enables server-side route protection
- RLS policies provide database-level security
- Proper testing ensures reliability

Remember to always test your authentication flow thoroughly and keep security best practices in mind throughout development.`,
    featured_image_url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop',
    status: 'published',
    meta_title: 'Implementing Authentication with Supabase and Next.js',
    meta_description: 'Complete guide to implementing secure authentication in Next.js using Supabase Auth with OAuth providers and row-level security.',
    tags: ['Supabase', 'Next.js', 'Authentication', 'Security', 'Tutorial']
  },
  {
    title: 'Database Design Patterns for SaaS Applications',
    slug: 'database-design-patterns-saas',
    excerpt: 'Essential database design patterns and best practices for building scalable SaaS applications with PostgreSQL.',
    content: `# Database Design Patterns for SaaS Applications

Building a successful SaaS application requires careful database design from the start. In this post, we'll explore essential patterns and best practices for designing scalable, maintainable databases using PostgreSQL.

## Multi-Tenancy Patterns

### Row-Level Security (RLS)
PostgreSQL's RLS is perfect for SaaS applications:

\`\`\`sql
-- Enable RLS on tenant data
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy to isolate tenant data
CREATE POLICY tenant_isolation ON posts
  FOR ALL USING (tenant_id = current_setting('app.current_tenant')::uuid);
\`\`\`

### Shared Schema with Tenant ID
\`\`\`sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user'
);
\`\`\`

## Audit Trail Implementation

\`\`\`sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL, -- INSERT, UPDATE, DELETE
  old_values JSONB,
  new_values JSONB,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger function for audit logging
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log (table_name, record_id, action, old_values, user_id)
    VALUES (TG_TABLE_NAME, OLD.id, TG_OP, to_jsonb(OLD), current_setting('app.current_user_id')::uuid);
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_log (table_name, record_id, action, old_values, new_values, user_id)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(OLD), to_jsonb(NEW), current_setting('app.current_user_id')::uuid);
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log (table_name, record_id, action, new_values, user_id)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(NEW), current_setting('app.current_user_id')::uuid);
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
\`\`\`

## Performance Optimization

### Indexing Strategy
\`\`\`sql
-- Composite indexes for common queries
CREATE INDEX idx_posts_tenant_status ON posts(tenant_id, status);
CREATE INDEX idx_posts_created_at_desc ON posts(created_at DESC);

-- Partial indexes for specific conditions
CREATE INDEX idx_posts_published ON posts(tenant_id) WHERE status = 'published';
\`\`\`

### Query Optimization
\`\`\`sql
-- Use CTEs for complex queries
WITH recent_posts AS (
  SELECT * FROM posts
  WHERE created_at > NOW() - INTERVAL '30 days'
),
popular_posts AS (
  SELECT * FROM recent_posts
  WHERE view_count > 100
)
SELECT * FROM popular_posts ORDER BY view_count DESC;
\`\`\`

This pattern ensures maintainable and performant database operations for SaaS applications.`,
    featured_image_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop',
    status: 'published',
    meta_title: 'Database Design Patterns for SaaS Applications',
    meta_description: 'Essential database design patterns and best practices for building scalable SaaS applications with PostgreSQL.',
    tags: ['PostgreSQL', 'Database Design', 'SaaS', 'Backend', 'Best Practices']
  },
  {
    title: 'Optimizing Web Performance with Next.js 14',
    slug: 'optimizing-web-performance-nextjs-14',
    excerpt: 'Learn advanced performance optimization techniques for Next.js 14 applications including image optimization, caching strategies, and Core Web Vitals.',
    content: `# Optimizing Web Performance with Next.js 14

Web performance is crucial for user experience and SEO. Next.js 14 provides powerful tools for optimization. Let's explore advanced techniques to make your applications lightning fast.

## Image Optimization

### Next.js Image Component
\`\`\`typescript
import Image from 'next/image';

export function OptimizedImage() {
  return (
    <Image
      src="/hero-image.jpg"
      alt="Hero image"
      width={800}
      height={400}
      priority // Load above the fold images first
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  );
}
\`\`\`

### Dynamic Image Loading
\`\`\`typescript
import { useState } from 'react';
import Image from 'next/image';

export function LazyImageGallery({ images }: { images: string[] }) {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((src, index) => (
        <div key={index} className="relative aspect-square">
          <Image
            src={src}
            alt={\`Gallery image \${index + 1}\`}
            fill
            className="object-cover"
            loading="lazy"
            onLoad={() => setLoadedImages(prev => new Set(prev).add(index))}
          />
        </div>
      ))}
    </div>
  );
}
\`\`\`

## Caching Strategies

### Static Generation with ISR
\`\`\`typescript
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  return <PostContent post={post} />;
}

// Revalidate every hour
export const revalidate = 3600;
\`\`\`

### API Route Caching
\`\`\`typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const data = await fetchExpensiveData();

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
}
\`\`\`

## Code Splitting and Lazy Loading

### Dynamic Imports
\`\`\`typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false // Client-side only if needed
});

export function OptimizedPage() {
  const [showHeavy, setShowHeavy] = useState(false);

  return (
    <div>
      <button onClick={() => setShowHeavy(true)}>
        Load Heavy Component
      </button>
      {showHeavy && <HeavyComponent />}
    </div>
  );
}
\`\`\`

## Bundle Analysis and Optimization

### Analyzing Bundle Size
\`\`\`bash
npm install @next/bundle-analyzer
\`\`\`

\`\`\`javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  experimental: {
    optimizeCss: true,
  },
});
\`\`\`

### Tree Shaking Optimization
\`\`\`typescript
// Instead of importing entire library
import { debounce } from 'lodash';

// Import only what you need
import debounce from 'lodash/debounce';
\`\`\`

## Core Web Vitals Optimization

### Largest Contentful Paint (LCP)
\`\`\`typescript
// Preload critical resources
export function Head() {
  return (
    <>
      <link
        rel="preload"
        href="/fonts/inter.woff2"
        as="font"
        type="font/woff2"
        crossOrigin=""
      />
      <link
        rel="preload"
        href="/hero-image.jpg"
        as="image"
      />
    </>
  );
}
\`\`\`

### Cumulative Layout Shift (CLS)
\`\`\`css
/* Reserve space for dynamic content */
.skeleton {
  width: 100%;
  height: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
\`\`\`

Performance optimization is an ongoing process. Regular monitoring and testing ensure your Next.js application remains fast and user-friendly.`,
    featured_image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    status: 'published',
    meta_title: 'Optimizing Web Performance with Next.js 14',
    meta_description: 'Advanced performance optimization techniques for Next.js 14 applications including image optimization and Core Web Vitals.',
    tags: ['Next.js', 'Performance', 'Web Development', 'Optimization', 'Tutorial']
  }
];

const generateProjects = () => [
  {
    title: 'Developer Blog Platform',
    slug: 'developer-blog-platform',
    description: 'A modern, full-featured blog platform built with Next.js 14, Supabase, and TypeScript. Features include user authentication, role-based access control, content management, and a responsive design.',
    content: `# Developer Blog Platform

A comprehensive blog platform designed specifically for developers to share their knowledge, showcase projects, and build their online presence.

## Key Features

### Authentication & User Management
- OAuth integration with GitHub and Google
- Role-based access control (admin, user, moderator)
- User profiles with social links and bio
- Secure session management with Supabase Auth

### Content Management
- Rich markdown editor with live preview
- Image upload and optimization
- Tag-based content organization
- Draft and publish workflow
- SEO optimization with meta tags

### Project Portfolio
- Showcase development projects
- Technology stack highlighting
- Live demo and GitHub links
- Project status tracking
- Featured project system

### Admin Dashboard
- User management and role assignment
- Content moderation tools
- Analytics and site statistics
- System health monitoring

## Technical Implementation

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Hook Form** for form management
- **Zod** for validation

### Backend
- **Supabase** for database and authentication
- **PostgreSQL** with Row Level Security
- **RESTful API** design
- **Real-time subscriptions**

### DevOps
- **Vercel** deployment
- **GitHub Actions** for CI/CD
- **ESLint** and **Prettier** for code quality
- **Jest** for testing

## Database Schema

The platform uses a well-designed PostgreSQL schema with:
- User profiles and authentication
- Blog posts with metadata
- Project portfolio items
- Tag system for organization
- Comments with moderation
- Audit logging

## Performance Optimizations

- Server-side rendering for SEO
- Image optimization with Next.js Image
- Database query optimization
- Caching strategies
- Bundle size optimization

## Security Features

- Row Level Security (RLS) policies
- CSRF protection
- Input validation and sanitization
- Secure file uploads
- Rate limiting

This project demonstrates modern web development best practices and serves as a foundation for content-driven applications.`,
    featured_image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
    demo_url: 'https://developer-blog-platform.vercel.app',
    github_url: 'https://github.com/TheConstantCoder/developer-blog-platform',
    tech_stack: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind CSS', 'Vercel'],
    status: 'active',
    featured: true,
    tags: ['Next.js', 'Supabase', 'TypeScript', 'Full Stack', 'Web Development']
  },
  {
    title: 'Task Management SaaS',
    slug: 'task-management-saas',
    description: 'A comprehensive task management application with team collaboration features, real-time updates, and advanced project tracking capabilities.',
    content: `# Task Management SaaS

A powerful task management platform designed for teams and individuals to organize, track, and collaborate on projects efficiently.

## Core Features

### Project Management
- Create and organize projects
- Task assignment and tracking
- Deadline management
- Progress visualization
- Custom project templates

### Team Collaboration
- Real-time updates and notifications
- Team member management
- Role-based permissions
- Comment and discussion threads
- File sharing and attachments

### Advanced Tracking
- Time tracking and reporting
- Gantt charts and timelines
- Kanban boards
- Sprint planning and management
- Custom fields and labels

### Analytics & Reporting
- Project progress reports
- Team productivity metrics
- Time tracking analytics
- Custom dashboard views
- Export capabilities

## Technical Architecture

### Frontend
- **React** with **TypeScript**
- **Redux Toolkit** for state management
- **Material-UI** for components
- **React Query** for data fetching
- **Chart.js** for visualizations

### Backend
- **Node.js** with **Express**
- **PostgreSQL** database
- **Redis** for caching
- **Socket.io** for real-time features
- **JWT** authentication

### Infrastructure
- **Docker** containerization
- **AWS** cloud hosting
- **CloudFront** CDN
- **RDS** for database
- **ElastiCache** for Redis

## Key Achievements

- Served 10,000+ active users
- 99.9% uptime reliability
- Sub-200ms average response time
- Mobile-responsive design
- Multi-language support

## Challenges Solved

### Scalability
Implemented efficient database indexing and query optimization to handle large datasets and concurrent users.

### Real-time Synchronization
Built robust WebSocket connections with fallback mechanisms for reliable real-time updates across team members.

### Data Consistency
Designed conflict resolution strategies for concurrent edits and implemented optimistic updates for better UX.

This project showcases expertise in building scalable SaaS applications with complex business logic and real-time requirements.`,
    featured_image_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop',
    demo_url: 'https://taskmanager-demo.example.com',
    github_url: 'https://github.com/example/task-management-saas',
    tech_stack: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS', 'Docker'],
    status: 'completed',
    featured: true,
    tags: ['React', 'Node.js', 'PostgreSQL', 'SaaS', 'Full Stack']
  },
  {
    title: 'E-commerce Analytics Dashboard',
    slug: 'ecommerce-analytics-dashboard',
    description: 'Real-time analytics dashboard for e-commerce businesses with advanced data visualization, reporting, and business intelligence features.',
    content: `# E-commerce Analytics Dashboard

A comprehensive analytics platform that provides e-commerce businesses with deep insights into their sales, customer behavior, and market trends.

## Dashboard Features

### Sales Analytics
- Real-time sales tracking
- Revenue trend analysis
- Product performance metrics
- Geographic sales distribution
- Seasonal pattern recognition

### Customer Insights
- Customer lifetime value analysis
- Behavior flow visualization
- Segmentation and cohort analysis
- Churn prediction models
- Purchase pattern analysis

### Inventory Management
- Stock level monitoring
- Demand forecasting
- Supplier performance tracking
- Inventory turnover analysis
- Automated reorder alerts

### Marketing Analytics
- Campaign performance tracking
- ROI analysis and attribution
- A/B testing results
- Social media engagement metrics
- Email marketing analytics

## Technical Implementation

### Data Pipeline
- **Apache Kafka** for real-time data streaming
- **Apache Spark** for data processing
- **ClickHouse** for analytical queries
- **ETL pipelines** with **Apache Airflow**
- **Data validation** and quality checks

### Visualization
- **D3.js** for custom charts
- **React** with **TypeScript**
- **WebGL** for high-performance rendering
- **Real-time updates** with WebSockets
- **Interactive dashboards** with drill-down capabilities

### Backend Services
- **Python** with **FastAPI**
- **Microservices architecture**
- **GraphQL** API layer
- **Caching** with **Redis**
- **Background jobs** with **Celery**

## Performance Optimizations

### Query Performance
- Optimized analytical queries with proper indexing
- Materialized views for complex aggregations
- Query result caching strategies
- Parallel processing for large datasets

### Frontend Performance
- Virtual scrolling for large data tables
- Lazy loading of dashboard components
- Efficient chart rendering with canvas
- Progressive data loading

## Business Impact

- Reduced data analysis time by 80%
- Increased sales conversion by 15%
- Improved inventory efficiency by 25%
- Enhanced customer retention by 20%

## Key Challenges

### Data Volume
Handled processing of millions of transactions daily with efficient data partitioning and indexing strategies.

### Real-time Requirements
Implemented streaming data pipeline with sub-second latency for critical business metrics.

### Scalability
Designed horizontally scalable architecture to handle growing data volumes and user base.

This project demonstrates expertise in big data processing, real-time analytics, and building scalable data-driven applications.`,
    featured_image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    demo_url: 'https://analytics-dashboard-demo.example.com',
    github_url: 'https://github.com/example/ecommerce-analytics',
    tech_stack: ['Python', 'React', 'ClickHouse', 'Kafka', 'D3.js', 'FastAPI'],
    status: 'completed',
    featured: false,
    tags: ['Python', 'React', 'Analytics', 'Big Data', 'Dashboard']
  }
];

// Seeding functions
async function clearExistingData() {
  console.log('🧹 Clearing existing seeded data...');

  // Clear in reverse dependency order, but preserve existing user profiles
  const tables = [
    'post_tags',
    'project_tags',
    'comments',
    'newsletter_subscribers',
    'posts',
    'projects',
    'tags'
    // Note: NOT clearing profiles to preserve existing authenticated users
  ];

  for (const table of tables) {
    const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error && !error.message.includes('No rows found')) {
      console.warn(`⚠️  Warning clearing ${table}:`, error.message);
    }
  }

  console.log('✅ Existing seeded data cleared (profiles preserved)');
}

async function seedUsers() {
  console.log('👥 Seeding users...');
  console.log('ℹ️  Ensuring admin user exists for seeding');

  const existingUserId = 'd3f6bc9b-3b3d-4bc6-952f-d804aa4608b0';

  // Try to get existing profile
  let { data: profile, error: getError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', existingUserId)
    .single();

  if (getError && getError.code === 'PGRST116') {
    // Profile doesn't exist, create it
    console.log('   Creating admin profile...');
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert({
        id: existingUserId,
        email: 'geraghtyglenn@gmail.com',
        full_name: 'Glenn Geraghty',
        role: 'admin',
        bio: 'Platform administrator and developer',
        github_username: 'TheConstantCoder',
        website_url: 'https://glenngeraghty.dev',
        location: 'Dublin, Ireland',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        is_public: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (createError) {
      console.error('❌ Failed to create admin profile:', createError.message);
      return [];
    }
    profile = newProfile;
    console.log('✅ Created admin profile');
  } else if (getError) {
    console.error('❌ Error checking profile:', getError.message);
    return [];
  }

  console.log(`✅ Using admin user for seeding: ${profile.email} (${profile.role})`);
  return [profile];
}

async function seedTags() {
  console.log('🏷️  Seeding tags...');

  const tags = generateTags();
  const { data: insertedTags, error } = await supabase
    .from('tags')
    .insert(tags.map(tag => ({
      ...tag,
      created_at: getRandomDate(new Date('2024-01-01'), new Date()).toISOString()
    })))
    .select();

  if (error) {
    console.error('❌ Error seeding tags:', error.message);
    return [];
  }

  console.log(`✅ Seeded ${insertedTags.length} tags`);
  return insertedTags;
}

async function seedBlogPosts(users, tags) {
  console.log('📝 Seeding blog posts...');

  const posts = generateBlogPosts();
  const insertedPosts = [];

  for (const postData of posts) {
    // Assign random author (prefer admin for some posts)
    const author = Math.random() > 0.7
      ? users.find(u => u.role === 'admin') || users[0]
      : users[Math.floor(Math.random() * users.length)];

    const publishedDate = getRandomDate(new Date('2024-01-01'), new Date());
    const content = postData.content;

    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        author_id: author.id,
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt,
        content: content,
        featured_image_url: postData.featured_image_url,
        status: postData.status,
        published_at: publishedDate.toISOString(),
        meta_title: postData.meta_title,
        meta_description: postData.meta_description,
        reading_time: calculateReadingTime(content),
        view_count: Math.floor(Math.random() * 1000) + 50,
        created_at: publishedDate.toISOString(),
        updated_at: publishedDate.toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error(`❌ Error creating post ${postData.title}:`, error.message);
      continue;
    }

    // Add tags to post
    const postTags = postData.tags.map(tagName => {
      const tag = tags.find(t => t.name === tagName);
      return tag ? { post_id: post.id, tag_id: tag.id } : null;
    }).filter(Boolean);

    if (postTags.length > 0) {
      const { error: tagError } = await supabase
        .from('post_tags')
        .insert(postTags);

      if (tagError) {
        console.warn(`⚠️  Warning adding tags to post ${postData.title}:`, tagError.message);
      }
    }

    insertedPosts.push(post);
    console.log(`✅ Created post: ${postData.title}`);
  }

  console.log(`✅ Seeded ${insertedPosts.length} blog posts`);
  return insertedPosts;
}

async function seedProjects(users, tags) {
  console.log('🚀 Seeding projects...');

  const projects = generateProjects();
  const insertedProjects = [];

  for (const projectData of projects) {
    // Assign random author (prefer admin for featured projects)
    const author = projectData.featured
      ? users.find(u => u.role === 'admin') || users[0]
      : users[Math.floor(Math.random() * users.length)];

    const createdDate = getRandomDate(new Date('2023-06-01'), new Date());

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        author_id: author.id,
        title: projectData.title,
        slug: projectData.slug,
        description: projectData.description,
        content: projectData.content,
        featured_image_url: projectData.featured_image_url,
        demo_url: projectData.demo_url,
        github_url: projectData.github_url,
        tech_stack: projectData.tech_stack,
        status: projectData.status,
        featured: projectData.featured,
        is_public: true,
        created_at: createdDate.toISOString(),
        updated_at: createdDate.toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error(`❌ Error creating project ${projectData.title}:`, error.message);
      continue;
    }

    // Add tags to project
    const projectTags = projectData.tags.map(tagName => {
      const tag = tags.find(t => t.name === tagName);
      return tag ? { project_id: project.id, tag_id: tag.id } : null;
    }).filter(Boolean);

    if (projectTags.length > 0) {
      const { error: tagError } = await supabase
        .from('project_tags')
        .insert(projectTags);

      if (tagError) {
        console.warn(`⚠️  Warning adding tags to project ${projectData.title}:`, tagError.message);
      }
    }

    insertedProjects.push(project);
    console.log(`✅ Created project: ${projectData.title}`);
  }

  console.log(`✅ Seeded ${insertedProjects.length} projects`);
  return insertedProjects;
}

async function seedComments(posts, users) {
  console.log('💬 Seeding comments...');

  const comments = [
    {
      content: "Great article! This really helped me understand the authentication flow better. The code examples are particularly useful.",
      is_approved: true
    },
    {
      content: "Thanks for sharing this. I've been struggling with TypeScript patterns in React and this clears up a lot of confusion.",
      is_approved: true
    },
    {
      content: "Excellent deep dive into Next.js performance optimization. The image optimization section was especially helpful.",
      is_approved: true
    },
    {
      content: "This is exactly what I was looking for! The database design patterns will definitely help with my current project.",
      is_approved: true
    },
    {
      content: "Love the practical examples. Could you do a follow-up post on testing these authentication flows?",
      is_approved: true
    },
    {
      content: "Very comprehensive guide. The middleware implementation is clean and well-explained.",
      is_approved: true
    },
    {
      content: "Thanks for the detailed explanation. I'm implementing something similar and this gives me great direction.",
      is_approved: true
    },
    {
      content: "Bookmarked for future reference! The TypeScript patterns section is gold.",
      is_approved: true
    },
    {
      content: "Great work on this tutorial. The step-by-step approach makes it easy to follow along.",
      is_approved: true
    },
    {
      content: "This helped me solve a performance issue I was having. Much appreciated!",
      is_approved: true
    }
  ];

  const insertedComments = [];

  for (let i = 0; i < comments.length; i++) {
    const commentData = comments[i];
    const post = posts[Math.floor(Math.random() * posts.length)];
    const author = users[Math.floor(Math.random() * users.length)];
    const createdDate = getRandomDate(new Date(post.published_at), new Date());

    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        post_id: post.id,
        author_id: author.id,
        content: commentData.content,
        is_approved: commentData.is_approved,
        created_at: createdDate.toISOString(),
        updated_at: createdDate.toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error(`❌ Error creating comment:`, error.message);
      continue;
    }

    insertedComments.push(comment);
  }

  console.log(`✅ Seeded ${insertedComments.length} comments`);
  return insertedComments;
}

async function verifySeededData() {
  console.log('🔍 Verifying seeded data...');

  const verifications = [
    { table: 'profiles', description: 'users' },
    { table: 'tags', description: 'tags' },
    { table: 'posts', description: 'blog posts' },
    { table: 'projects', description: 'projects' },
    { table: 'post_tags', description: 'post-tag relationships' },
    { table: 'project_tags', description: 'project-tag relationships' },
    { table: 'comments', description: 'comments' }
  ];

  for (const { table, description } of verifications) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error(`❌ Error verifying ${description}:`, error.message);
    } else {
      console.log(`✅ ${description}: ${count} records`);
    }
  }

  // Verify relationships
  const { data: postsWithTags, error: postTagsError } = await supabase
    .from('posts')
    .select(`
      title,
      post_tags (
        tags (name)
      )
    `)
    .limit(1);

  if (postTagsError) {
    console.error('❌ Error verifying post-tag relationships:', postTagsError.message);
  } else if (postsWithTags && postsWithTags.length > 0) {
    console.log('✅ Post-tag relationships working correctly');
  }

  const { data: projectsWithTags, error: projectTagsError } = await supabase
    .from('projects')
    .select(`
      title,
      project_tags (
        tags (name)
      )
    `)
    .limit(1);

  if (projectTagsError) {
    console.error('❌ Error verifying project-tag relationships:', projectTagsError.message);
  } else if (projectsWithTags && projectsWithTags.length > 0) {
    console.log('✅ Project-tag relationships working correctly');
  }

  console.log('✅ Data verification complete');
}

// Main execution function
async function main() {
  console.log('🌱 Starting database seeding...');
  console.log('📅 Timestamp:', new Date().toISOString());

  try {
    // Test connection
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (error) {
      throw new Error(`Database connection failed: ${error.message}`);
    }
    console.log('✅ Database connection successful');

    // Clear existing data
    await clearExistingData();

    // Seed data in dependency order
    const users = await seedUsers();
    const tags = await seedTags();
    const posts = await seedBlogPosts(users, tags);
    const projects = await seedProjects(users, tags);
    const comments = await seedComments(posts, users);

    // Verify seeded data
    await verifySeededData();

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   🏷️  Tags: ${tags.length}`);
    console.log(`   📝 Posts: ${posts.length}`);
    console.log(`   🚀 Projects: ${projects.length}`);
    console.log(`   💬 Comments: ${comments.length}`);
    console.log('\n🔗 Next steps:');
    console.log('   1. Visit /blog to see the seeded blog posts');
    console.log('   2. Visit /projects to see the seeded projects');
    console.log('   3. Sign in to test the authentication flow');
    console.log('   4. Check /admin/dashboard if you have admin access');

  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the seeding script
if (require.main === module) {
  main().then(() => {
    console.log('\n✅ Seeding script completed');
    process.exit(0);
  }).catch((error) => {
    console.error('\n❌ Seeding script failed:', error);
    process.exit(1);
  });
}

module.exports = {
  main,
  clearExistingData,
  seedUsers,
  seedTags,
  seedBlogPosts,
  seedProjects,
  seedComments,
  verifySeededData
};
