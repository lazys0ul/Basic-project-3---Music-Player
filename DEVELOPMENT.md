# � Development Guide

This document provides comprehensive information for developers working with the Resona Music Platform.

## 🏗️ Project Architecture

### 📁 Directory Structure
```
resona-music-platform/
├── 📁 backend/                    # Server-side application
│   ├── 📁 config/                # Configuration files
│   │   └── mongoDB.js            # Database connection setup
│   ├── 📁 controllers/           # Business logic handlers
│   │   └── userController.js     # User management logic
│   ├── 📁 middleware/            # Express middleware
│   │   ├── auth.js              # JWT authentication
│   │   ├── multer.js            # File upload handling
│   │   └── validation.js        # Input validation
│   ├── 📁 models/               # Database schemas
│   │   ├── userModel.js         # User data model
│   │   └── musicModel.js        # Music data model
│   ├── 📁 routes/               # API endpoint definitions
│   │   ├── authRoutes.js        # Authentication routes
│   │   └── musicRoutes.js       # Music-related routes
│   ├── 📁 scripts/              # Utility scripts
│   │   ├── check-database.js    # Database inspection
│   │   └── recover-music.js     # Data recovery utilities
│   ├── 📁 uploads/              # File storage directory
│   ├── 📁 utils/                # Helper functions
│   │   ├── logger.js            # Logging utilities
│   │   └── validateEnv.js       # Environment validation
│   └── server.js                # Main application entry
├── 📁 frontend/                  # Client-side application
│   ├── 📁 public/               # Static assets
│   │   ├── manifest.json        # PWA manifest
│   │   └── *.png, *.svg         # Icons and images
│   ├── 📁 src/                  # React application
│   │   ├── 📁 assets/           # Images and brand assets
│   │   ├── 📁 components/       # React components
│   │   │   ├── 📁 Auth/         # Authentication components
│   │   │   ├── 📁 Dashboard/    # Main application views
│   │   │   └── 📁 Player/       # Music player components
│   │   ├── 📁 context/          # React Context providers
│   │   │   ├── AuthContext.jsx  # Authentication state
│   │   │   └── MusicContext.jsx # Music player state
│   │   ├── 📁 hooks/            # Custom React hooks
│   │   │   ├── useAuth.js       # Authentication hook
│   │   │   └── useMusic.js      # Music management hook
│   │   └── 📁 utils/            # Frontend utilities
│   │       └── constants.js     # Configuration constants
│   └── vite.config.js           # Vite build configuration
└── 📄 Configuration Files
    ├── docker-compose.yml       # Docker container setup
    ├── render.yaml              # Render.com deployment
    └── package.json             # Project dependencies
```
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

2. **Environment Configuration**

Backend `.env`:
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=resona_music_player
JWT_SECRET=your_secure_jwt_secret_key_minimum_32_characters
PORT=5000
NODE_ENV=development
```

Frontend `.env`:
```env
VITE_API_URL=http://localhost:5000
```

3. **Start Development Servers**
```bash
# Option 1: Start both servers (from root)
npm run dev

# Option 2: Start separately
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

## 🏗️ Project Architecture

### Backend Structure
```
backend/
├── server.js              # Main entry point
├── config/
│   └── mongoDB.js         # Database connection
├── controllers/
│   └── userController.js  # Business logic
├── middleware/
│   ├── auth.js           # JWT authentication
│   ├── multer.js         # File upload handling
│   └── validation.js     # Input validation
├── models/
│   ├── userModel.js      # User schema
│   └── musicModel.js     # Music schema
├── routes/
│   ├── authRoutes.js     # Authentication routes
│   └── musicRoutes.js    # Music CRUD routes
├── uploads/              # File storage
└── utils/
    ├── logger.js         # Logging utility
    └── validateEnv.js    # Environment validation
```

### Frontend Structure
```
frontend/src/
├── App.jsx               # Main app component
├── main.jsx             # React entry point
├── components/
│   ├── Auth/            # Authentication components
│   ├── Dashboard/       # Main dashboard
│   └── Player/          # Music player
├── context/
│   ├── AuthContext.jsx  # Authentication state
│   └── MusicContext.jsx # Music player state
├── hooks/
│   ├── useAuth.js       # Authentication hook
│   └── useMusic.js      # Music player hook
├── assets/              # Static assets
└── utils/               # Helper utilities
```

## 🔧 Development Workflow

### Code Standards
- **ESLint** - Linting configuration included
- **Prettier** - Code formatting (install extension)
- **Conventional Commits** - Use semantic commit messages

### Commit Message Format
```
type(scope): description

Examples:
feat(auth): add password reset functionality
fix(player): resolve audio streaming issue
docs(api): update endpoint documentation
style(ui): improve button hover effects
```

### Branch Strategy
```bash
main           # Production-ready code
develop        # Integration branch
feature/*      # New features
bugfix/*       # Bug fixes
hotfix/*       # Emergency fixes
```

### Creating a New Feature
```bash
# 1. Create feature branch
git checkout -b feature/new-feature-name

# 2. Make changes and test locally

# 3. Commit with semantic messages
git add .
git commit -m "feat(component): add new feature description"

# 4. Push and create PR
git push origin feature/new-feature-name
```

## 🧪 Testing

### Backend Testing
```bash
cd backend

# Unit tests
npm test

# Test with coverage
npm run test:coverage

# Integration tests
npm run test:integration
```

### Frontend Testing
```bash
cd frontend

# Component tests
npm test

# E2E tests (if configured)
npm run test:e2e
```

### Manual Testing Checklist
- [ ] User registration/login
- [ ] File upload (audio + image)
- [ ] Music playback controls
- [ ] Search functionality
- [ ] Responsive design
- [ ] Error handling

## 🐛 Debugging

### Backend Debugging
```bash
# Enable debug logs
DEBUG=app:* npm run dev

# Use Node.js debugger
node --inspect server.js
```

### Frontend Debugging
- React DevTools extension
- Browser DevTools
- Console logging with `useEffect` debugging

### Common Issues & Solutions

**1. CORS Errors**
- Check `ALLOWED_ORIGINS` in backend `.env`
- Ensure frontend URL is in CORS whitelist

**2. File Upload Issues**
- Verify file size limits
- Check file type validation
- Ensure `uploads/` directory exists

**3. Authentication Problems**
- Verify JWT secret is set
- Check token expiration
- Ensure authorization header format: `Bearer <token>`

**4. Database Connection Issues**
- Verify MongoDB is running
- Check connection string format
- Ensure database permissions

## 📦 Building & Deployment

### Development Build
```bash
# Frontend development build
cd frontend
npm run build

# Backend doesn't need building (Node.js runtime)
```

### Production Deployment

**Environment Variables (Production)**
```env
NODE_ENV=production
JWT_SECRET=super_secure_production_secret_64_characters_minimum
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/dbname
```

**Docker Deployment**
```bash
# Build and run with Docker Compose
docker-compose up --build -d
```

**Manual Server Deployment**
```bash
# Install PM2 for process management
npm install -g pm2

# Start backend with PM2
cd backend
pm2 start server.js --name resona-api

# Serve frontend with nginx
# Build frontend first
cd ../frontend
npm run build
# Copy dist/ contents to nginx webroot
```

## 🔍 Performance Optimization

### Backend Optimization
- Use MongoDB indexes for faster queries
- Implement response caching
- Optimize file serving with CDN
- Use connection pooling

### Frontend Optimization
- Code splitting with React.lazy()
- Image optimization (WebP format)
- Bundle size analysis: `npm run analyze`
- Service worker for caching

### Monitoring
```bash
# Monitor API performance
npm install -g clinic
clinic doctor -- node server.js

# Bundle analysis
cd frontend
npm run build:analyze
```

## 🚦 Code Quality

### Pre-commit Hooks
```bash
# Install husky for git hooks
npm install --save-dev husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run test"
```

### Quality Gates
- All tests must pass
- Code coverage > 80%
- No ESLint errors
- Security audit passes: `npm audit`

## 🔐 Security Considerations

### Development Security
- Never commit `.env` files
- Use strong JWT secrets (32+ characters)
- Validate all user inputs
- Sanitize file uploads
- Keep dependencies updated

### Production Security Checklist
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Database access restricted
- [ ] File upload limits enforced
- [ ] Rate limiting active
- [ ] Error messages don't expose system info

## 📚 Useful Resources

### Documentation
- [React 19 Docs](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [JWT.io](https://jwt.io/)

### Development Tools
- **VS Code Extensions:**
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
  - ESLint
  - MongoDB for VS Code
  - Thunder Client (API testing)

### Libraries Used
```json
{
  "backend": {
    "express": "Web framework",
    "mongoose": "MongoDB ODM", 
    "jsonwebtoken": "JWT authentication",
    "bcryptjs": "Password hashing",
    "multer": "File upload handling",
    "helmet": "Security headers",
    "cors": "Cross-origin resource sharing",
    "express-rate-limit": "Rate limiting",
    "express-validator": "Input validation"
  },
  "frontend": {
    "react": "UI framework",
    "vite": "Build tool",
    "axios": "HTTP client",
    "react-router-dom": "Client-side routing", 
    "react-toastify": "Notifications",
    "react-icons": "Icon library",
    "tailwindcss": "CSS framework"
  }
}
```

## 🤝 Contributing Guidelines

### Getting Started
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Update documentation
6. Submit a pull request

### Pull Request Process
1. Ensure all tests pass
2. Update README.md if needed
3. Add screenshots for UI changes
4. Use clear PR description
5. Link related issues

### Code Review Checklist
- [ ] Code follows project conventions
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No security vulnerabilities
- [ ] Performance considerations addressed

## 📞 Getting Help

### Development Support
- **GitHub Issues**: Report bugs and request features
- **Discord**: Join our developer community
- **Stack Overflow**: Tag questions with `resona-music-player`
- **Email**: dev@resona-music.com

### Frequently Asked Questions

**Q: How do I add a new API endpoint?**
A: 1) Add route in `/routes`, 2) Add controller function, 3) Add validation middleware, 4) Update API documentation

**Q: How do I add a new React component?**
A: 1) Create component in appropriate `/components` subdirectory, 2) Add to index.js if needed, 3) Add tests

**Q: How do I modify the database schema?**
A: 1) Update model file, 2) Create migration script if needed, 3) Update API responses, 4) Test thoroughly

---

Happy coding! 🚀 Build amazing music experiences with Resona.
