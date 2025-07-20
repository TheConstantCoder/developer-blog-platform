#!/usr/bin/env node

/**
 * Simple Admin Setup
 * 
 * This script simply updates your existing GitHub user to support password login
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

async function simpleAdminSetup() {
  console.log('🔐 Simple Admin Setup\n');
  
  try {
    // Find your existing GitHub profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'geraghtyglenn@gmail.com')
      .single();

    if (profileError || !profile) {
      console.log('❌ Could not find your GitHub profile');
      return;
    }

    console.log(`✅ Found your profile:`);
    console.log(`   Email: ${profile.email}`);
    console.log(`   Name: ${profile.full_name}`);
    console.log(`   Role: ${profile.role}`);
    console.log(`   ID: ${profile.id}\n`);

    // Update the user to support password authentication
    console.log('🔄 Adding password authentication...');
    
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
      profile.id,
      { 
        password: 'admin123456',
        email_confirm: true
      }
    );

    if (updateError) {
      console.error('❌ Error updating user authentication:', updateError);
      return;
    }

    console.log('✅ Successfully added password authentication!');

    // Test the login
    console.log('\n🧪 Testing login...');
    
    const { data: testLogin, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'geraghtyglenn@gmail.com',
      password: 'admin123456'
    });

    if (loginError) {
      console.error('❌ Login test failed:', loginError);
      
      // Let's try to see what users exist
      console.log('\n🔍 Checking existing users...');
      const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
      if (userData) {
        console.log(`Found ${userData.users.length} users:`);
        userData.users.forEach(user => {
          console.log(`  - ${user.email} (${user.id}) - Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
        });
      }
    } else {
      console.log('✅ Login test successful!');
      
      // Sign out the test session
      await supabase.auth.signOut();
    }
    
    console.log('\n🎉 Setup complete!');
    console.log(`📧 Email: geraghtyglenn@gmail.com`);
    console.log(`🔑 Password: admin123456`);
    console.log(`🌐 Admin Login: http://localhost:3000/admin/login`);
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

if (require.main === module) {
  simpleAdminSetup().catch(console.error);
}

module.exports = { simpleAdminSetup };
