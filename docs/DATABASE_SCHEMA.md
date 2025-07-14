# Database Schema Documentation

## Overview

This document describes the database schema for the Developer Blog Platform, implemented using Supabase PostgreSQL with Row Level Security (RLS) policies for secure multi-user access.

## Architecture

The database follows a relational design with proper foreign key constraints, indexes for performance, and comprehensive RLS policies for role-based access control.

### User Roles
- **Guests**: Unauthenticated users who can view published content
- **Users**: Authenticated users who can manage their own content
- **Admins**: Users with full access to all content and user management

## Core Tables

### 1. Profiles Table
Extends Supabase's `auth.users` table with additional user information.

```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    role user_role DEFAULT 'user',
    github_username TEXT,
    website_url TEXT,
    location TEXT,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Features:**
- Automatic profile creation on user signup via trigger
- Role-based access control (user, admin, moderator)
- Public/private profile visibility
- Auto-updating timestamps

### 2. Posts Table
Stores blog posts and articles with status management.

```sql
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image_url TEXT,
    status post_status DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    meta_title TEXT,
    meta_description TEXT,
    reading_time INTEGER,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Features:**
- Auto-generated unique slugs from titles
- Automatic reading time calculation
- Status-based visibility (draft, published, archived)
- SEO metadata support
- View count tracking

### 3. Projects Table
Portfolio projects with technology stack tracking.

```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    featured_image_url TEXT,
    demo_url TEXT,
    github_url TEXT,
    tech_stack TEXT[],
    status project_status DEFAULT 'active',
    featured BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Features:**
- Technology stack as PostgreSQL array
- Public/private visibility control
- Featured project highlighting
- Demo and GitHub URL links

### 4. Tags Table
Content categorization system.

```sql
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#3b82f6',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Features:**
- Unique tag names and slugs
- Color coding for UI display
- Managed by moderators and admins only

## Junction Tables

### 5. Post Tags (post_tags)
Many-to-many relationship between posts and tags.

### 6. Project Tags (project_tags)
Many-to-many relationship between projects and tags.

### 7. Comments Table
User comments on blog posts with moderation.

```sql
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Features:**
- Nested/threaded comments support
- Moderation system with approval
- Only approved comments visible to guests

### 8. Newsletter Subscribers
Email newsletter subscription management.

```sql
CREATE TABLE newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ,
    confirmation_token TEXT,
    is_confirmed BOOLEAN DEFAULT false
);
```

## Custom Types

```sql
CREATE TYPE user_role AS ENUM ('user', 'admin', 'moderator');
CREATE TYPE post_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE project_status AS ENUM ('active', 'completed', 'archived');
```

## Database Functions

### Utility Functions
- `generate_slug(title TEXT)`: Creates URL-friendly slugs
- `calculate_reading_time(content TEXT)`: Estimates reading time
- `increment_post_view_count(post_id UUID)`: Safely increments view counts

### Security Functions
- `is_admin(user_id UUID)`: Checks if user has admin role
- `is_moderator_or_admin(user_id UUID)`: Checks for moderator or admin role

## Triggers

### Automatic Timestamps
- `trigger_profiles_updated_at`: Updates `updated_at` on profile changes
- `trigger_posts_updated_at`: Updates `updated_at` on post changes
- `trigger_projects_updated_at`: Updates `updated_at` on project changes
- `trigger_comments_updated_at`: Updates `updated_at` on comment changes

### Content Processing
- `trigger_posts_slug`: Auto-generates unique slugs for posts
- `trigger_projects_slug`: Auto-generates unique slugs for projects
- `trigger_posts_reading_time`: Auto-calculates reading time
- `trigger_posts_published_at`: Sets/clears published timestamp

### User Management
- `trigger_handle_new_user`: Creates profile on user signup

## Row Level Security (RLS) Policies

### Access Patterns

#### Guests (Unauthenticated)
- **CAN VIEW**: Published posts, public projects, public profiles, all tags, approved comments
- **CAN DO**: Subscribe to newsletter
- **CANNOT**: Create, update, or delete any content

#### Authenticated Users
- **CAN VIEW**: Everything guests can see + their own drafts/private content
- **CAN DO**: Create/edit/delete their own content, update their profile, comment on posts
- **CANNOT**: Access other users' private content, manage tags

#### Admins
- **CAN VIEW**: All content regardless of status or visibility
- **CAN DO**: Manage all content, users, and system settings
- **SPECIAL**: Can approve comments, manage newsletter subscribers

### Policy Examples

```sql
-- Guests can view published posts
CREATE POLICY "Published posts are viewable by everyone" ON posts
    FOR SELECT USING (status = 'published');

-- Users can manage their own posts
CREATE POLICY "Users can update own posts" ON posts
    FOR UPDATE USING (auth.uid() = author_id);

-- Admins can view all posts
CREATE POLICY "Admins can view all posts" ON posts
    FOR SELECT USING (is_admin(auth.uid()));
```

## Performance Optimizations

### Indexes
- Email lookups on profiles
- Slug lookups for SEO-friendly URLs
- Author-based content filtering
- Status-based content filtering
- Tag associations for content discovery
- Comment threading and approval status

### Query Optimization
- Proper foreign key relationships for JOIN optimization
- Array data type for tech stacks (PostgreSQL native)
- Timestamp indexes for chronological sorting

## Security Considerations

1. **RLS Enforcement**: All tables have RLS enabled with comprehensive policies
2. **Foreign Key Constraints**: Prevent orphaned records and maintain data integrity
3. **Input Validation**: Database-level constraints and application-level validation
4. **Service Role Protection**: Service role key never exposed to client-side code
5. **JWT Validation**: All authenticated operations validate JWT tokens

## Migration Files

The schema is implemented through versioned migration files:

1. `001_create_core_tables.sql` - Core tables and indexes
2. `002_setup_rls_policies.sql` - Row Level Security policies
3. `003_create_junction_tables.sql` - Junction tables and additional features
4. `004_create_functions_triggers.sql` - Database functions and triggers

## TypeScript Integration

Complete TypeScript types are generated in `src/types/database.ts` providing:
- Full type safety for all database operations
- Helper types for common query patterns
- Relationship types for JOIN operations
- API response types for consistent error handling

## Testing

Comprehensive tests cover:
- CRUD operations on all tables
- RLS policy enforcement for all user roles
- Database function correctness
- Trigger behavior verification
- Foreign key constraint validation

## Next Steps

1. **API Routes**: Create Next.js API routes using the database schema
2. **UI Components**: Build React components that consume the typed database
3. **Admin Dashboard**: Implement admin interface for content management
4. **Content Management**: Build blog post and project creation interfaces
