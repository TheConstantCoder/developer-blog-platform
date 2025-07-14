# 🚀 **Developer Blog Platform - Handover Prompt for Database Schema Phase**

## 📋 **Project Context**

You are taking over the **Developer Blog Platform** project, a modern full-stack blog and portfolio platform built with Next.js 14, TypeScript, and Supabase. The project is currently in **Sprint 2: Database & Authentication**.

### **Current Status:**
- ✅ **Phase 1**: Foundation (COMPLETE)
- ✅ **Phase 2**: Supabase & Authentication (COMPLETE)
- 🎯 **Phase 3**: Database Schema Design (READY TO START)

---

## 🎯 **Your Mission: Database Schema Implementation**

**Primary Objective:** Design and implement a comprehensive database schema for the blog platform with proper relationships, security policies, and data integrity.

**Jira Ticket:** SCRUM-6 - "Design and implement database schema"  
**GitHub Issue:** #2 - "Design and implement database schema"  
**Sprint:** Sprint 2 - Database & Authentication  

---

## ✅ **What's Already Complete**

### **🔧 Infrastructure Ready:**
- **Supabase Project**: `developer-blog-platform` (ID: lgnkbjnmrrojwdxabdnj)
- **Authentication**: GitHub OAuth fully functional
- **Environment**: All API keys configured and secured
- **Testing**: Comprehensive test scripts available

### **🔐 Authentication System:**
- GitHub OAuth working end-to-end
- User session management with React context
- Authentication pages (`/auth/signin`, `/auth/callback`)
- Protected route infrastructure ready

### **📁 Codebase Structure:**
```
src/
├── app/auth/          # Authentication pages ✅
├── lib/supabase.ts    # Supabase client ✅
├── app/providers.tsx  # Auth context ✅
└── components/        # UI components ✅
```

---

## 🎯 **Your Tasks: Database Schema Design**

### **Core Tables to Implement:**

#### **1. Profiles Table (User Management)**
```sql
-- User profiles extending Supabase auth.users
profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role user_role DEFAULT 'user',
  github_username TEXT,
  website_url TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

#### **2. Posts Table (Blog Content)**
```sql
-- Blog posts and articles
posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES profiles(id),
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
)
```

#### **3. Projects Table (Portfolio)**
```sql
-- Portfolio projects
projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES profiles(id),
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

#### **4. Tags Table (Content Organization)**
```sql
-- Content categorization
tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

#### **5. Additional Tables:**
- `post_tags` (many-to-many: posts ↔ tags)
- `project_tags` (many-to-many: projects ↔ tags)
- `comments` (user interactions)
- `newsletter_subscribers` (email list)

### **🔐 Security Requirements:**

#### **Row Level Security (RLS) Policies:**
```sql
-- Example: Users can only edit their own content
CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = author_id);

-- Public read access for published content
CREATE POLICY "Anyone can view published posts" ON posts
  FOR SELECT USING (status = 'published');
```

#### **Database Functions & Triggers:**
- Auto-update `updated_at` timestamps
- Slug generation from titles
- Reading time calculation
- View count tracking

---

## 📚 **Resources Available**

### **Documentation:**
- **Supabase Setup Guide**: [Confluence Link](https://geraghtyglenn.atlassian.net/wiki/spaces/SD/pages/5603330/)
- **Product Requirements**: [Confluence Link](https://geraghtyglenn.atlassian.net/wiki/spaces/SD/pages/5734416/)
- **GitHub Repository**: https://github.com/TheConstantCoder/developer-blog-platform

### **Environment Setup:**
```bash
# Clone and setup
git clone https://github.com/TheConstantCoder/developer-blog-platform
cd developer-blog-platform
npm install

# Copy environment template
cp .env.example .env.local
# Add your Supabase credentials

# Test current setup
npm run test:auth
npm run dev
```

### **Supabase Access:**
- **Project URL**: https://lgnkbjnmrrojwdxabdnj.supabase.co
- **Dashboard**: Supabase Dashboard → SQL Editor
- **API Keys**: Available in project settings

---

## 🎯 **Success Criteria**

### **Technical Requirements:**
- [ ] All core tables created with proper relationships
- [ ] RLS policies implemented for security
- [ ] Database functions and triggers working
- [ ] Migration files version controlled
- [ ] TypeScript types generated for tables

### **Testing Requirements:**
- [ ] Database connection tests passing
- [ ] CRUD operations working for all tables
- [ ] RLS policies properly restricting access
- [ ] Performance optimized with indexes

### **Documentation Requirements:**
- [ ] SQL migration files documented
- [ ] Database schema diagram created
- [ ] API usage examples provided
- [ ] Security policies documented

---

## 🔄 **Workflow Process**

### **1. Branch Strategy:**
```bash
git checkout main
git pull origin main
git checkout -b feature/SCRUM-6-database-schema
```

### **2. Development Process:**
1. Create SQL migration files in `supabase/migrations/`
2. Test locally with Supabase CLI
3. Generate TypeScript types
4. Update application code to use new schema
5. Write comprehensive tests

### **3. Completion Process:**
1. Commit all changes with detailed messages
2. Create Pull Request with testing instructions
3. Update Jira ticket (SCRUM-6) to Done
4. Document schema in Confluence
5. Prepare handover for next phase

---

## ⚠️ **Important Notes**

### **Security Considerations:**
- **Never expose service role key** in client-side code
- **Always use RLS policies** for data protection
- **Test security policies** thoroughly
- **Follow principle of least privilege**

### **Performance Considerations:**
- **Add appropriate indexes** for query optimization
- **Consider pagination** for large datasets
- **Optimize for read-heavy workloads**
- **Plan for future scaling**

### **Integration Points:**
- **Auth Context**: Already implemented, ready for user data
- **API Routes**: Will need to be created for CRUD operations
- **UI Components**: Ready to consume database data
- **Admin Dashboard**: Will need database integration

---

## 🚀 **Next Phase Preview**

After database schema completion, the next phase will be:
- **SCRUM-7**: Complete user authentication system integration
- **SCRUM-8**: Build admin dashboard for content management
- **SCRUM-9**: Implement blog post creation/editing interface

---

## 📞 **Support & Resources**

- **Jira Project**: SCRUM (Developer Blog Platform)
- **Confluence Space**: Software Development (SD)
- **GitHub Issues**: Track progress and blockers
- **Supabase Docs**: https://supabase.com/docs
- **Test Scripts**: `npm run test:auth` for current validation

---

**Ready to build the database foundation that will power the entire platform!** 🚀

*This handover includes all context, requirements, and resources needed to successfully implement the database schema phase.*
