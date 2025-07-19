#!/usr/bin/env node

/**
 * Script to update user role for testing authentication middleware
 * Usage: node scripts/update-user-role.js <email> <role>
 * Example: node scripts/update-user-role.js user@example.com admin
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function updateUserRole() {
  const email = process.argv[2]
  const role = process.argv[3]
  
  if (!email || !role) {
    console.error('Usage: node scripts/update-user-role.js <email> <role>')
    console.error('Valid roles: user, admin, moderator')
    process.exit(1)
  }
  
  if (!['user', 'admin', 'moderator'].includes(role)) {
    console.error('Invalid role. Valid roles: user, admin, moderator')
    process.exit(1)
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables')
    process.exit(1)
  }
  
  // Create admin client with service role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  try {
    console.log(`🔄 Updating role for ${email} to ${role}...`)
    
    // Update user role in profiles table
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('email', email)
      .select()
    
    if (error) {
      console.error('❌ Error updating user role:', error.message)
      process.exit(1)
    }
    
    if (data && data.length > 0) {
      console.log('✅ Successfully updated user role:')
      console.log(`   Email: ${data[0].email}`)
      console.log(`   Role: ${data[0].role}`)
      console.log(`   Full Name: ${data[0].full_name || 'Not set'}`)
    } else {
      console.log('❌ No user found with email:', email)
      console.log('💡 Make sure the user has signed up and has a profile')
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    process.exit(1)
  }
}

updateUserRole().catch(console.error)
