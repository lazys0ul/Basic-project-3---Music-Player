# 🤝 Contributing to Resona Music Platform

Thank you for your interest in contributing to Resona! This document provides guidelines and information for contributors.

## 🌟 How to Contribute

### 🐛 Reporting Bugs

1. **Search existing issues** to avoid duplicates
2. **Use the bug report template** when creating new issues
3. **Provide detailed information** including:
   - Steps to reproduce the bug
   - Expected vs actual behavior
   - Browser/OS information
   - Screenshots or error messages

### ✨ Suggesting Features

1. **Check the roadmap** to see if the feature is already planned
2. **Open a feature request** with detailed description
3. **Explain the use case** and benefits
4. **Consider implementation complexity**

### 💻 Code Contributions

#### Getting Started
1. Fork the repository
2. Clone your fork locally
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/your-feature`

#### Development Workflow
1. Make your changes following our coding standards
2. Write tests for new functionality
3. Ensure all tests pass: `npm test`
4. Run linting: `npm run lint`
5. Commit with descriptive messages
6. Push to your fork and create a pull request

## 📝 Coding Standards

### JavaScript/React
- Use ES6+ features and modern React patterns
- Follow functional programming principles
- Use descriptive variable and function names
- Add comments for complex logic
- Use TypeScript for type safety (when applicable)

### CSS/Styling
- Use TailwindCSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and colors
- Use semantic HTML elements

### Commit Messages
Follow the conventional commits format:
```
type(scope): description

Examples:
feat(player): add volume control
fix(auth): resolve token expiration
docs(readme): update installation guide
```

## 🧪 Testing

### Running Tests
```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && npm test

# E2E tests
npm run test:e2e
```

### Writing Tests
- Write unit tests for utilities and components
- Add integration tests for API endpoints
- Include E2E tests for critical user flows
- Aim for >80% code coverage

## 📋 Pull Request Guidelines

### Before Submitting
- [ ] Tests pass locally
- [ ] Code follows style guidelines
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated (if applicable)

### PR Description Template
```markdown
## 🎯 What does this PR do?
Brief description of changes

## 🔄 Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## 🧪 How Has This Been Tested?
Describe testing approach

## 📸 Screenshots (if applicable)
Add screenshots for UI changes
```

## 🏷️ Issue Labels

| Label | Description |
|-------|-------------|
| `bug` | Something isn't working |
| `enhancement` | New feature or request |
| `documentation` | Documentation improvements |
| `good first issue` | Good for newcomers |
| `help wanted` | Extra attention needed |
| `priority: high` | High priority issue |
| `priority: low` | Low priority issue |

## 💬 Communication

- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Use GitHub Issues for bugs and features  
- **Pull Requests**: Use PR comments for code review
- **Email**: Contact maintainer for private matters

## 🎉 Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes for significant contributions
- Special mentions in project announcements

Thank you for helping make Resona better! 🎵
