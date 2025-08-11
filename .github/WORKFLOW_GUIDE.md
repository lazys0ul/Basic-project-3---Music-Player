# 🔧 GitHub Actions Workflow Guide

## Overview
This document explains the CI/CD workflow setup and provides troubleshooting guidance.

## Workflow Structure

### 🔍 Code Quality Job
- **Purpose**: Runs security audits, linting, and code analysis
- **Dependencies**: Root npm packages + workspace dependencies
- **Key Steps**: 
  - Install dependencies across all workspaces
  - Run security audit with high-level threats only
  - Lint backend and frontend code (non-blocking)
  - Run Super Linter for comprehensive code analysis

### 🧪 Backend Tests Job
- **Purpose**: Test backend functionality with real MongoDB
- **Services**: MongoDB 6.0 container
- **Matrix Strategy**: Tests on Node.js 18.x and 20.x
- **Coverage**: Uploads coverage reports to Codecov

### 🎨 Frontend Tests Job  
- **Purpose**: Test and build frontend application
- **Matrix Strategy**: Tests on Node.js 18.x and 20.x
- **Artifacts**: Uploads build artifacts for deployment
- **Bundle Analysis**: Checks bundle size (when configured)

### 🌐 E2E Tests Job
- **Purpose**: End-to-end testing with full application stack
- **Triggers**: Only on pull requests
- **Services**: Full MongoDB + App stack
- **Future**: Ready for Playwright/Cypress integration

### 🐳 Docker Build Job
- **Purpose**: Build and scan container images
- **Registry**: GitHub Container Registry (ghcr.io)
- **Security**: Trivy vulnerability scanning
- **Platforms**: Multi-arch (AMD64 + ARM64)

### 🚀 Deployment Jobs
- **Production**: Deploys on main branch pushes
- **Health Checks**: Post-deployment verification
- **Environments**: Uses GitHub environments for protection

## Troubleshooting Common Issues

### Exit Code 249 (npm script not found)
**Cause**: Missing or incorrectly named npm script
**Solution**: Verify script exists in package.json or update workflow

### Infinite Installation Loops
**Cause**: postinstall hook calling scripts that trigger npm install
**Solution**: Remove recursive installation patterns

### Workspace Dependencies
**Cause**: npm workspaces not properly configured
**Solution**: Use explicit --prefix commands for sub-packages

### MongoDB Connection Issues
**Cause**: Service container not ready or wrong connection string
**Solution**: Add health checks and proper wait conditions

### Memory/Timeout Issues
**Cause**: Long-running processes or resource exhaustion
**Solution**: Increase timeout-minutes or optimize dependencies

## Environment Variables

### Required Secrets
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions
- `RENDER_API_KEY`: For deployment to Render (if used)
- `CODECOV_TOKEN`: For coverage reporting (optional)

### Environment-Specific Variables
```yaml
NODE_ENV: test|production
MONGO_URL: mongodb://localhost:27017/test_db
JWT_SECRET: your-test-jwt-secret
VITE_API_URL: https://api.your-domain.com
```

## Optimization Tips

### 1. Cache Management
- Use `cache: 'npm'` in setup-node action
- Consider caching node_modules for faster builds

### 2. Conditional Jobs
- Use `if` conditions to skip unnecessary jobs
- Skip documentation-only changes with `paths-ignore`

### 3. Parallel Execution
- Jobs run in parallel when possible
- Use `needs` to create dependencies only when required

### 4. Resource Management
- Set appropriate `timeout-minutes`
- Use matrix strategies efficiently

## Monitoring & Notifications

### Success Metrics
- ✅ All jobs pass consistently
- ✅ Coverage reports are generated
- ✅ Security scans show no high-severity issues
- ✅ Deployments complete successfully

### Failure Response
1. Check job logs for specific error messages
2. Verify environment variables and secrets
3. Test locally to reproduce issues
4. Update workflow configuration as needed

## Future Enhancements

### Planned Improvements
- [ ] Implement actual E2E tests with Playwright
- [ ] Add performance benchmarking
- [ ] Integrate with external monitoring services
- [ ] Add automatic dependency updates
- [ ] Implement blue-green deployments

### Configuration Templates
- [ ] Environment-specific workflow files
- [ ] Reusable workflow templates
- [ ] Custom actions for common tasks
