#!/usr/bin/env node

/**
 * Test Sign Out Script
 * 
 * This script helps test the security by clearing sessions
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

async function testSignOut() {
  console.log('🔐 Testing Sign Out\n');
  
  try {
    // List all active sessions (for debugging)
    console.log('📋 Checking active sessions...');
    
    // Note: This is just for testing - in production you wouldn't expose this
    const { data: users, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('Error listing users:', error);
      return;
    }
    
    console.log(`Found ${users.users.length} users in the system`);
    
    users.users.forEach(user => {
      console.log(`- ${user.email} (${user.id}) - Last sign in: ${user.last_sign_in_at || 'Never'}`);
    });
    
    console.log('\n🔒 To test security:');
    console.log('1. Open an incognito/private browser window');
    console.log('2. Try to access: http://localhost:3000/admin/posts');
    console.log('3. You should be redirected to admin login');
    console.log('4. Or use the "Sign Out" button in the AuthStatus component');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

if (require.main === module) {
  testSignOut().catch(console.error);
}

module.exports = { testSignOut };
