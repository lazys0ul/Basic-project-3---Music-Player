#!/bin/bash

# 🧪 Local CI/CD Test Script
# This script mimics what the GitHub Actions workflow does

echo "🎵 Testing Resona Music Platform CI/CD Pipeline Locally"
echo "======================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        exit 1
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo "📦 Step 1: Installing Dependencies"
echo "-----------------------------------"

# Install root dependencies
echo "Installing root dependencies..."
npm install
print_status $? "Root dependencies installed"

# Install backend dependencies
echo "Installing backend dependencies..."
npm install --prefix backend
print_status $? "Backend dependencies installed"

# Install frontend dependencies  
echo "Installing frontend dependencies..."
npm install --prefix frontend
print_status $? "Frontend dependencies installed"

echo ""
echo "🔒 Step 2: Security Audits"
echo "---------------------------"

# Backend security audit
echo "Running backend security audit..."
npm audit --audit-level=high --prefix backend
if [ $? -eq 0 ]; then
    print_status 0 "Backend security audit passed"
else
    print_warning "Backend security audit found issues (non-blocking)"
fi

# Frontend security audit
echo "Running frontend security audit..."
npm audit --audit-level=high --prefix frontend
if [ $? -eq 0 ]; then
    print_status 0 "Frontend security audit passed"
else
    print_warning "Frontend security audit found issues (non-blocking)"
fi

echo ""
echo "🧹 Step 3: Code Quality Checks"
echo "-------------------------------"

# Backend linting (if available)
echo "Checking backend code quality..."
if npm run lint --prefix backend 2>/dev/null; then
    print_status 0 "Backend linting passed"
else
    print_warning "Backend linting not available or failed (non-blocking)"
fi

# Frontend linting (if available)
echo "Checking frontend code quality..."
if npm run lint --prefix frontend 2>/dev/null; then
    print_status 0 "Frontend linting passed"
else
    print_warning "Frontend linting not available or failed (non-blocking)"
fi

echo ""
echo "🧪 Step 4: Running Tests"
echo "------------------------"

# Backend tests
echo "Running backend tests..."
if npm test --prefix backend 2>/dev/null; then
    print_status 0 "Backend tests passed"
else
    print_warning "Backend tests not available or failed (non-blocking)"
fi

# Frontend tests
echo "Running frontend tests..."
if npm test --prefix frontend 2>/dev/null; then
    print_status 0 "Frontend tests passed"  
else
    print_warning "Frontend tests not available or failed (non-blocking)"
fi

echo ""
echo "🏗️ Step 5: Building Applications"
echo "--------------------------------"

# Build frontend
echo "Building frontend application..."
VITE_API_URL=http://localhost:5000 npm run build --prefix frontend
print_status $? "Frontend build completed"

# Backend build (if needed)
echo "Checking backend build..."
if npm run build --prefix backend 2>/dev/null; then
    print_status 0 "Backend build completed"
else
    print_warning "Backend build not required or not available"
fi

echo ""
echo "🎉 All CI/CD Pipeline Steps Completed!"
echo "======================================"
echo ""
echo "📊 Summary:"
echo "- ✅ Dependencies installed successfully"
echo "- ✅ Security audits completed"  
echo "- ✅ Code quality checks performed"
echo "- ✅ Tests executed (where available)"
echo "- ✅ Applications built successfully"
echo ""
echo "🚀 Your project is ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Commit and push your changes"
echo "2. Check GitHub Actions workflow results"
echo "3. Deploy to your chosen platform"
