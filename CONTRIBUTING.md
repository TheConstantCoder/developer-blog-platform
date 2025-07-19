# Contributing to Developer Blog Platform

Thank you for your interest in contributing to the Developer Blog Platform! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- Git

### Setup Development Environment

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/developer-blog-platform.git
   cd developer-blog-platform
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   # Fill in your Supabase credentials
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## 📝 Development Workflow

### Code Style

We use automated tools to maintain code quality:

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

Run these commands before committing:

```bash
npm run lint:fix      # Fix linting issues
npm run format        # Format code
npm run type-check    # Check TypeScript types
npm run validate      # Run all checks
```

### Testing

- **Unit Tests**: `npm run test`
- **Database Tests**: `npm run test:migrations`
- **Watch Mode**: `npm run test:watch`
- **Coverage**: `npm run test:coverage`

### Database Changes

When making database changes:

1. Create migration files in `supabase/migrations/`
2. Update TypeScript types in `src/types/database.ts`
3. Test migrations with `npm run test:migrations`
4. Update documentation if needed

## 🔄 Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Follow existing code patterns
   - Add tests for new functionality
   - Update documentation as needed

3. **Validate Changes**
   ```bash
   npm run validate
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Format

We follow conventional commits:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions or changes
- `chore:` Maintenance tasks

## 🐛 Bug Reports

When reporting bugs, please include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node.js version, etc.)
- Screenshots if applicable

## 💡 Feature Requests

For feature requests:

- Check existing issues first
- Provide clear use case and rationale
- Consider implementation complexity
- Be open to discussion and feedback

## 📚 Resources

- [Project Documentation](./docs/)
- [Database Schema](./docs/DATABASE_SCHEMA.md)
- [API Documentation](./docs/api/)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain professional communication

## 📞 Getting Help

- Create an issue for bugs or questions
- Check existing documentation first
- Be specific about your problem
- Provide relevant context

Thank you for contributing! 🎉
