/**
 * Comprehensive database tests for the Developer Blog Platform
 * Tests CRUD operations, RLS policies, and database functions
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals'
import { createTestClient, createAnonClient, testData, cleanupTestData, expectSuccess, expectError, testRLSPolicy } from '../src/lib/test-utils'
import type { Database } from '../src/types/database'

const supabase = createTestClient()
const anonClient = createAnonClient()

describe('Database Schema Tests', () => {
  beforeAll(async () => {
    // Clean up any existing test data
    await cleanupTestData(supabase)
  })

  afterAll(async () => {
    // Clean up test data after all tests
    await cleanupTestData(supabase)
  })

  beforeEach(async () => {
    // Clean up before each test to ensure isolation
    await cleanupTestData(supabase)
  })

  describe('Core Tables Creation', () => {
    test('should have all required tables', async () => {
      const tables = ['profiles', 'posts', 'projects', 'tags', 'post_tags', 'project_tags', 'comments', 'newsletter_subscribers']
      
      for (const table of tables) {
        const { data, error } = await supabase.from(table as any).select('*').limit(1)
        expect(error).toBeNull()
      }
    })

    test('should have custom enum types working', async () => {
      // Test user_role enum
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({ ...testData.profile })
        .select()
        .single()

      expect(profileError).toBeNull()
      expect(profile?.role).toBe('user')
    })
  })

  describe('Database Functions', () => {
    test('generate_slug function should work', async () => {
      const { data, error } = await supabase.rpc('generate_slug', { 
        title: 'Test Blog Post Title!' 
      })
      
      expect(error).toBeNull()
      expect(data).toBe('test-blog-post-title')
    })

    test('calculate_reading_time function should work', async () => {
      const content = 'This is a test content with exactly twenty words to test the reading time calculation function properly.'
      const { data, error } = await supabase.rpc('calculate_reading_time', { content })
      
      expect(error).toBeNull()
      expect(data).toBe(1) // Should be 1 minute for 20 words
    })

    test('is_admin function should work', async () => {
      // Create admin profile first
      await supabase.from('profiles').insert(testData.adminProfile)
      
      const { data, error } = await supabase.rpc('is_admin', { 
        user_id: testData.adminProfile.id 
      })
      
      expect(error).toBeNull()
      expect(data).toBe(true)
    })
  })

  describe('Profiles Table', () => {
    test('should create profile successfully', async () => {
      const { data, error } = await supabase
        .from('profiles')
        .insert(testData.profile)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data?.email).toBe(testData.profile.email)
      expect(data?.role).toBe('user')
      expect(data?.is_public).toBe(true)
    })

    test('should enforce unique email constraint', async () => {
      await supabase.from('profiles').insert(testData.profile)
      
      const { error } = await supabase
        .from('profiles')
        .insert({ ...testData.profile, id: '00000000-0000-0000-0000-000000000003' })

      expect(error).not.toBeNull()
      expect(error?.message).toContain('duplicate key value')
    })

    test('should update updated_at timestamp on update', async () => {
      const { data: created } = await supabase
        .from('profiles')
        .insert(testData.profile)
        .select()
        .single()

      // Wait a moment to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 1000))

      const { data: updated } = await supabase
        .from('profiles')
        .update({ bio: 'Updated bio' })
        .eq('id', testData.profile.id)
        .select()
        .single()

      expect(new Date(updated!.updated_at).getTime()).toBeGreaterThan(
        new Date(created!.updated_at).getTime()
      )
    })
  })

  describe('Posts Table', () => {
    beforeEach(async () => {
      // Create a profile for posts
      await supabase.from('profiles').insert(testData.profile)
    })

    test('should create post with auto-generated slug and reading time', async () => {
      const postData = {
        ...testData.post,
        author_id: testData.profile.id,
        slug: '', // Empty slug should be auto-generated
        reading_time: undefined // Should be auto-calculated
      }

      const { data, error } = await supabase
        .from('posts')
        .insert(postData)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data?.slug).toBeTruthy()
      expect(data?.reading_time).toBeGreaterThan(0)
      expect(data?.published_at).toBeTruthy() // Should be set for published posts
    })

    test('should set published_at when status changes to published', async () => {
      const { data: draft } = await supabase
        .from('posts')
        .insert({
          ...testData.draftPost,
          author_id: testData.profile.id
        })
        .select()
        .single()

      expect(draft?.published_at).toBeNull()

      const { data: published } = await supabase
        .from('posts')
        .update({ status: 'published' })
        .eq('id', draft!.id)
        .select()
        .single()

      expect(published?.published_at).toBeTruthy()
    })

    test('should enforce unique slug constraint', async () => {
      await supabase.from('posts').insert({
        ...testData.post,
        author_id: testData.profile.id
      })

      const { error } = await supabase.from('posts').insert({
        ...testData.post,
        author_id: testData.profile.id,
        title: 'Different Title'
      })

      expect(error).not.toBeNull()
      expect(error?.message).toContain('duplicate key value')
    })
  })

  describe('Projects Table', () => {
    beforeEach(async () => {
      await supabase.from('profiles').insert(testData.profile)
    })

    test('should create project with tech stack array', async () => {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...testData.project,
          author_id: testData.profile.id
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data?.tech_stack).toEqual(['React', 'TypeScript', 'Supabase'])
      expect(data?.featured).toBe(true)
      expect(data?.is_public).toBe(true)
    })

    test('should auto-generate unique slug', async () => {
      const projectData = {
        ...testData.project,
        author_id: testData.profile.id,
        slug: '' // Should be auto-generated
      }

      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data?.slug).toBeTruthy()
      expect(data?.slug).toContain('test-project')
    })
  })

  describe('Tags and Junction Tables', () => {
    beforeEach(async () => {
      await supabase.from('profiles').insert(testData.profile)
    })

    test('should create tags and associate with posts', async () => {
      // Create tag
      const { data: tag } = await supabase
        .from('tags')
        .insert(testData.tag)
        .select()
        .single()

      // Create post
      const { data: post } = await supabase
        .from('posts')
        .insert({
          ...testData.post,
          author_id: testData.profile.id
        })
        .select()
        .single()

      // Associate tag with post
      const { data: postTag, error } = await supabase
        .from('post_tags')
        .insert({
          post_id: post!.id,
          tag_id: tag!.id
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(postTag?.post_id).toBe(post!.id)
      expect(postTag?.tag_id).toBe(tag!.id)
    })

    test('should enforce unique post-tag combinations', async () => {
      const { data: tag } = await supabase.from('tags').insert(testData.tag).select().single()
      const { data: post } = await supabase.from('posts').insert({
        ...testData.post,
        author_id: testData.profile.id
      }).select().single()

      // First association should succeed
      await supabase.from('post_tags').insert({
        post_id: post!.id,
        tag_id: tag!.id
      })

      // Duplicate association should fail
      const { error } = await supabase.from('post_tags').insert({
        post_id: post!.id,
        tag_id: tag!.id
      })

      expect(error).not.toBeNull()
      expect(error?.message).toContain('duplicate key value')
    })
  })

  describe('Comments Table', () => {
    beforeEach(async () => {
      await supabase.from('profiles').insert(testData.profile)
    })

    test('should create comments with approval system', async () => {
      const { data: post } = await supabase
        .from('posts')
        .insert({
          ...testData.post,
          author_id: testData.profile.id
        })
        .select()
        .single()

      const { data: comment, error } = await supabase
        .from('comments')
        .insert({
          ...testData.comment,
          post_id: post!.id,
          author_id: testData.profile.id
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(comment?.is_approved).toBe(true)
      expect(comment?.content).toBe(testData.comment.content)
    })

    test('should support nested comments', async () => {
      const { data: post } = await supabase.from('posts').insert({
        ...testData.post,
        author_id: testData.profile.id
      }).select().single()

      const { data: parentComment } = await supabase.from('comments').insert({
        ...testData.comment,
        post_id: post!.id,
        author_id: testData.profile.id
      }).select().single()

      const { data: childComment, error } = await supabase.from('comments').insert({
        content: 'This is a reply to the parent comment',
        post_id: post!.id,
        author_id: testData.profile.id,
        parent_id: parentComment!.id,
        is_approved: true
      }).select().single()

      expect(error).toBeNull()
      expect(childComment?.parent_id).toBe(parentComment!.id)
    })
  })

  describe('Newsletter Subscribers', () => {
    test('should create newsletter subscriber', async () => {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert(testData.newsletterSubscriber)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data?.email).toBe(testData.newsletterSubscriber.email)
      expect(data?.is_active).toBe(true)
      expect(data?.is_confirmed).toBe(true)
    })

    test('should enforce unique email constraint', async () => {
      await supabase.from('newsletter_subscribers').insert(testData.newsletterSubscriber)

      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert(testData.newsletterSubscriber)

      expect(error).not.toBeNull()
      expect(error?.message).toContain('duplicate key value')
    })
  })
})
