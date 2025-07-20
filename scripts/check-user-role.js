#!/usr/bin/env node

/**
 * Check User Role Script
 * 
 * This script checks the current user's role and can update it to admin
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

async function checkAndUpdateUserRole() {
  console.log('🔍 Checking user roles...\n');

  try {
    // Get all users
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching profiles:', error);
      return;
    }

    if (!profiles || profiles.length === 0) {
      console.log('❌ No user profiles found');
      return;
    }

    console.log(`✅ Found ${profiles.length} user profiles:\n`);

    profiles.forEach((profile, index) => {
      console.log(`👤 User ${index + 1}:`);
      console.log(`   ID: ${profile.id}`);
      console.log(`   Email: ${profile.email || 'Not set'}`);
      console.log(`   Full Name: ${profile.full_name || 'Not set'}`);
      console.log(`   Role: ${profile.role || 'user'}`);
      console.log(`   Created: ${profile.created_at}`);
      console.log('');
    });

    // Check if there's an admin user
    const adminUsers = profiles.filter(p => p.role === 'admin');
    
    if (adminUsers.length === 0) {
      console.log('⚠️  No admin users found!');
      
      // Find the most likely admin user (first user or user with specific email)
      const targetUser = profiles.find(p => 
        p.email?.includes('geraghtyglenn@gmail.com') || 
        p.email?.includes('glenn')
      ) || profiles[0];

      if (targetUser) {
        console.log(`🔧 Making user admin: ${targetUser.email || targetUser.id}`);
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', targetUser.id);

        if (updateError) {
          console.error('❌ Error updating user role:', updateError);
        } else {
          console.log('✅ Successfully updated user to admin role!');
          console.log(`👑 Admin user: ${targetUser.email || targetUser.id}`);
        }
      }
    } else {
      console.log(`✅ Found ${adminUsers.length} admin user(s):`);
      adminUsers.forEach(admin => {
        console.log(`   👑 ${admin.email || admin.id} (Admin)`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

if (require.main === module) {
  checkAndUpdateUserRole().catch(console.error);
}

module.exports = { checkAndUpdateUserRole };
