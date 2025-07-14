// Test utilities for database operations
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Create test client with service role for admin operations
export function createTestClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Create client with anon key for guest operations
export function createAnonClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Test data generators
export const testData = {
  profile: {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'test@example.com',
    full_name: 'Test User',
    bio: 'Test user bio',
    role: 'user' as const,
    github_username: 'testuser',
    website_url: 'https://testuser.dev',
    location: 'Test City',
    is_public: true
  },
  
  adminProfile: {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'admin@example.com',
    full_name: 'Admin User',
    bio: 'Admin user bio',
    role: 'admin' as const,
    github_username: 'adminuser',
    website_url: 'https://admin.dev',
    location: 'Admin City',
    is_public: true
  },
  
  post: {
    title: 'Test Blog Post',
    slug: 'test-blog-post',
    excerpt: 'This is a test blog post excerpt',
    content: 'This is the full content of the test blog post. It contains multiple sentences to test reading time calculation.',
    status: 'published' as const,
    meta_title: 'Test Blog Post - Meta Title',
    meta_description: 'Test blog post meta description'
  },
  
  draftPost: {
    title: 'Draft Blog Post',
    slug: 'draft-blog-post',
    excerpt: 'This is a draft blog post',
    content: 'This is draft content that should not be visible to guests.',
    status: 'draft' as const
  },
  
  project: {
    title: 'Test Project',
    slug: 'test-project',
    description: 'A test project description',
    content: 'Detailed project content',
    demo_url: 'https://demo.example.com',
    github_url: 'https://github.com/user/test-project',
    tech_stack: ['React', 'TypeScript', 'Supabase'],
    status: 'active' as const,
    featured: true,
    is_public: true
  },
  
  privateProject: {
    title: 'Private Project',
    slug: 'private-project',
    description: 'A private project',
    content: 'Private project content',
    status: 'active' as const,
    featured: false,
    is_public: false
  },
  
  tag: {
    name: 'React',
    slug: 'react',
    description: 'React JavaScript library',
    color: '#61DAFB'
  },
  
  comment: {
    content: 'This is a test comment on the blog post.',
    is_approved: true
  },
  
  newsletterSubscriber: {
    email: 'subscriber@example.com',
    is_active: true,
    is_confirmed: true
  }
}

// Cleanup utilities
export async function cleanupTestData(supabase: ReturnType<typeof createTestClient>) {
  // Clean up in reverse order of dependencies
  await supabase.from('comments').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('post_tags').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('project_tags').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('newsletter_subscribers').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('posts').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('tags').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000')
}

// Test result helpers
export function expectSuccess<T>(result: { data: T | null; error: any }) {
  if (result.error) {
    throw new Error(`Expected success but got error: ${result.error.message}`)
  }
  return result.data!
}

export function expectError(result: { data: any; error: any }) {
  if (!result.error) {
    throw new Error('Expected error but operation succeeded')
  }
  return result.error
}

// RLS test helpers
export async function testRLSPolicy(
  operation: () => Promise<any>,
  shouldSucceed: boolean,
  description: string
) {
  try {
    const result = await operation()
    if (shouldSucceed) {
      if (result.error) {
        throw new Error(`${description}: Expected success but got error: ${result.error.message}`)
      }
      return { success: true, data: result.data }
    } else {
      if (!result.error) {
        throw new Error(`${description}: Expected error but operation succeeded`)
      }
      return { success: false, error: result.error }
    }
  } catch (error) {
    if (shouldSucceed) {
      throw new Error(`${description}: Unexpected error: ${error}`)
    }
    return { success: false, error }
  }
}
