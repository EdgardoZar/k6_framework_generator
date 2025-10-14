# K6 Framework Generator - GitHub Deployment Script (PowerShell)
# This script prepares and pushes the project to GitHub

Write-Host "🚀 K6 Framework Generator - GitHub Deployment" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "📁 Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
}

# Add remote origin if not exists
try {
    $origin = git remote get-url origin 2>$null
    if (-not $origin) {
        throw "No remote origin"
    }
} catch {
    Write-Host "🔗 Adding GitHub remote..." -ForegroundColor Yellow
    git remote add origin https://github.com/EdgardoZar/k6_framework_generator.git
    Write-Host "✅ GitHub remote added" -ForegroundColor Green
}

# Check if we're on main branch
$current_branch = git branch --show-current
if ($current_branch -ne "main") {
    Write-Host "🌿 Switching to main branch..." -ForegroundColor Yellow
    try {
        git checkout main
    } catch {
        git checkout -b main
    }
    Write-Host "✅ Switched to main branch" -ForegroundColor Green
}

# Add all files
Write-Host "📦 Adding files to Git..." -ForegroundColor Yellow
git add .

# Check if there are changes to commit
$staged_changes = git diff --staged --name-only
if ($staged_changes.Count -eq 0) {
    Write-Host "ℹ️  No changes to commit" -ForegroundColor Blue
} else {
    Write-Host "💾 Committing changes..." -ForegroundColor Yellow
    git commit -m "Initial commit: K6 Framework Generator v1.0.0

- Complete k6 framework generation from JSON configuration
- AI-friendly configuration system with prompt template
- Comprehensive validation and auto-fix capabilities
- Multiple example configurations and templates
- Full documentation and usage guides
- CI/CD pipeline and GitHub templates
- MIT License and contribution guidelines"
    Write-Host "✅ Changes committed" -ForegroundColor Green
}

# Push to GitHub
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 Successfully deployed to GitHub!" -ForegroundColor Green
    Write-Host "==============================================" -ForegroundColor Green
    Write-Host "📁 Repository: https://github.com/EdgardoZar/k6_framework_generator" -ForegroundColor Cyan
    Write-Host "📖 README: https://github.com/EdgardoZar/k6_framework_generator#readme" -ForegroundColor Cyan
    Write-Host "📋 Issues: https://github.com/EdgardoZar/k6_framework_generator/issues" -ForegroundColor Cyan
    Write-Host "💬 Discussions: https://github.com/EdgardoZar/k6_framework_generator/discussions" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🚀 Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Visit the repository on GitHub" -ForegroundColor White
    Write-Host "2. Check the README and documentation" -ForegroundColor White
    Write-Host "3. Try the examples and sample configurations" -ForegroundColor White
    Write-Host "4. Star the repository if you find it useful!" -ForegroundColor White
    Write-Host "5. Contribute by reporting issues or submitting PRs" -ForegroundColor White
    Write-Host ""
    Write-Host "Happy Performance Testing! 🎯" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
    Write-Host "Please check your GitHub credentials and repository permissions" -ForegroundColor Red
    exit 1
}
