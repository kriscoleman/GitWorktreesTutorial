#!/bin/bash

# Git Worktrees Tutorial Setup Script
# Creates a practice environment for learning git worktrees

set -e  # Exit on any error

echo "🌳 Git Worktrees Tutorial Setup"
echo "==============================="
echo

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo "❌ Error: Not inside a git repository"
    echo "Please run this script from within the GitWorktreesTutorial repository"
    exit 1
fi

# Get the repository name and parent directory
REPO_NAME=$(basename "$(git rev-parse --show-toplevel)")
PARENT_DIR=$(dirname "$(git rev-parse --show-toplevel)")

echo "📁 Repository: $REPO_NAME"
echo "📂 Parent Directory: $PARENT_DIR"
echo

# Function to create worktree if it doesn't exist
create_worktree() {
    local path="$1"
    local branch="$2"
    local description="$3"
    
    if [ -d "$path" ]; then
        echo "⚠️  Worktree already exists: $path"
    else
        echo "🌱 Creating worktree: $description"
        git worktree add "$path" "$branch" 2>/dev/null || {
            echo "❌ Failed to create worktree: $path"
            return 1
        }
        echo "✅ Created: $path"
    fi
}

# Create practice worktrees for exercises
echo "🛠️  Creating practice worktrees..."
echo

# Ensure we have some commits to work with
if [ $(git rev-list --count HEAD) -eq 0 ]; then
    echo "⚠️  Repository has no commits. Creating initial commit..."
    git add .
    git commit -m "Initial commit for Git Worktrees Tutorial" || true
fi

# Exercise 1: Basic operations
create_worktree "../${REPO_NAME}-practice" -b practice/basic-operations "Basic operations practice"

# Exercise 2: Parallel features  
create_worktree "../${REPO_NAME}-feature-a" -b feature/component-library "Feature A: Component Library"
create_worktree "../${REPO_NAME}-feature-b" -b feature/user-auth "Feature B: User Authentication"

# Exercise 3: Hotfix workflow
create_worktree "../${REPO_NAME}-hotfix" main "Hotfix environment (main branch)"

# Exercise 4: AI agents (create base directories)
create_worktree "../${REPO_NAME}-ai-frontend" -b ai/frontend-agent "AI Agent: Frontend Development"
create_worktree "../${REPO_NAME}-ai-backend" -b ai/backend-agent "AI Agent: Backend Development"

echo
echo "📋 Practice Environment Created!"
echo "================================"
echo

# List all worktrees
echo "🌳 Available Worktrees:"
git worktree list

echo
echo "💡 Next Steps:"
echo "1. Start with Exercise 1: cd exercises/01-basic-worktree/"
echo "2. Follow the tutorial exercises in order"
echo "3. Use these worktrees for hands-on practice"
echo "4. Run ./scripts/cleanup-worktrees.sh when done"
echo

echo "🎯 Pro Tips:"
echo "- Each worktree is independent - perfect for context switching"
echo "- Use 'git worktree list' to see all your worktrees"
echo "- Run 'git worktree prune' to clean up orphaned references"
echo

echo "✨ Setup complete! Happy learning! 🚀"