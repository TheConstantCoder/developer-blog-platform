#!/usr/bin/env node

/**
 * Test Profile Creation for Existing User
 * 
 * This script tests if we can create a profile for the existing auth user
 * and then tries to create a new test user.
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

async function testProfileCreation() {
  console.log('🧪 Testing Profile Creation...\n');

  try {
    // Test 1: Create profile for existing user
    console.log('1️⃣ Creating profile for existing user...');
    const existingUserId = 'd3f6bc9b-3b3d-4bc6-952f-d804aa4608b0';
    
    const { data: profile, error: profileError } = await supabase
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

    if (profileError) {
      console.log('❌ Profile creation failed:', profileError.message);
      if (profileError.code === '23505') {
        console.log('ℹ️  Profile already exists, trying to fetch it...');
        
        const { data: existingProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', existingUserId)
          .single();
          
        if (fetchError) {
          console.log('❌ Cannot fetch existing profile:', fetchError.message);
        } else {
          console.log('✅ Found existing profile:', existingProfile.email);
        }
      }
    } else {
      console.log('✅ Profile created successfully');
      console.log(`   Email: ${profile.email}`);
      console.log(`   Role: ${profile.role}`);
    }

    // Test 2: Try creating a new test user with a different approach
    console.log('\n2️⃣ Testing new user creation with different parameters...');
    
    const testEmail = `test-${Date.now()}@example.com`;
    console.log(`   Attempting to create: ${testEmail}`);
    
    const { data: newUser, error: newUserError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: 'TestPassword123!',
      email_confirm: true,
      user_metadata: {
        full_name: 'Test User'
      }
    });

    if (newUserError) {
      console.log('❌ New user creation failed:', newUserError.message);
      console.log('   Error code:', newUserError.status);
      console.log('   Full error:', JSON.stringify(newUserError, null, 2));
    } else {
      console.log('✅ New user created successfully!');
      console.log(`   User ID: ${newUser.user.id}`);
      console.log(`   Email: ${newUser.user.email}`);
      
      // Try to create profile for new user
      console.log('\n3️⃣ Creating profile for new user...');
      const { data: newProfile, error: newProfileError } = await supabase
        .from('profiles')
        .insert({
          id: newUser.user.id,
          email: newUser.user.email,
          full_name: 'Test User',
          role: 'user',
          bio: 'Test user for seeding',
          is_public: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (newProfileError) {
        console.log('❌ New profile creation failed:', newProfileError.message);
      } else {
        console.log('✅ New profile created successfully');
        console.log(`   Profile: ${newProfile.email} (${newProfile.role})`);
      }
      
      // Clean up test user
      console.log('\n4️⃣ Cleaning up test user...');
      const { error: deleteError } = await supabase.auth.admin.deleteUser(newUser.user.id);
      if (deleteError) {
        console.log('⚠️  Could not delete test user:', deleteError.message);
      } else {
        console.log('✅ Test user cleaned up');
      }
    }

    // Test 3: Check current profiles
    console.log('\n5️⃣ Checking current profiles...');
    const { data: allProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, full_name, role')
      .limit(10);
    
    if (profilesError) {
      console.log('❌ Cannot fetch profiles:', profilesError.message);
    } else {
      console.log(`✅ Found ${allProfiles.length} profiles:`);
      allProfiles.forEach(p => {
        console.log(`   - ${p.email} (${p.role}) - ID: ${p.id.substring(0, 8)}...`);
      });
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

async function main() {
  await testProfileCreation();
  
  console.log('\n📋 Summary:');
  console.log('If profile creation worked, we can proceed with seeding.');
  console.log('If user creation still fails, we may need to check other auth settings.');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testProfileCreation };
