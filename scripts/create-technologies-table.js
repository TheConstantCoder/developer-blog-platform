#!/usr/bin/env node

/**
 * Create Technologies Table Script
 * 
 * This script creates the technologies table and seeds it with common technologies
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

const commonTechnologies = [
  // Frontend
  { name: 'React', slug: 'react', color: '#61DAFB' },
  { name: 'Next.js', slug: 'nextjs', color: '#000000' },
  { name: 'Vue.js', slug: 'vuejs', color: '#4FC08D' },
  { name: 'Angular', slug: 'angular', color: '#DD0031' },
  { name: 'TypeScript', slug: 'typescript', color: '#3178C6' },
  { name: 'JavaScript', slug: 'javascript', color: '#F7DF1E' },
  { name: 'HTML5', slug: 'html5', color: '#E34F26' },
  { name: 'CSS3', slug: 'css3', color: '#1572B6' },
  { name: 'Tailwind CSS', slug: 'tailwindcss', color: '#06B6D4' },
  { name: 'Sass', slug: 'sass', color: '#CC6699' },

  // Backend
  { name: 'Node.js', slug: 'nodejs', color: '#339933' },
  { name: 'Express.js', slug: 'expressjs', color: '#000000' },
  { name: 'Python', slug: 'python', color: '#3776AB' },
  { name: 'Django', slug: 'django', color: '#092E20' },
  { name: 'Flask', slug: 'flask', color: '#000000' },
  { name: 'FastAPI', slug: 'fastapi', color: '#009688' },
  { name: 'PHP', slug: 'php', color: '#777BB4' },
  { name: 'Laravel', slug: 'laravel', color: '#FF2D20' },
  { name: 'Ruby', slug: 'ruby', color: '#CC342D' },
  { name: 'Ruby on Rails', slug: 'rails', color: '#CC0000' },
  { name: 'Java', slug: 'java', color: '#ED8B00' },
  { name: 'Spring Boot', slug: 'spring-boot', color: '#6DB33F' },
  { name: 'C#', slug: 'csharp', color: '#239120' },
  { name: '.NET', slug: 'dotnet', color: '#512BD4' },
  { name: 'Go', slug: 'go', color: '#00ADD8' },
  { name: 'Rust', slug: 'rust', color: '#000000' },

  // Databases
  { name: 'PostgreSQL', slug: 'postgresql', color: '#336791' },
  { name: 'MySQL', slug: 'mysql', color: '#4479A1' },
  { name: 'MongoDB', slug: 'mongodb', color: '#47A248' },
  { name: 'Redis', slug: 'redis', color: '#DC382D' },
  { name: 'SQLite', slug: 'sqlite', color: '#003B57' },
  { name: 'Supabase', slug: 'supabase', color: '#3ECF8E' },
  { name: 'Firebase', slug: 'firebase', color: '#FFCA28' },

  // Cloud & DevOps
  { name: 'AWS', slug: 'aws', color: '#FF9900' },
  { name: 'Google Cloud', slug: 'gcp', color: '#4285F4' },
  { name: 'Azure', slug: 'azure', color: '#0078D4' },
  { name: 'Docker', slug: 'docker', color: '#2496ED' },
  { name: 'Kubernetes', slug: 'kubernetes', color: '#326CE5' },
  { name: 'Vercel', slug: 'vercel', color: '#000000' },
  { name: 'Netlify', slug: 'netlify', color: '#00C7B7' },

  // Tools & Others
  { name: 'Git', slug: 'git', color: '#F05032' },
  { name: 'GitHub', slug: 'github', color: '#181717' },
  { name: 'VS Code', slug: 'vscode', color: '#007ACC' },
  { name: 'Figma', slug: 'figma', color: '#F24E1E' },
  { name: 'Webpack', slug: 'webpack', color: '#8DD6F9' },
  { name: 'Vite', slug: 'vite', color: '#646CFF' },
  { name: 'ESLint', slug: 'eslint', color: '#4B32C3' },
  { name: 'Prettier', slug: 'prettier', color: '#F7B93E' },

  // Mobile
  { name: 'React Native', slug: 'react-native', color: '#61DAFB' },
  { name: 'Flutter', slug: 'flutter', color: '#02569B' },
  { name: 'Swift', slug: 'swift', color: '#FA7343' },
  { name: 'Kotlin', slug: 'kotlin', color: '#7F52FF' },

  // Testing
  { name: 'Jest', slug: 'jest', color: '#C21325' },
  { name: 'Cypress', slug: 'cypress', color: '#17202C' },
  { name: 'Playwright', slug: 'playwright', color: '#2EAD33' },
];

async function createTechnologiesTable() {
  console.log('🔧 Creating Technologies Table and Seeding Data\n');
  
  try {
    // Check if technologies table exists
    console.log('📋 Checking if technologies table exists...');
    
    const { data: existingTechs, error: checkError } = await supabase
      .from('technologies')
      .select('count')
      .limit(1);

    if (checkError && checkError.code === '42P01') {
      // Table doesn't exist, create it using SQL
      console.log('🔄 Creating technologies table...');
      
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS technologies (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(100) NOT NULL UNIQUE,
          slug VARCHAR(100) NOT NULL UNIQUE,
          color VARCHAR(7) NOT NULL DEFAULT '#6B7280',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create updated_at trigger
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ language 'plpgsql';

        CREATE TRIGGER update_technologies_updated_at 
          BEFORE UPDATE ON technologies 
          FOR EACH ROW 
          EXECUTE FUNCTION update_updated_at_column();

        -- Enable RLS
        ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;

        -- Allow read access to all authenticated users
        CREATE POLICY "Technologies are viewable by authenticated users" ON technologies
          FOR SELECT USING (auth.role() = 'authenticated');

        -- Allow admin users to manage technologies
        CREATE POLICY "Admins can manage technologies" ON technologies
          FOR ALL USING (
            auth.role() = 'authenticated' AND 
            EXISTS (
              SELECT 1 FROM profiles 
              WHERE profiles.id = auth.uid() 
              AND profiles.role = 'admin'
            )
          );
      `;

      const { error: createError } = await supabase.rpc('exec_sql', { 
        sql: createTableSQL 
      });

      if (createError) {
        console.error('❌ Error creating table with RPC:', createError);
        
        // Try alternative approach - direct table creation
        console.log('🔄 Trying direct table creation...');
        
        const { error: directError } = await supabase
          .from('technologies')
          .select('*')
          .limit(1);

        if (directError) {
          console.error('❌ Technologies table does not exist and cannot be created automatically.');
          console.log('\n📝 Please create the table manually in Supabase Dashboard:');
          console.log('1. Go to https://supabase.com/dashboard');
          console.log('2. Navigate to Table Editor');
          console.log('3. Create a new table called "technologies" with columns:');
          console.log('   - id (uuid, primary key, default: gen_random_uuid())');
          console.log('   - name (varchar, not null, unique)');
          console.log('   - slug (varchar, not null, unique)');
          console.log('   - color (varchar, default: "#6B7280")');
          console.log('   - created_at (timestamptz, default: now())');
          console.log('   - updated_at (timestamptz, default: now())');
          return;
        }
      }

      console.log('✅ Technologies table created successfully');
    } else {
      console.log('✅ Technologies table already exists');
    }

    // Check if we have any technologies
    const { data: existingCount, error: countError } = await supabase
      .from('technologies')
      .select('id', { count: 'exact' });

    if (countError) {
      console.error('❌ Error checking existing technologies:', countError);
      return;
    }

    const currentCount = existingCount?.length || 0;
    console.log(`📊 Found ${currentCount} existing technologies`);

    if (currentCount === 0) {
      console.log('🌱 Seeding technologies...');
      
      // Insert technologies in batches
      const batchSize = 10;
      let inserted = 0;
      
      for (let i = 0; i < commonTechnologies.length; i += batchSize) {
        const batch = commonTechnologies.slice(i, i + batchSize);
        
        const { error: insertError } = await supabase
          .from('technologies')
          .insert(batch);

        if (insertError) {
          console.error(`❌ Error inserting batch ${Math.floor(i/batchSize) + 1}:`, insertError);
        } else {
          inserted += batch.length;
          console.log(`✅ Inserted batch ${Math.floor(i/batchSize) + 1} (${batch.length} technologies)`);
        }
      }
      
      console.log(`🎉 Successfully seeded ${inserted} technologies!`);
    } else {
      console.log('ℹ️  Technologies already exist, skipping seed');
    }

    // Verify the data
    const { data: finalCount, error: finalError } = await supabase
      .from('technologies')
      .select('name', { count: 'exact' });

    if (finalError) {
      console.error('❌ Error verifying technologies:', finalError);
    } else {
      console.log(`\n✅ Final count: ${finalCount?.length || 0} technologies available`);
      
      if (finalCount && finalCount.length > 0) {
        console.log('📋 Sample technologies:');
        finalCount.slice(0, 5).forEach(tech => {
          console.log(`   - ${tech.name}`);
        });
        if (finalCount.length > 5) {
          console.log(`   ... and ${finalCount.length - 5} more`);
        }
      }
    }

    console.log('\n🎯 Technologies table is ready for use!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

if (require.main === module) {
  createTechnologiesTable().catch(console.error);
}

module.exports = { createTechnologiesTable };
