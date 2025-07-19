#!/usr/bin/env node

/**
 * Test the complete seeding flow step by step
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

async function testSeedingFlow() {
  console.log('🧪 Testing Complete Seeding Flow...\n');

  try {
    // Step 1: Ensure we have a profile
    console.log('1️⃣ Ensuring admin profile exists...');
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
        console.error('❌ Failed to create profile:', createError.message);
        return;
      }
      profile = newProfile;
    } else if (getError) {
      console.error('❌ Error checking profile:', getError.message);
      return;
    }

    console.log(`✅ Admin profile ready: ${profile.email} (${profile.role})`);

    // Step 2: Clear existing seeded data (but not profiles)
    console.log('\n2️⃣ Clearing existing seeded data...');
    const tables = ['post_tags', 'project_tags', 'comments', 'posts', 'projects', 'tags'];
    
    for (const table of tables) {
      const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error && !error.message.includes('No rows found')) {
        console.warn(`⚠️  Warning clearing ${table}:`, error.message);
      }
    }
    console.log('✅ Seeded data cleared');

    // Step 3: Verify profile still exists
    console.log('\n3️⃣ Verifying profile still exists...');
    const { data: verifyProfile, error: verifyError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', existingUserId)
      .single();

    if (verifyError) {
      console.error('❌ Profile verification failed:', verifyError.message);
      return;
    }
    console.log(`✅ Profile verified: ${verifyProfile.email}`);

    // Step 4: Test tag creation
    console.log('\n4️⃣ Testing tag creation...');
    const testTags = [
      { name: 'React', slug: 'react', description: 'JavaScript library for building user interfaces', color: '#61DAFB' },
      { name: 'Next.js', slug: 'nextjs', description: 'React framework for production applications', color: '#000000' }
    ];

    const { data: createdTags, error: tagsError } = await supabase
      .from('tags')
      .insert(testTags)
      .select();

    if (tagsError) {
      console.error('❌ Tag creation failed:', tagsError.message);
      return;
    }
    console.log(`✅ Created ${createdTags.length} test tags`);

    // Step 5: Test post creation
    console.log('\n5️⃣ Testing post creation...');
    const testPost = {
      author_id: profile.id,
      title: 'Test Blog Post',
      slug: 'test-blog-post',
      excerpt: 'This is a test blog post for seeding verification.',
      content: '# Test Blog Post\n\nThis is a test blog post created during the seeding process verification.',
      featured_image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
      status: 'published',
      published_at: new Date().toISOString(),
      meta_title: 'Test Blog Post',
      meta_description: 'Test blog post for seeding verification',
      reading_time: 1,
      view_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: createdPost, error: postError } = await supabase
      .from('posts')
      .insert(testPost)
      .select()
      .single();

    if (postError) {
      console.error('❌ Post creation failed:', postError.message);
      return;
    }
    console.log(`✅ Created test post: ${createdPost.title}`);

    // Step 6: Test post-tag relationship
    console.log('\n6️⃣ Testing post-tag relationship...');
    const { error: relationError } = await supabase
      .from('post_tags')
      .insert({
        post_id: createdPost.id,
        tag_id: createdTags[0].id
      });

    if (relationError) {
      console.error('❌ Post-tag relationship failed:', relationError.message);
      return;
    }
    console.log('✅ Post-tag relationship created');

    // Step 7: Verify everything
    console.log('\n7️⃣ Final verification...');
    const { data: finalCheck, error: finalError } = await supabase
      .from('posts')
      .select(`
        title,
        author:profiles(email, role),
        post_tags(tags(name))
      `)
      .eq('id', createdPost.id)
      .single();

    if (finalError) {
      console.error('❌ Final verification failed:', finalError.message);
      return;
    }

    console.log('✅ Final verification successful:');
    console.log(`   Post: ${finalCheck.title}`);
    console.log(`   Author: ${finalCheck.author.email} (${finalCheck.author.role})`);
    console.log(`   Tags: ${finalCheck.post_tags.map(pt => pt.tags.name).join(', ')}`);

    console.log('\n🎉 Seeding flow test completed successfully!');
    console.log('✅ All components are working correctly');
    console.log('✅ Ready to run full seeding script');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

if (require.main === module) {
  testSeedingFlow().catch(console.error);
}

module.exports = { testSeedingFlow };
