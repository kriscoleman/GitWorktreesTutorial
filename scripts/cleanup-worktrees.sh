#!/bin/bash

# Git Worktrees Tutorial Cleanup Script  
# Safely removes practice worktrees and branches

set -e  # Exit on any error

echo "🧹 Git Worktrees Tutorial Cleanup"
echo "=================================="
echo

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo "❌ Error: Not inside a git repository"
    echo "Please run this script from within the GitWorktreesTutorial repository"
    exit 1
fi

# Get the repository name
REPO_NAME=$(basename "$(git rev-parse --show-toplevel)")

echo "📁 Repository: $REPO_NAME"
echo

# Show current worktrees
echo "📋 Current Worktrees:"
git worktree list
echo

# Show disk usage
echo "💾 Current Disk Usage:"
du -sh ../*"$REPO_NAME"* 2>/dev/null | sort -hr || echo "No additional worktrees found"
echo

# Interactive cleanup options
echo "🤔 Cleanup Options:"
echo "1. Remove all practice worktrees"
echo "2. Remove specific worktree interactively"  
echo "3. Clean up orphaned references only"
echo "4. Show branches and last activity"
echo "5. Full cleanup (worktrees + branches)"
echo "6. Exit"
echo

read -p "Choose an option (1-6): " choice

case $choice in
    1)
        echo "🗑️  Removing all practice worktrees..."
        
        # List of practice worktrees to remove
        PRACTICE_WORKTREES=(
            "../${REPO_NAME}-practice"
            "../${REPO_NAME}-feature-a"
            "../${REPO_NAME}-feature-b"
            "../${REPO_NAME}-hotfix"
            "../${REPO_NAME}-ai-frontend"
            "../${REPO_NAME}-ai-backend"
        )
        
        for worktree in "${PRACTICE_WORKTREES[@]}"; do
            if [ -d "$worktree" ]; then
                echo "🗑️  Removing: $worktree"
                git worktree remove "$worktree" 2>/dev/null && echo "✅ Removed: $worktree" || echo "⚠️  Could not remove: $worktree"
            fi
        done
        
        echo "✅ Practice worktrees cleanup complete!"
        ;;
        
    2)
        echo "🎯 Interactive worktree removal:"
        echo
        
        git worktree list | while IFS= read -r line; do
            path=$(echo "$line" | awk '{print $1}')
            current_dir=$(pwd)
            
            # Skip the current directory
            if [ "$path" != "$current_dir" ]; then
                echo "Worktree: $line"
                read -p "Remove this worktree? (y/N): " confirm
                if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
                    git worktree remove "$path" 2>/dev/null && echo "✅ Removed: $path" || echo "❌ Failed to remove: $path"
                else
                    echo "⏭️  Skipped: $path"
                fi
                echo
            fi
        done
        ;;
        
    3)
        echo "🧹 Cleaning up orphaned references..."
        git worktree prune
        echo "✅ Orphaned references cleaned!"
        ;;
        
    4)
        echo "📅 Branches by last activity:"
        echo
        git for-each-ref --sort=-committerdate refs/heads/ --format="%(committerdate:short) %(refname:short) (%(committerdate:relative))"
        ;;
        
    5)
        echo "💥 Full cleanup mode!"
        echo "This will remove ALL practice worktrees and branches"
        read -p "Are you sure? This cannot be undone! (yes/NO): " confirm
        
        if [ "$confirm" = "yes" ]; then
            echo "🗑️  Removing all practice worktrees..."
            
            # Remove worktrees
            PRACTICE_WORKTREES=(
                "../${REPO_NAME}-practice"
                "../${REPO_NAME}-feature-a" 
                "../${REPO_NAME}-feature-b"
                "../${REPO_NAME}-hotfix"
                "../${REPO_NAME}-ai-frontend"
                "../${REPO_NAME}-ai-backend"
            )
            
            for worktree in "${PRACTICE_WORKTREES[@]}"; do
                if [ -d "$worktree" ]; then
                    git worktree remove "$worktree" 2>/dev/null && echo "✅ Removed worktree: $worktree"
                fi
            done
            
            echo "🗑️  Removing practice branches..."
            
            # Remove associated branches (safely)
            PRACTICE_BRANCHES=(
                "practice/basic-operations"
                "feature/component-library"
                "feature/user-auth"
                "ai/frontend-agent"
                "ai/backend-agent"
            )
            
            for branch in "${PRACTICE_BRANCHES[@]}"; do
                if git show-ref --verify --quiet "refs/heads/$branch"; then
                    git branch -D "$branch" 2>/dev/null && echo "✅ Removed branch: $branch"
                fi
            done
            
            # Clean up any orphaned references
            git worktree prune
            
            echo "✅ Full cleanup complete!"
        else
            echo "❌ Full cleanup cancelled"
        fi
        ;;
        
    6)
        echo "👋 Cleanup cancelled. Goodbye!"
        exit 0
        ;;
        
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo
echo "📊 Final Status:"
echo "=================="
echo

# Show remaining worktrees
echo "🌳 Remaining Worktrees:"
git worktree list

echo
echo "📈 Remaining Disk Usage:"
du -sh ../*"$REPO_NAME"* 2>/dev/null | sort -hr || echo "No additional worktrees found"

echo
echo "💡 Pro Tips:"
echo "- Run 'git worktree prune' regularly to clean orphaned references"
echo "- Use 'git worktree list' to check your current worktrees"  
echo "- Consider running this cleanup after completing exercises"
echo

echo "✨ Cleanup session complete! 🎉"