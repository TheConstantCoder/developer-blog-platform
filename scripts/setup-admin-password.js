#!/usr/bin/env node

/**
 * Setup Admin Password Script
 * 
 * This script creates an admin user with email/password authentication
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

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

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

async function setupAdminPassword() {
  console.log('🔐 Admin Password Setup\n');
  
  try {
    // Get admin email
    const email = await askQuestion('Enter admin email (geraghtyglenn@gmail.com): ') || 'geraghtyglenn@gmail.com';
    
    // Get password
    const password = await askPassword('Enter admin password (min 6 characters): ');
    
    if (password.length < 6) {
      console.log('\n❌ Password must be at least 6 characters long');
      rl.close();
      return;
    }
    
    console.log('\n🔄 Setting up admin account...');
    
    // Check if user already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();
    
    if (existingProfile) {
      console.log('✅ User profile already exists');
      
      // Update to admin role if not already
      if (existingProfile.role !== 'admin') {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', existingProfile.id);
        
        if (updateError) {
          console.error('❌ Error updating role:', updateError);
          rl.close();
          return;
        }
        
        console.log('✅ Updated user role to admin');
      }
    } else {
      // Create new admin user
      console.log('🔄 Creating new admin user...');
      
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: 'Admin User'
        }
      });
      
      if (authError) {
        console.error('❌ Error creating user:', authError);
        rl.close();
        return;
      }
      
      console.log('✅ Created admin user account');
      
      // Create profile with admin role
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: email,
          full_name: 'Admin User',
          role: 'admin'
        });
      
      if (profileError) {
        console.error('❌ Error creating profile:', profileError);
        rl.close();
        return;
      }
      
      console.log('✅ Created admin profile');
    }
    
    console.log('\n🎉 Admin setup complete!');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: [hidden]`);
    console.log(`🌐 Admin Login: http://localhost:3000/admin/login`);
    console.log('\n⚠️  Keep these credentials secure!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  setupAdminPassword().catch(console.error);
}

module.exports = { setupAdminPassword };
