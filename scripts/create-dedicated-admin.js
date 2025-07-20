#!/usr/bin/env node

/**
 * Create Dedicated Admin User Script
 * 
 * This script creates a completely separate admin user for admin dashboard access
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

async function createDedicatedAdmin() {
  console.log('🔐 Create Dedicated Admin User\n');
  
  try {
    // Get admin email
    const email = await askQuestion('Enter admin email (admin@yourdomain.com): ') || 'admin@yourdomain.com';
    
    // Get password
    const password = await askPassword('Enter admin password (min 6 characters): ');
    
    if (password.length < 6) {
      console.log('\n❌ Password must be at least 6 characters long');
      rl.close();
      return;
    }
    
    console.log('\n🔄 Creating dedicated admin user...');
    
    // Check if admin user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();
    
    if (existingUser) {
      console.log('⚠️  User with this email already exists');
      const overwrite = await askQuestion('Do you want to update this user to admin? (y/n): ');
      
      if (overwrite.toLowerCase() !== 'y') {
        console.log('❌ Operation cancelled');
        rl.close();
        return;
      }
      
      // Update existing user
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        { 
          password: password,
          email_confirm: true
        }
      );
      
      if (updateError) {
        console.error('❌ Error updating user:', updateError);
        rl.close();
        return;
      }
      
      // Update profile role
      const { error: roleError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', existingUser.id);
      
      if (roleError) {
        console.error('❌ Error updating role:', roleError);
        rl.close();
        return;
      }
      
      console.log('✅ Updated existing user to admin');
    } else {
      // Create new admin user
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
    
    // Test the login
    console.log('\n🧪 Testing admin login...');
    
    const { data: testLogin, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (loginError) {
      console.error('❌ Login test failed:', loginError);
    } else {
      console.log('✅ Login test successful!');
      
      // Sign out the test session
      await supabase.auth.signOut();
    }
    
    console.log('\n🎉 Admin user setup complete!');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: [hidden]`);
    console.log(`🌐 Admin Login: http://localhost:3000/admin/login`);
    console.log('\n🚀 You can now sign in to the admin dashboard!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  createDedicatedAdmin().catch(console.error);
}

module.exports = { createDedicatedAdmin };
