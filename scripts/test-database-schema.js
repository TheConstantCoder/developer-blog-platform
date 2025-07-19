#!/usr/bin/env node

/**
 * Test script to verify database schema and migrations
 * Run with: node scripts/test-database-schema.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

async function testDatabaseSchema() {
  console.log('🗄️  Testing Database Schema and Migrations...\n')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables')
    console.log('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  
  try {
    console.log('📋 Database Schema Test Checklist:')
    console.log()
    
    // Test 1: Check if tables exist
    console.log('   📊 Core Tables:')
    
    const tables = ['profiles', 'posts', 'projects', 'tags']
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        if (error && error.code === 'PGRST116') {
          console.log(`      ❌ ${table} - Table does not exist`)
        } else if (error) {
          console.log(`      ⚠️  ${table} - Error: ${error.message}`)
        } else {
          console.log(`      ✅ ${table} - Table exists and accessible`)
        }
      } catch (err) {
        console.log(`      ❌ ${table} - Error: ${err.message}`)
      }
    }
    console.log()
    
    // Test 2: Test basic CRUD operations
    console.log('   🔧 Basic CRUD Operations:')
    
    // Test creating a test tag (simplest table)
    try {
      const testTag = {
        name: 'test-tag-' + Date.now(),
        slug: 'test-tag-' + Date.now(),
        description: 'Test tag for schema validation'
      }
      
      const { data: tagData, error: tagError } = await supabase
        .from('tags')
        .insert(testTag)
        .select()
      
      if (tagError) {
        console.log(`      ⚠️  Tag CRUD - Error: ${tagError.message}`)
      } else {
        console.log('      ✅ Tag CRUD - Working')
        
        // Clean up test data
        await supabase
          .from('tags')
          .delete()
          .eq('id', tagData[0].id)
      }
    } catch (err) {
      console.log(`      ⚠️  Tag CRUD - Error: ${err.message}`)
    }
    console.log()
    
    // Test 3: Check RLS policies
    console.log('   🔒 Row Level Security:')
    
    // Test with anon client (should have limited access)
    const anonClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    
    try {
      const { data: anonData, error: anonError } = await anonClient
        .from('profiles')
        .select('*')
        .limit(1)
      
      if (anonError) {
        console.log('      ✅ RLS Policies - Active (anon access restricted)')
      } else {
        console.log('      ⚠️  RLS Policies - May need review (anon access allowed)')
      }
    } catch (err) {
      console.log('      ✅ RLS Policies - Active (anon access blocked)')
    }
    console.log()
    
    console.log('🎉 Database Schema Test Complete!')
    console.log()
    console.log('📝 Next Steps:')
    console.log('   1. Run migrations if tables are missing')
    console.log('   2. Test with actual user authentication')
    console.log('   3. Verify RLS policies with different user roles')
    console.log('   4. Test junction tables and relationships')
    console.log()
    console.log('🔧 Manual Verification:')
    console.log('   • Check Supabase dashboard for table structure')
    console.log('   • Verify RLS policies in Authentication > Policies')
    console.log('   • Test API endpoints with different user roles')
    
  } catch (error) {
    console.error('❌ Database schema test failed:', error.message)
    process.exit(1)
  }
}

// Run the test
testDatabaseSchema().catch(console.error)
