# Database Seeding Guide

This guide explains how to populate the Developer Blog Platform database with realistic test data for development and testing purposes.

## Overview

The database seeding script (`scripts/seed-database.js`) populates the database with:

- **4 User Profiles**: Including admin, regular users, and moderator
- **5 Blog Posts**: Comprehensive technical articles with rich content
- **3 Projects**: Portfolio items showcasing different technologies
- **21 Tags**: Technology and topic tags for content organization
- **10+ Comments**: Realistic user interactions on blog posts

## Prerequisites

### Environment Setup

Ensure you have the following environment variables configured:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Database Schema

The seeding script requires the complete database schema to be applied. Ensure all migrations are up to date:

```bash
# Apply all migrations
supabase db push
```

## Running the Seeding Script

### Basic Usage

```bash
# Run the seeding script
node scripts/seed-database.js
```

### Development Environment Only

The script includes safety checks and will only run in development environments. It will exit with an error if `NODE_ENV=production`.

### What the Script Does

1. **Connects to Database**: Verifies Supabase connection
2. **Clears Existing Data**: Removes all existing test data (preserves structure)
3. **Seeds Users**: Creates test user profiles with different roles
4. **Seeds Tags**: Creates technology and topic tags
5. **Seeds Blog Posts**: Creates detailed technical articles
6. **Seeds Projects**: Creates portfolio project entries
7. **Seeds Comments**: Adds realistic user comments
8. **Verifies Data**: Confirms all data was inserted correctly

## Seeded Data Details

### User Profiles

| Name | Email | Role | Description |
|------|-------|------|-------------|
| Glenn Geraghty | glenn@example.com | admin | Platform administrator |
| Sarah Chen | sarah.dev@example.com | user | Frontend specialist |
| Alex Rodriguez | alex.backend@example.com | user | Backend engineer |
| Maria Santos | maria.fullstack@example.com | moderator | Full-stack developer |

### Blog Posts

1. **Building a Modern Blog Platform with Next.js 14 and Supabase**
   - Comprehensive guide to the current project
   - Tags: Next.js, Supabase, TypeScript, Web Development, Full Stack, Tutorial

2. **TypeScript Best Practices for React Applications in 2024**
   - Advanced TypeScript patterns and practices
   - Tags: TypeScript, React, Best Practices, Frontend, Tutorial

3. **Implementing Authentication with Supabase and Next.js**
   - Complete authentication implementation guide
   - Tags: Supabase, Next.js, Authentication, Security, Tutorial

4. **Database Design Patterns for SaaS Applications**
   - Essential database patterns for scalable applications
   - Tags: PostgreSQL, Database Design, SaaS, Backend, Best Practices

5. **Optimizing Web Performance with Next.js 14**
   - Performance optimization techniques and strategies
   - Tags: Next.js, Performance, Web Development, Optimization, Tutorial

### Projects

1. **Developer Blog Platform** (Featured)
   - The current project showcasing modern web development
   - Tech Stack: Next.js, TypeScript, Supabase, PostgreSQL, Tailwind CSS, Vercel

2. **Task Management SaaS** (Featured)
   - Comprehensive task management application
   - Tech Stack: React, Node.js, PostgreSQL, Redis, AWS, Docker

3. **E-commerce Analytics Dashboard**
   - Real-time analytics platform for e-commerce
   - Tech Stack: Python, React, ClickHouse, Kafka, D3.js, FastAPI

### Tags

The script creates 21 tags across three categories:

**Technology Tags**: React, Next.js, TypeScript, Node.js, Supabase, Tailwind CSS, PostgreSQL, Python, Docker, AWS

**Topic Tags**: Web Development, Full Stack, Frontend, Backend, DevOps, Database Design, Authentication

**Content Type Tags**: Tutorial, Best Practices, Case Study, Opinion

## Verification

After seeding, the script automatically verifies:

- All tables have the expected number of records
- Relationships between posts/projects and tags are working
- Data integrity is maintained

## Troubleshooting

### Common Issues

**Connection Errors**
```
❌ Database connection failed: Invalid API key
```
- Verify your Supabase environment variables
- Ensure the service role key has proper permissions

**Permission Errors**
```
❌ Error creating user: new row violates row-level security policy
```
- Check that RLS policies allow data insertion
- Verify the service role key bypasses RLS

**Duplicate Key Errors**
```
❌ Error creating post: duplicate key value violates unique constraint
```
- Run the script again (it clears existing data first)
- Check for any manual data that might conflict

### Manual Cleanup

If you need to manually clear the seeded data:

```sql
-- Clear all seeded data (run in Supabase SQL editor)
DELETE FROM post_tags;
DELETE FROM project_tags;
DELETE FROM comments;
DELETE FROM posts;
DELETE FROM projects;
DELETE FROM tags;
DELETE FROM profiles WHERE email LIKE '%@example.com';
```

## Customization

### Adding More Data

To add more blog posts, projects, or users:

1. Edit the generator functions in `scripts/seed-database.js`
2. Add new entries to the respective arrays
3. Run the seeding script again

### Modifying Content

The seeded content is designed to be realistic and relevant to developers. You can:

- Update blog post content to match your expertise
- Modify project descriptions to reflect your actual work
- Adjust user profiles to match your team

## Integration with Development Workflow

### Automated Seeding

Add seeding to your development setup:

```json
{
  "scripts": {
    "dev:seed": "node scripts/seed-database.js && npm run dev",
    "db:reset": "supabase db reset && node scripts/seed-database.js"
  }
}
```

### Testing Integration

The seeding script can be used in testing:

```javascript
// In your test setup
const { seedUsers, seedTags } = require('../scripts/seed-database');

beforeEach(async () => {
  await clearExistingData();
  await seedUsers();
  await seedTags();
});
```

## Next Steps

After seeding the database:

1. **Visit the Blog**: Go to `/blog` to see the seeded posts
2. **Check Projects**: Visit `/projects` to see the portfolio
3. **Test Authentication**: Sign in to test the auth flow
4. **Admin Access**: Use admin credentials to access `/admin/dashboard`
5. **Content Management**: Test creating and editing content

The seeded data provides a solid foundation for developing and testing all platform features.
