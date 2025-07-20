#!/usr/bin/env node

/**
 * Fix Admin Authentication Script
 * 
 * This script updates an existing OAuth user to support password authentication
 */

const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');
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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askPassword(question) {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    const stdout = process.stdout;
    
    stdout.write(question);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    
    let password = '';
    
    stdin.on('data', function(char) {
      char = char + '';
      
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004':
          stdin.setRawMode(false);
          stdin.pause();
          stdout.write('\n');
          resolve(password);
          break;
        case '\u0003':
          process.exit();
          break;
        case '\u007f': // backspace
          if (password.length > 0) {
            password = password.slice(0, -1);
            stdout.write('\b \b');
          }
          break;
        default:
          password += char;
          stdout.write('*');
          break;
      }
    });
  });
}

async function fixAdminAuth() {
  console.log('🔧 Fix Admin Authentication\n');
  
  try {
    // Find your existing profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'geraghtyglenn@gmail.com')
      .single();

    if (profileError || !profile) {
      console.log('❌ Could not find your profile. Let me check all profiles...\n');
      
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (allProfiles && allProfiles.length > 0) {
        console.log('Found profiles:');
        allProfiles.forEach((p, i) => {
          console.log(`${i + 1}. ${p.email || 'No email'} - ${p.full_name || 'No name'} - Role: ${p.role || 'user'}`);
        });
      }
      
      rl.close();
      return;
    }

    console.log(`✅ Found your profile:`);
    console.log(`   Email: ${profile.email}`);
    console.log(`   Name: ${profile.full_name}`);
    console.log(`   Role: ${profile.role}`);
    console.log(`   ID: ${profile.id}\n`);

    // Ensure admin role
    if (profile.role !== 'admin') {
      console.log('🔄 Updating role to admin...');
      const { error: roleError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', profile.id);
      
      if (roleError) {
        console.error('❌ Error updating role:', roleError);
        rl.close();
        return;
      }
      console.log('✅ Role updated to admin');
    }

    // Get new admin password
    const password = await askPassword('Enter new admin password (min 6 characters): ');
    
    if (password.length < 6) {
      console.log('\n❌ Password must be at least 6 characters long');
      rl.close();
      return;
    }

    console.log('\n🔄 Adding password authentication to your account...');

    // Update the user to support password authentication
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
      profile.id,
      { 
        password: password,
        email_confirm: true
      }
    );

    if (updateError) {
      console.error('❌ Error updating user authentication:', updateError);
      rl.close();
      return;
    }

    console.log('✅ Successfully added password authentication!');
    console.log('\n🎉 Admin access configured!');
    console.log(`📧 Email: ${profile.email}`);
    console.log(`🔑 Password: [hidden]`);
    console.log(`👑 Role: admin`);
    console.log(`🌐 Admin Login: http://localhost:3000/admin/login`);
    console.log('\n✨ You can now sign in to the admin dashboard with email/password!');
    console.log('💡 Your GitHub OAuth login will still work for the main site.');
    
  } catch (error) {
    console.error('❌ Fix failed:', error);
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  fixAdminAuth().catch(console.error);
}

module.exports = { fixAdminAuth };
