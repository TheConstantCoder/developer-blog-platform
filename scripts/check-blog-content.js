#!/usr/bin/env node

/**
 * Check Blog Content Script
 * 
 * This script checks the actual content in the database for blog posts
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkBlogContent() {
  console.log('🔍 Checking blog post content...\n');

  try {
    // Get all posts with their content
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        content,
        status,
        published_at,
        reading_time,
        view_count,
        author:profiles(full_name, email),
        post_tags(
          tags(name, slug, color)
        )
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching posts:', error);
      return;
    }

    if (!posts || posts.length === 0) {
      console.log('❌ No published posts found');
      return;
    }

    console.log(`✅ Found ${posts.length} published posts:\n`);

    posts.forEach((post, index) => {
      console.log(`📝 Post ${index + 1}: ${post.title}`);
      console.log(`   Slug: ${post.slug}`);
      console.log(`   Author: ${post.author?.full_name || 'Unknown'} (${post.author?.email || 'No email'})`);
      console.log(`   Status: ${post.status}`);
      console.log(`   Published: ${post.published_at}`);
      console.log(`   Reading time: ${post.reading_time || 'Not set'} minutes`);
      console.log(`   View count: ${post.view_count || 0}`);
      console.log(`   Excerpt length: ${post.excerpt?.length || 0} characters`);
      console.log(`   Content length: ${post.content?.length || 0} characters`);
      
      if (post.post_tags && post.post_tags.length > 0) {
        const tags = post.post_tags.map(pt => pt.tags?.name).filter(Boolean);
        console.log(`   Tags: ${tags.join(', ')}`);
      } else {
        console.log(`   Tags: None`);
      }

      // Show first 200 characters of content
      if (post.content && post.content.length > 0) {
        console.log(`   Content preview: ${post.content.substring(0, 200)}...`);
      } else {
        console.log(`   ⚠️  No content found!`);
      }
      
      console.log(''); // Empty line between posts
    });

    // Test a specific post fetch (like the blog page would do)
    console.log('🔍 Testing individual post fetch...\n');
    
    const firstPost = posts[0];
    const { data: singlePost, error: singleError } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(
          id,
          full_name,
          avatar_url,
          bio,
          github_username,
          website_url
        ),
        post_tags(
          tags(
            id,
            name,
            slug,
            color
          )
        )
      `)
      .eq('slug', firstPost.slug)
      .eq('status', 'published')
      .single();

    if (singleError) {
      console.error('❌ Error fetching single post:', singleError);
    } else {
      console.log(`✅ Single post fetch successful: ${singlePost.title}`);
      console.log(`   Content length: ${singlePost.content?.length || 0} characters`);
      console.log(`   Tags: ${singlePost.post_tags?.length || 0} tags attached`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

if (require.main === module) {
  checkBlogContent().catch(console.error);
}

module.exports = { checkBlogContent };
