#!/bin/bash

# K6 Framework Generator - GitHub Deployment Script
# This script prepares and pushes the project to GitHub

echo "🚀 K6 Framework Generator - GitHub Deployment"
echo "=============================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
fi

# Add remote origin if not exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 Adding GitHub remote..."
    git remote add origin https://github.com/EdgardoZar/k6_framework_generator.git
    echo "✅ GitHub remote added"
fi

# Check if we're on main branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo "🌿 Switching to main branch..."
    git checkout -b main 2>/dev/null || git checkout main
    echo "✅ Switched to main branch"
fi

# Add all files
echo "📦 Adding files to Git..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "ℹ️  No changes to commit"
else
    echo "💾 Committing changes..."
    git commit -m "Initial commit: K6 Framework Generator v1.0.0

- Complete k6 framework generation from JSON configuration
- AI-friendly configuration system with prompt template
- Comprehensive validation and auto-fix capabilities
- Multiple example configurations and templates
- Full documentation and usage guides
- CI/CD pipeline and GitHub templates
- MIT License and contribution guidelines"
    echo "✅ Changes committed"
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Successfully deployed to GitHub!"
    echo "=============================================="
    echo "📁 Repository: https://github.com/EdgardoZar/k6_framework_generator"
    echo "📖 README: https://github.com/EdgardoZar/k6_framework_generator#readme"
    echo "📋 Issues: https://github.com/EdgardoZar/k6_framework_generator/issues"
    echo "💬 Discussions: https://github.com/EdgardoZar/k6_framework_generator/discussions"
    echo ""
    echo "🚀 Next Steps:"
    echo "1. Visit the repository on GitHub"
    echo "2. Check the README and documentation"
    echo "3. Try the examples and sample configurations"
    echo "4. Star the repository if you find it useful!"
    echo "5. Contribute by reporting issues or submitting PRs"
    echo ""
    echo "Happy Performance Testing! 🎯"
else
    echo "❌ Failed to push to GitHub"
    echo "Please check your GitHub credentials and repository permissions"
    exit 1
fi
