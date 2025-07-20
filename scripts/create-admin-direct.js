#!/usr/bin/env node

/**
 * Create Admin User Directly
 * 
 * This script creates an admin user directly without interactive prompts
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

async function createAdminDirect() {
  console.log('🔐 Creating Admin User Directly\n');
  
  const adminEmail = 'admin@localhost.com';
  const adminPassword = 'admin123456'; // 8 characters to be safe
  
  try {
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log('');
    
    // Check if admin user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', adminEmail)
      .single();
    
    if (existingUser) {
      console.log('⚠️  User already exists, updating...');
      
      // Update existing user
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        { 
          password: adminPassword,
          email_confirm: true
        }
      );
      
      if (updateError) {
        console.error('❌ Error updating user:', updateError);
        return;
      }
      
      // Update profile role
      const { error: roleError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', existingUser.id);
      
      if (roleError) {
        console.error('❌ Error updating role:', roleError);
        return;
      }
      
      console.log('✅ Updated existing user to admin');
    } else {
      console.log('🔄 Creating new admin user...');
      
      // Create new admin user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
          full_name: 'Admin User'
        }
      });
      
      if (authError) {
        console.error('❌ Error creating user:', authError);
        return;
      }
      
      console.log('✅ Created admin user account');
      console.log(`   User ID: ${authData.user.id}`);
      
      // Create profile with admin role
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: adminEmail,
          full_name: 'Admin User',
          role: 'admin'
        });
      
      if (profileError) {
        console.error('❌ Error creating profile:', profileError);
        return;
      }
      
      console.log('✅ Created admin profile');
    }
    
    // Test the login
    console.log('\n🧪 Testing admin login...');
    
    const { data: testLogin, error: loginError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword
    });
    
    if (loginError) {
      console.error('❌ Login test failed:', loginError);
      console.log('\nTrying to debug the issue...');
      
      // Check if the user exists in auth.users
      const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
      if (userData) {
        const adminUser = userData.users.find(u => u.email === adminEmail);
        if (adminUser) {
          console.log(`✅ User exists in auth.users: ${adminUser.id}`);
          console.log(`   Email confirmed: ${adminUser.email_confirmed_at ? 'Yes' : 'No'}`);
          console.log(`   Created: ${adminUser.created_at}`);
        } else {
          console.log('❌ User not found in auth.users');
        }
      }
    } else {
      console.log('✅ Login test successful!');
      console.log(`   User ID: ${testLogin.user.id}`);
      console.log(`   Email: ${testLogin.user.email}`);
      
      // Sign out the test session
      await supabase.auth.signOut();
    }
    
    console.log('\n🎉 Admin user setup complete!');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log(`🌐 Admin Login: http://localhost:3000/admin/login`);
    console.log('\n🚀 You can now sign in to the admin dashboard!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

if (require.main === module) {
  createAdminDirect().catch(console.error);
}

module.exports = { createAdminDirect };
