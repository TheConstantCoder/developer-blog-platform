#!/usr/bin/env node

/**
 * Supabase Auth Configuration Diagnostic Script
 * 
 * This script checks the current Supabase Auth configuration to identify
 * potential issues preventing user creation during seeding.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkAuthConfiguration() {
  console.log('🔍 Diagnosing Supabase Auth Configuration...\n');

  try {
    // Test 1: Check if we can connect to the database
    console.log('1️⃣ Testing database connection...');
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      return;
    }
    console.log('✅ Database connection successful\n');

    // Test 2: Check existing auth users
    console.log('2️⃣ Checking existing auth users...');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) {
      console.error('❌ Cannot list users:', usersError.message);
    } else {
      console.log(`✅ Found ${users.users?.length || 0} existing auth users`);
      if (users.users && users.users.length > 0) {
        console.log('   Existing users:');
        users.users.forEach(user => {
          console.log(`   - ${user.email} (${user.id})`);
        });
      }
    }
    console.log('');

    // Test 3: Check existing profiles
    console.log('3️⃣ Checking existing profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, full_name, role')
      .limit(10);
    
    if (profilesError) {
      console.error('❌ Cannot list profiles:', profilesError.message);
    } else {
      console.log(`✅ Found ${profiles?.length || 0} existing profiles`);
      if (profiles && profiles.length > 0) {
        console.log('   Existing profiles:');
        profiles.forEach(profile => {
          console.log(`   - ${profile.email} (${profile.role}) - ID: ${profile.id}`);
        });
      }
    }
    console.log('');

    // Test 4: Try creating a test user
    console.log('4️⃣ Testing user creation...');
    const testEmail = `test-${Date.now()}@example.com`;
    
    const { data: testUser, error: createError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: 'TestPassword123!',
      email_confirm: true,
      user_metadata: {
        full_name: 'Test User',
        test: true
      }
    });

    if (createError) {
      console.error('❌ User creation failed:', createError.message);
      console.log('   This indicates an auth configuration issue');
      
      // Common issues and solutions
      console.log('\n🔧 Possible solutions:');
      console.log('   1. Check if email confirmation is disabled in Supabase Dashboard');
      console.log('   2. Verify SMTP settings (or disable email confirmation)');
      console.log('   3. Check auth rate limiting settings');
      console.log('   4. Verify service role key permissions');
      
    } else {
      console.log('✅ Test user created successfully');
      console.log(`   User ID: ${testUser.user.id}`);
      console.log(`   Email: ${testUser.user.email}`);
      
      // Clean up test user
      const { error: deleteError } = await supabase.auth.admin.deleteUser(testUser.user.id);
      if (deleteError) {
        console.warn('⚠️  Could not delete test user:', deleteError.message);
      } else {
        console.log('✅ Test user cleaned up');
      }
    }
    console.log('');

    // Test 5: Check database triggers and functions
    console.log('5️⃣ Checking database functions...');
    const { data: functions, error: functionsError } = await supabase
      .rpc('handle_new_user')
      .catch(() => ({ data: null, error: null }));

    if (functionsError) {
      console.log('❌ handle_new_user function not accessible');
    } else {
      console.log('✅ handle_new_user function exists and is accessible');
    }

    // Test 6: Check if the existing user has a profile issue
    console.log('\n6️⃣ Checking existing user profile issue...');
    const existingUserId = 'd3f6bc9b-3b3d-4bc6-952f-d804aa4608b0';

    // Try to create a profile for the existing user
    const { data: newProfile, error: profileCreateError } = await supabase
      .from('profiles')
      .insert({
        id: existingUserId,
        email: 'geraghtyglenn@gmail.com',
        full_name: 'Glenn Geraghty',
        role: 'admin',
        bio: 'Platform administrator',
        is_public: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (profileCreateError) {
      console.log('❌ Cannot create profile for existing user:', profileCreateError.message);
    } else {
      console.log('✅ Created profile for existing user');
      console.log(`   Profile created for: ${newProfile.email} (${newProfile.role})`);
    }

  } catch (error) {
    console.error('❌ Diagnostic failed:', error.message);
  }
}

async function checkSupabaseSettings() {
  console.log('\n📋 Manual Checks Required:');
  console.log('');
  console.log('Please verify these settings in your Supabase Dashboard:');
  console.log('');
  console.log('🔐 Authentication Settings:');
  console.log('   1. Go to Authentication > Settings');
  console.log('   2. Check "Enable email confirmations" - should be DISABLED for development');
  console.log('   3. Check "Enable phone confirmations" - should be DISABLED');
  console.log('   4. Verify "Site URL" matches your development URL');
  console.log('');
  console.log('📧 Email Settings:');
  console.log('   1. Go to Authentication > Settings > SMTP Settings');
  console.log('   2. Either configure SMTP OR disable email confirmations');
  console.log('   3. For development, disabling email confirmations is recommended');
  console.log('');
  console.log('🔑 API Settings:');
  console.log('   1. Go to Settings > API');
  console.log('   2. Verify your service role key is correct');
  console.log('   3. Check that RLS is properly configured');
  console.log('');
  console.log('🗄️ Database Settings:');
  console.log('   1. Go to Database > Functions');
  console.log('   2. Verify handle_new_user() function exists');
  console.log('   3. Go to Database > Triggers');
  console.log('   4. Verify on_auth_user_created trigger exists');
  console.log('');
  console.log(`🌐 Your Supabase Dashboard: ${SUPABASE_URL.replace('/rest/v1', '')}`);
}

// Run diagnostics
async function main() {
  await checkAuthConfiguration();
  await checkSupabaseSettings();
  
  console.log('\n✅ Diagnostic complete');
  console.log('');
  console.log('Next steps:');
  console.log('1. Review the manual checks above');
  console.log('2. Make necessary changes in Supabase Dashboard');
  console.log('3. Run this diagnostic again to verify fixes');
  console.log('4. Then retry the seeding script');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { checkAuthConfiguration, checkSupabaseSettings };
