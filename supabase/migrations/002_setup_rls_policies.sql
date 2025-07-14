-- Migration: Setup Row Level Security (RLS) policies
-- Created: 2025-07-14
-- Description: Implements RLS policies for guests, authenticated users, and admins

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = user_id AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is moderator or admin
CREATE OR REPLACE FUNCTION is_moderator_or_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = user_id AND role IN ('admin', 'moderator')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- PROFILES TABLE POLICIES
-- Guests and users can view public profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (is_public = true);

-- Users can view their own profile (even if private)
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (is_admin(auth.uid()));

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Admins can update any profile
CREATE POLICY "Admins can update any profile" ON profiles
    FOR UPDATE USING (is_admin(auth.uid()));

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins can delete profiles
CREATE POLICY "Admins can delete profiles" ON profiles
    FOR DELETE USING (is_admin(auth.uid()));

-- POSTS TABLE POLICIES
-- Everyone can view published posts
CREATE POLICY "Published posts are viewable by everyone" ON posts
    FOR SELECT USING (status = 'published');

-- Users can view their own posts (any status)
CREATE POLICY "Users can view own posts" ON posts
    FOR SELECT USING (auth.uid() = author_id);

-- Admins can view all posts
CREATE POLICY "Admins can view all posts" ON posts
    FOR SELECT USING (is_admin(auth.uid()));

-- Users can create their own posts
CREATE POLICY "Users can create own posts" ON posts
    FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Users can update their own posts
CREATE POLICY "Users can update own posts" ON posts
    FOR UPDATE USING (auth.uid() = author_id);

-- Admins can update any post
CREATE POLICY "Admins can update any post" ON posts
    FOR UPDATE USING (is_admin(auth.uid()));

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts" ON posts
    FOR DELETE USING (auth.uid() = author_id);

-- Admins can delete any post
CREATE POLICY "Admins can delete any post" ON posts
    FOR DELETE USING (is_admin(auth.uid()));

-- PROJECTS TABLE POLICIES
-- Everyone can view public projects with active/completed status
CREATE POLICY "Public projects are viewable by everyone" ON projects
    FOR SELECT USING (is_public = true AND status IN ('active', 'completed'));

-- Users can view their own projects (any status/visibility)
CREATE POLICY "Users can view own projects" ON projects
    FOR SELECT USING (auth.uid() = author_id);

-- Admins can view all projects
CREATE POLICY "Admins can view all projects" ON projects
    FOR SELECT USING (is_admin(auth.uid()));

-- Users can create their own projects
CREATE POLICY "Users can create own projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Users can update their own projects
CREATE POLICY "Users can update own projects" ON projects
    FOR UPDATE USING (auth.uid() = author_id);

-- Admins can update any project
CREATE POLICY "Admins can update any project" ON projects
    FOR UPDATE USING (is_admin(auth.uid()));

-- Users can delete their own projects
CREATE POLICY "Users can delete own projects" ON projects
    FOR DELETE USING (auth.uid() = author_id);

-- Admins can delete any project
CREATE POLICY "Admins can delete any project" ON projects
    FOR DELETE USING (is_admin(auth.uid()));

-- TAGS TABLE POLICIES
-- Everyone can view tags
CREATE POLICY "Tags are viewable by everyone" ON tags
    FOR SELECT USING (true);

-- Only admins and moderators can create tags
CREATE POLICY "Moderators and admins can create tags" ON tags
    FOR INSERT WITH CHECK (is_moderator_or_admin(auth.uid()));

-- Only admins and moderators can update tags
CREATE POLICY "Moderators and admins can update tags" ON tags
    FOR UPDATE USING (is_moderator_or_admin(auth.uid()));

-- Only admins can delete tags
CREATE POLICY "Admins can delete tags" ON tags
    FOR DELETE USING (is_admin(auth.uid()));
