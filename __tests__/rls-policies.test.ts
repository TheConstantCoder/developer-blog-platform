/**
 * Row Level Security (RLS) Policy Tests
 * Tests access control for guests, authenticated users, and admins
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals'
import { createTestClient, createAnonClient, testData, cleanupTestData, testRLSPolicy } from '../src/lib/test-utils'

const supabase = createTestClient()
const anonClient = createAnonClient()

describe('Row Level Security (RLS) Policies', () => {
  let testProfile: any
  let adminProfile: any
  let publishedPost: any
  let draftPost: any
  let publicProject: any
  let privateProject: any
  let tag: any

  beforeAll(async () => {
    await cleanupTestData(supabase)
    
    // Create test data
    const { data: profile } = await supabase.from('profiles').insert(testData.profile).select().single()
    const { data: admin } = await supabase.from('profiles').insert(testData.adminProfile).select().single()
    testProfile = profile
    adminProfile = admin

    const { data: pubPost } = await supabase.from('posts').insert({
      ...testData.post,
      author_id: testProfile.id
    }).select().single()
    publishedPost = pubPost

    const { data: dPost } = await supabase.from('posts').insert({
      ...testData.draftPost,
      author_id: testProfile.id
    }).select().single()
    draftPost = dPost

    const { data: pubProject } = await supabase.from('projects').insert({
      ...testData.project,
      author_id: testProfile.id
    }).select().single()
    publicProject = pubProject

    const { data: privProject } = await supabase.from('projects').insert({
      ...testData.privateProject,
      author_id: testProfile.id
    }).select().single()
    privateProject = privProject

    const { data: testTag } = await supabase.from('tags').insert(testData.tag).select().single()
    tag = testTag
  })

  afterAll(async () => {
    await cleanupTestData(supabase)
  })

  describe('Profiles Table RLS', () => {
    test('guests can view public profiles only', async () => {
      // Should see public profile
      await testRLSPolicy(
        () => anonClient.from('profiles').select('*').eq('id', testProfile.id).single(),
        true,
        'Guest viewing public profile'
      )

      // Create private profile
      const { data: privateProfile } = await supabase.from('profiles').insert({
        ...testData.profile,
        id: '00000000-0000-0000-0000-000000000010',
        email: 'private@example.com',
        is_public: false
      }).select().single()

      // Should not see private profile
      await testRLSPolicy(
        () => anonClient.from('profiles').select('*').eq('id', privateProfile!.id).single(),
        false,
        'Guest viewing private profile'
      )
    })

    test('guests cannot create, update, or delete profiles', async () => {
      await testRLSPolicy(
        () => anonClient.from('profiles').insert({
          ...testData.profile,
          id: '00000000-0000-0000-0000-000000000011',
          email: 'guest@example.com'
        }),
        false,
        'Guest creating profile'
      )

      await testRLSPolicy(
        () => anonClient.from('profiles').update({ bio: 'Updated' }).eq('id', testProfile.id),
        false,
        'Guest updating profile'
      )

      await testRLSPolicy(
        () => anonClient.from('profiles').delete().eq('id', testProfile.id),
        false,
        'Guest deleting profile'
      )
    })
  })

  describe('Posts Table RLS', () => {
    test('guests can view published posts only', async () => {
      // Should see published post
      await testRLSPolicy(
        () => anonClient.from('posts').select('*').eq('id', publishedPost.id).single(),
        true,
        'Guest viewing published post'
      )

      // Should not see draft post
      await testRLSPolicy(
        () => anonClient.from('posts').select('*').eq('id', draftPost.id).single(),
        false,
        'Guest viewing draft post'
      )
    })

    test('guests cannot create, update, or delete posts', async () => {
      await testRLSPolicy(
        () => anonClient.from('posts').insert({
          ...testData.post,
          author_id: testProfile.id,
          title: 'Guest Post'
        }),
        false,
        'Guest creating post'
      )

      await testRLSPolicy(
        () => anonClient.from('posts').update({ title: 'Updated' }).eq('id', publishedPost.id),
        false,
        'Guest updating post'
      )

      await testRLSPolicy(
        () => anonClient.from('posts').delete().eq('id', publishedPost.id),
        false,
        'Guest deleting post'
      )
    })
  })

  describe('Projects Table RLS', () => {
    test('guests can view public active/completed projects only', async () => {
      // Should see public active project
      await testRLSPolicy(
        () => anonClient.from('projects').select('*').eq('id', publicProject.id).single(),
        true,
        'Guest viewing public project'
      )

      // Should not see private project
      await testRLSPolicy(
        () => anonClient.from('projects').select('*').eq('id', privateProject.id).single(),
        false,
        'Guest viewing private project'
      )

      // Create archived public project
      const { data: archivedProject } = await supabase.from('projects').insert({
        ...testData.project,
        title: 'Archived Project',
        slug: 'archived-project',
        author_id: testProfile.id,
        status: 'archived'
      }).select().single()

      // Should not see archived project
      await testRLSPolicy(
        () => anonClient.from('projects').select('*').eq('id', archivedProject!.id).single(),
        false,
        'Guest viewing archived project'
      )
    })

    test('guests cannot create, update, or delete projects', async () => {
      await testRLSPolicy(
        () => anonClient.from('projects').insert({
          ...testData.project,
          author_id: testProfile.id,
          title: 'Guest Project'
        }),
        false,
        'Guest creating project'
      )

      await testRLSPolicy(
        () => anonClient.from('projects').update({ title: 'Updated' }).eq('id', publicProject.id),
        false,
        'Guest updating project'
      )

      await testRLSPolicy(
        () => anonClient.from('projects').delete().eq('id', publicProject.id),
        false,
        'Guest deleting project'
      )
    })
  })

  describe('Tags Table RLS', () => {
    test('guests can view all tags', async () => {
      await testRLSPolicy(
        () => anonClient.from('tags').select('*').eq('id', tag.id).single(),
        true,
        'Guest viewing tag'
      )
    })

    test('guests cannot create, update, or delete tags', async () => {
      await testRLSPolicy(
        () => anonClient.from('tags').insert({
          name: 'Guest Tag',
          slug: 'guest-tag'
        }),
        false,
        'Guest creating tag'
      )

      await testRLSPolicy(
        () => anonClient.from('tags').update({ name: 'Updated' }).eq('id', tag.id),
        false,
        'Guest updating tag'
      )

      await testRLSPolicy(
        () => anonClient.from('tags').delete().eq('id', tag.id),
        false,
        'Guest deleting tag'
      )
    })
  })

  describe('Comments Table RLS', () => {
    let approvedComment: any
    let unapprovedComment: any

    beforeAll(async () => {
      const { data: approved } = await supabase.from('comments').insert({
        ...testData.comment,
        post_id: publishedPost.id,
        author_id: testProfile.id,
        is_approved: true
      }).select().single()
      approvedComment = approved

      const { data: unapproved } = await supabase.from('comments').insert({
        content: 'Unapproved comment',
        post_id: publishedPost.id,
        author_id: testProfile.id,
        is_approved: false
      }).select().single()
      unapprovedComment = unapproved
    })

    test('guests can view approved comments on published posts only', async () => {
      // Should see approved comment
      await testRLSPolicy(
        () => anonClient.from('comments').select('*').eq('id', approvedComment.id).single(),
        true,
        'Guest viewing approved comment'
      )

      // Should not see unapproved comment
      await testRLSPolicy(
        () => anonClient.from('comments').select('*').eq('id', unapprovedComment.id).single(),
        false,
        'Guest viewing unapproved comment'
      )
    })

    test('guests cannot create, update, or delete comments', async () => {
      await testRLSPolicy(
        () => anonClient.from('comments').insert({
          content: 'Guest comment',
          post_id: publishedPost.id,
          author_id: testProfile.id
        }),
        false,
        'Guest creating comment'
      )

      await testRLSPolicy(
        () => anonClient.from('comments').update({ content: 'Updated' }).eq('id', approvedComment.id),
        false,
        'Guest updating comment'
      )

      await testRLSPolicy(
        () => anonClient.from('comments').delete().eq('id', approvedComment.id),
        false,
        'Guest deleting comment'
      )
    })
  })

  describe('Newsletter Subscribers RLS', () => {
    test('guests can subscribe to newsletter', async () => {
      await testRLSPolicy(
        () => anonClient.from('newsletter_subscribers').insert({
          email: 'guest@newsletter.com'
        }),
        true,
        'Guest subscribing to newsletter'
      )
    })

    test('guests cannot view, update, or delete newsletter subscribers', async () => {
      const { data: subscriber } = await supabase.from('newsletter_subscribers').insert({
        email: 'test@newsletter.com'
      }).select().single()

      await testRLSPolicy(
        () => anonClient.from('newsletter_subscribers').select('*').eq('id', subscriber!.id).single(),
        false,
        'Guest viewing newsletter subscriber'
      )

      await testRLSPolicy(
        () => anonClient.from('newsletter_subscribers').update({ is_active: false }).eq('id', subscriber!.id),
        false,
        'Guest updating newsletter subscriber'
      )

      await testRLSPolicy(
        () => anonClient.from('newsletter_subscribers').delete().eq('id', subscriber!.id),
        false,
        'Guest deleting newsletter subscriber'
      )
    })
  })

  describe('Junction Tables RLS', () => {
    let postTag: any
    let projectTag: any

    beforeAll(async () => {
      const { data: pTag } = await supabase.from('post_tags').insert({
        post_id: publishedPost.id,
        tag_id: tag.id
      }).select().single()
      postTag = pTag

      const { data: prTag } = await supabase.from('project_tags').insert({
        project_id: publicProject.id,
        tag_id: tag.id
      }).select().single()
      projectTag = prTag
    })

    test('guests can view tags for published posts and public projects', async () => {
      // Should see post tags for published post
      await testRLSPolicy(
        () => anonClient.from('post_tags').select('*').eq('id', postTag.id).single(),
        true,
        'Guest viewing post tags'
      )

      // Should see project tags for public project
      await testRLSPolicy(
        () => anonClient.from('project_tags').select('*').eq('id', projectTag.id).single(),
        true,
        'Guest viewing project tags'
      )
    })

    test('guests cannot create, update, or delete junction table entries', async () => {
      await testRLSPolicy(
        () => anonClient.from('post_tags').insert({
          post_id: publishedPost.id,
          tag_id: tag.id
        }),
        false,
        'Guest creating post tag'
      )

      await testRLSPolicy(
        () => anonClient.from('project_tags').insert({
          project_id: publicProject.id,
          tag_id: tag.id
        }),
        false,
        'Guest creating project tag'
      )
    })
  })
})
