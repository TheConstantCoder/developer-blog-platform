#!/usr/bin/env node

/**
 * Seed Technologies Script
 * 
 * This script seeds the technologies table with common technologies
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
];

async function seedTechnologies() {
  console.log('🌱 Seeding Technologies\n');
  
  try {
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
      console.log('🔄 Inserting technologies...');
      
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
    const { data: finalTechs, error: finalError } = await supabase
      .from('technologies')
      .select('name')
      .order('name');

    if (finalError) {
      console.error('❌ Error verifying technologies:', finalError);
    } else {
      console.log(`\n✅ Final count: ${finalTechs?.length || 0} technologies available`);
      
      if (finalTechs && finalTechs.length > 0) {
        console.log('📋 Available technologies:');
        finalTechs.slice(0, 10).forEach(tech => {
          console.log(`   - ${tech.name}`);
        });
        if (finalTechs.length > 10) {
          console.log(`   ... and ${finalTechs.length - 10} more`);
        }
      }
    }

    console.log('\n🎯 Technologies are ready for use in project management!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

if (require.main === module) {
  seedTechnologies().catch(console.error);
}

module.exports = { seedTechnologies };
