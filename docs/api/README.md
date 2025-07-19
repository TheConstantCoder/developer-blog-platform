# API Documentation

This directory contains API documentation for the Developer Blog Platform.

## 🔗 API Endpoints

The platform uses Supabase for backend services, providing:

### Authentication
- **POST** `/auth/signin` - User sign in
- **POST** `/auth/signup` - User registration  
- **POST** `/auth/signout` - User sign out
- **GET** `/auth/callback` - OAuth callback handler

### Content Management
- **GET** `/api/posts` - List blog posts
- **GET** `/api/posts/[slug]` - Get specific post
- **POST** `/api/posts` - Create new post (authenticated)
- **PUT** `/api/posts/[id]` - Update post (authenticated)
- **DELETE** `/api/posts/[id]` - Delete post (authenticated)

### Projects
- **GET** `/api/projects` - List projects
- **GET** `/api/projects/[slug]` - Get specific project
- **POST** `/api/projects` - Create new project (authenticated)
- **PUT** `/api/projects/[id]` - Update project (authenticated)
- **DELETE** `/api/projects/[id]` - Delete project (authenticated)

### Tags
- **GET** `/api/tags` - List all tags
- **POST** `/api/tags` - Create new tag (authenticated)

### Newsletter
- **POST** `/api/newsletter/subscribe` - Subscribe to newsletter
- **POST** `/api/newsletter/unsubscribe` - Unsubscribe from newsletter

## 🔐 Authentication

The API uses Supabase authentication with JWT tokens:

```typescript
// Example authenticated request
const { data, error } = await supabase
  .from('posts')
  .select('*')
  .eq('author_id', user.id)
```

## 📝 Request/Response Format

All API endpoints use JSON format:

### Success Response
```json
{
  "data": { ... },
  "error": null
}
```

### Error Response
```json
{
  "data": null,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

## 🛡️ Security

- All endpoints implement Row Level Security (RLS)
- Authentication required for write operations
- Rate limiting applied to public endpoints
- Input validation on all requests

## 📚 Examples

See individual endpoint documentation for detailed examples and schemas.

## 🔧 Development

For local development, ensure:
1. Supabase project is configured
2. Environment variables are set
3. Database migrations are applied

```bash
npm run test:migrations  # Verify database setup
npm run dev             # Start development server
```
