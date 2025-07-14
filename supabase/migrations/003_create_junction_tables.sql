-- Migration: Create junction tables and additional features
-- Created: 2025-07-14
-- Description: Creates post_tags, project_tags, comments, and newsletter_subscribers tables

-- Create post_tags junction table (many-to-many: posts ↔ tags)
CREATE TABLE IF NOT EXISTS post_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, tag_id)
);

-- Create project_tags junction table (many-to-many: projects ↔ tags)
CREATE TABLE IF NOT EXISTS project_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, tag_id)
);

-- Create comments table (user interactions)
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- For nested comments
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create newsletter_subscribers table (email list)
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ,
    confirmation_token TEXT,
    is_confirmed BOOLEAN DEFAULT false
);

-- Create indexes for junction tables
CREATE INDEX IF NOT EXISTS idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag_id ON post_tags(tag_id);

CREATE INDEX IF NOT EXISTS idx_project_tags_project_id ON project_tags(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tags_tag_id ON project_tags(tag_id);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);
CREATE INDEX IF NOT EXISTS idx_comments_is_approved ON comments(is_approved);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_is_active ON newsletter_subscribers(is_active);
CREATE INDEX IF NOT EXISTS idx_newsletter_is_confirmed ON newsletter_subscribers(is_confirmed);

-- Enable RLS on junction tables
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- POST_TAGS POLICIES
-- Everyone can view post tags for published posts
CREATE POLICY "Post tags viewable for published posts" ON post_tags
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM posts 
            WHERE posts.id = post_tags.post_id 
            AND posts.status = 'published'
        )
    );

-- Users can view tags for their own posts
CREATE POLICY "Users can view own post tags" ON post_tags
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM posts 
            WHERE posts.id = post_tags.post_id 
            AND posts.author_id = auth.uid()
        )
    );

-- Admins can view all post tags
CREATE POLICY "Admins can view all post tags" ON post_tags
    FOR SELECT USING (is_admin(auth.uid()));

-- Users can manage tags for their own posts
CREATE POLICY "Users can manage own post tags" ON post_tags
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM posts 
            WHERE posts.id = post_tags.post_id 
            AND posts.author_id = auth.uid()
        )
    );

-- Admins can manage all post tags
CREATE POLICY "Admins can manage all post tags" ON post_tags
    FOR ALL USING (is_admin(auth.uid()));

-- PROJECT_TAGS POLICIES
-- Everyone can view project tags for public projects
CREATE POLICY "Project tags viewable for public projects" ON project_tags
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = project_tags.project_id 
            AND projects.is_public = true 
            AND projects.status IN ('active', 'completed')
        )
    );

-- Users can view tags for their own projects
CREATE POLICY "Users can view own project tags" ON project_tags
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = project_tags.project_id 
            AND projects.author_id = auth.uid()
        )
    );

-- Admins can view all project tags
CREATE POLICY "Admins can view all project tags" ON project_tags
    FOR SELECT USING (is_admin(auth.uid()));

-- Users can manage tags for their own projects
CREATE POLICY "Users can manage own project tags" ON project_tags
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = project_tags.project_id 
            AND projects.author_id = auth.uid()
        )
    );

-- Admins can manage all project tags
CREATE POLICY "Admins can manage all project tags" ON project_tags
    FOR ALL USING (is_admin(auth.uid()));

-- COMMENTS POLICIES
-- Everyone can view approved comments on published posts
CREATE POLICY "Approved comments viewable on published posts" ON comments
    FOR SELECT USING (
        is_approved = true 
        AND EXISTS (
            SELECT 1 FROM posts 
            WHERE posts.id = comments.post_id 
            AND posts.status = 'published'
        )
    );

-- Users can view their own comments (any status)
CREATE POLICY "Users can view own comments" ON comments
    FOR SELECT USING (auth.uid() = author_id);

-- Admins can view all comments
CREATE POLICY "Admins can view all comments" ON comments
    FOR SELECT USING (is_admin(auth.uid()));

-- Authenticated users can create comments
CREATE POLICY "Authenticated users can create comments" ON comments
    FOR INSERT WITH CHECK (
        auth.uid() = author_id 
        AND EXISTS (
            SELECT 1 FROM posts 
            WHERE posts.id = comments.post_id 
            AND posts.status = 'published'
        )
    );

-- Users can update their own comments
CREATE POLICY "Users can update own comments" ON comments
    FOR UPDATE USING (auth.uid() = author_id);

-- Admins can update any comment (for moderation)
CREATE POLICY "Admins can update any comment" ON comments
    FOR UPDATE USING (is_admin(auth.uid()));

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments" ON comments
    FOR DELETE USING (auth.uid() = author_id);

-- Admins can delete any comment
CREATE POLICY "Admins can delete any comment" ON comments
    FOR DELETE USING (is_admin(auth.uid()));

-- NEWSLETTER_SUBSCRIBERS POLICIES
-- Only admins can view newsletter subscribers
CREATE POLICY "Admins can view newsletter subscribers" ON newsletter_subscribers
    FOR SELECT USING (is_admin(auth.uid()));

-- Anyone can subscribe to newsletter
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers
    FOR INSERT WITH CHECK (true);

-- Only admins can update newsletter subscribers
CREATE POLICY "Admins can update newsletter subscribers" ON newsletter_subscribers
    FOR UPDATE USING (is_admin(auth.uid()));

-- Only admins can delete newsletter subscribers
CREATE POLICY "Admins can delete newsletter subscribers" ON newsletter_subscribers
    FOR DELETE USING (is_admin(auth.uid()));

-- Add comments for documentation
COMMENT ON TABLE post_tags IS 'Many-to-many relationship between posts and tags';
COMMENT ON TABLE project_tags IS 'Many-to-many relationship between projects and tags';
COMMENT ON TABLE comments IS 'User comments on blog posts with moderation support';
COMMENT ON TABLE newsletter_subscribers IS 'Email newsletter subscription list';

COMMENT ON COLUMN comments.parent_id IS 'For nested/threaded comments';
COMMENT ON COLUMN comments.is_approved IS 'Whether comment is approved by moderators';
COMMENT ON COLUMN newsletter_subscribers.confirmation_token IS 'Token for email confirmation';
COMMENT ON COLUMN newsletter_subscribers.is_confirmed IS 'Whether email address is confirmed';
