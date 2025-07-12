# Developer Blog Platform

A modern, full-stack developer blog platform built with Next.js, React, TypeScript, and Supabase.

## 🚀 Features

### Core Features
- **Modern Blog System**: Create, edit, and publish blog posts with Markdown support
- **Developer Portfolio**: Showcase projects, skills, and experience
- **Authentication**: Secure user authentication with Supabase Auth
- **Real-time Comments**: Interactive comment system for blog posts
- **SEO Optimized**: Built-in SEO optimization with Next.js
- **Responsive Design**: Mobile-first design with Tailwind CSS

### Advanced Features
- **Syntax Highlighting**: Code blocks with syntax highlighting
- **Tag System**: Organize posts with tags and categories
- **Search Functionality**: Full-text search across all content
- **Analytics Dashboard**: Track views, engagement, and performance
- **Newsletter Integration**: Email subscription management
- **Social Sharing**: Built-in social media sharing

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Headless UI
- **Backend**: Supabase (Database, Auth, Storage, Edge Functions)
- **Content**: Markdown with Gray Matter
- **Deployment**: Vercel (recommended)
- **Testing**: Jest, React Testing Library

## 📦 Project Structure

```
developer-blog-platform/
├── src/
│   ├── app/                    # Next.js 13+ App Router
│   │   ├── (auth)/            # Authentication routes
│   │   ├── blog/              # Blog routes
│   │   ├── projects/          # Portfolio routes
│   │   └── admin/             # Admin dashboard
│   ├── components/            # Reusable React components
│   │   ├── ui/               # Base UI components
│   │   ├── blog/             # Blog-specific components
│   │   └── layout/           # Layout components
│   ├── lib/                  # Utility functions and configurations
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript type definitions
│   └── styles/               # Global styles
├── public/                   # Static assets
├── content/                  # Markdown blog posts (optional)
├── supabase/                 # Supabase configuration and migrations
└── docs/                     # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd developer-blog-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Set up Supabase**
   ```bash
   # Initialize Supabase (if not already done)
   npx supabase init
   
   # Start local Supabase (optional for development)
   npx supabase start
   
   # Run migrations
   npx supabase db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Development Workflow

### Creating Blog Posts
1. **Database Method**: Use the admin dashboard to create posts
2. **Markdown Method**: Add `.md` files to the `content/` directory
3. **API Method**: Use the REST API endpoints

### Database Schema
The platform uses the following main tables:
- `posts` - Blog posts and articles
- `projects` - Portfolio projects
- `comments` - User comments
- `tags` - Content tags
- `profiles` - User profiles

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks
- `npm run test` - Run tests

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vercel](https://vercel.com/) for seamless deployment

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the [documentation](./docs/)
- Contact the maintainer

---

**Happy coding! 🚀**