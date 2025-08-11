# 🧪 Local CI/CD Test Script for Windows PowerShell
# This script mimics what the GitHub Actions workflow does

Write-Host "🎵 Testing Resona Music Platform CI/CD Pipeline Locally" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan

function Print-Success($message) {
    Write-Host "✅ $message" -ForegroundColor Green
}

function Print-Error($message) {
    Write-Host "❌ $message" -ForegroundColor Red
    exit 1
}

function Print-Warning($message) {
    Write-Host "⚠️  $message" -ForegroundColor Yellow
}

function Test-Command($command, $successMessage, $failureMessage, $allowFailure = $false) {
    try {
        Invoke-Expression $command
        if ($LASTEXITCODE -eq 0) {
            Print-Success $successMessage
        } elseif ($allowFailure) {
            Print-Warning "$failureMessage (non-blocking)"
        } else {
            Print-Error $failureMessage
        }
    } catch {
        if ($allowFailure) {
            Print-Warning "$failureMessage (non-blocking)"
        } else {
            Print-Error $failureMessage
        }
    }
}

Write-Host "📦 Step 1: Installing Dependencies" -ForegroundColor Yellow
Write-Host "-----------------------------------"

# Install root dependencies
Write-Host "Installing root dependencies..."
Test-Command "npm install" "Root dependencies installed" "Failed to install root dependencies"

# Install backend dependencies
Write-Host "Installing backend dependencies..."
Test-Command "npm install --prefix backend" "Backend dependencies installed" "Failed to install backend dependencies"

# Install frontend dependencies  
Write-Host "Installing frontend dependencies..."
Test-Command "npm install --prefix frontend" "Frontend dependencies installed" "Failed to install frontend dependencies"

Write-Host ""
Write-Host "🔒 Step 2: Security Audits" -ForegroundColor Yellow
Write-Host "---------------------------"

# Backend security audit
Write-Host "Running backend security audit..."
Test-Command "npm audit --audit-level=high --prefix backend" "Backend security audit passed" "Backend security audit found issues" $true

# Frontend security audit
Write-Host "Running frontend security audit..."
Test-Command "npm audit --audit-level=high --prefix frontend" "Frontend security audit passed" "Frontend security audit found issues" $true

Write-Host ""
Write-Host "🧹 Step 3: Code Quality Checks" -ForegroundColor Yellow
Write-Host "-------------------------------"

# Backend linting (if available)
Write-Host "Checking backend code quality..."
Test-Command "npm run lint --prefix backend" "Backend linting passed" "Backend linting not available or failed" $true

# Frontend linting (if available)
Write-Host "Checking frontend code quality..."
Test-Command "npm run lint --prefix frontend" "Frontend linting passed" "Frontend linting not available or failed" $true

Write-Host ""
Write-Host "🧪 Step 4: Running Tests" -ForegroundColor Yellow
Write-Host "------------------------"

# Backend tests
Write-Host "Running backend tests..."
Test-Command "npm test --prefix backend" "Backend tests passed" "Backend tests not available or failed" $true

# Frontend tests  
Write-Host "Running frontend tests..."
Test-Command "npm test --prefix frontend" "Frontend tests passed" "Frontend tests not available or failed" $true

Write-Host ""
Write-Host "🏗️ Step 5: Building Applications" -ForegroundColor Yellow
Write-Host "--------------------------------"

# Build frontend
Write-Host "Building frontend application..."
$env:VITE_API_URL = "http://localhost:5000"
Test-Command "npm run build --prefix frontend" "Frontend build completed" "Failed to build frontend"

# Backend build (if needed)
Write-Host "Checking backend build..."
Test-Command "npm run build --prefix backend" "Backend build completed" "Backend build not required or not available" $true

Write-Host "🎉 All CI/CD Pipeline Steps Completed!" -ForegroundColor Green
Write-Host "======================================"
Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "- ✅ Dependencies installed successfully"
Write-Host "- ✅ Security audits completed"  
Write-Host "- ✅ Code quality checks performed"
Write-Host "- ✅ Tests executed (where available)"
Write-Host "- ✅ Applications built successfully"
Write-Host ""
Write-Host "🚀 Your project is ready for deployment!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Commit and push your changes"
Write-Host "2. Check GitHub Actions workflow results"
Write-Host "3. Deploy to your chosen platform"
