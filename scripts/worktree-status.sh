#!/bin/bash

# Git Worktrees Status Script
# Provides comprehensive overview of all worktrees and their status

set -e  # Exit on any error

echo "🌳 Git Worktrees Status Dashboard"
echo "=================================="
echo

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo "❌ Error: Not inside a git repository"
    exit 1
fi

# Get repository information
REPO_NAME=$(basename "$(git rev-parse --show-toplevel)")
CURRENT_DIR=$(pwd)

echo "📁 Repository: $REPO_NAME"
echo "📍 Current Location: $CURRENT_DIR"
echo

# Function to get git status for a directory
get_git_status() {
    local dir="$1"
    if [ -d "$dir" ]; then
        cd "$dir"
        local status=""
        
        # Check for uncommitted changes
        if ! git diff-index --quiet HEAD -- 2>/dev/null; then
            status="$status 🟡 Modified"
        fi
        
        # Check for untracked files
        if [ -n "$(git ls-files --others --exclude-standard)" ]; then
            status="$status 🔵 Untracked"
        fi
        
        # Check for staged changes
        if ! git diff-index --quiet --cached HEAD -- 2>/dev/null; then
            status="$status 🟢 Staged"
        fi
        
        # Check if clean
        if [ -z "$status" ]; then
            status=" ✅ Clean"
        fi
        
        echo "$status"
        cd - > /dev/null
    else
        echo " ❌ Missing"
    fi
}

# Function to get last commit info
get_last_commit() {
    local dir="$1"
    if [ -d "$dir" ]; then
        cd "$dir"
        local commit_info=$(git log -1 --format="%h %s (%cr)" 2>/dev/null || echo "No commits")
        echo "$commit_info"
        cd - > /dev/null
    else
        echo "Directory not found"
    fi
}

# Function to get branch ahead/behind info
get_branch_sync() {
    local dir="$1"
    if [ -d "$dir" ]; then
        cd "$dir"
        local branch=$(git branch --show-current 2>/dev/null || echo "detached")
        local upstream=$(git rev-parse --abbrev-ref @{upstream} 2>/dev/null || echo "")
        
        if [ -n "$upstream" ]; then
            local ahead=$(git rev-list --count HEAD ^"$upstream" 2>/dev/null || echo "0")
            local behind=$(git rev-list --count "$upstream" ^HEAD 2>/dev/null || echo "0")
            
            if [ "$ahead" -gt 0 ] && [ "$behind" -gt 0 ]; then
                echo "↕️  $ahead ahead, $behind behind"
            elif [ "$ahead" -gt 0 ]; then
                echo "⬆️  $ahead ahead"
            elif [ "$behind" -gt 0 ]; then
                echo "⬇️  $behind behind"
            else
                echo "✅ Up to date"
            fi
        else
            echo "🔗 No upstream"
        fi
        cd - > /dev/null
    fi
}

# Display worktree information
echo "📋 Worktree Overview:"
echo "====================="
echo

# Get list of worktrees
WORKTREES=$(git worktree list --porcelain | awk '/^worktree/ {print $2}')

printf "%-40s %-20s %-20s %-15s\n" "PATH" "BRANCH" "STATUS" "SYNC"
printf "%-40s %-20s %-20s %-15s\n" "$(printf '=%.0s' {1..40})" "$(printf '=%.0s' {1..20})" "$(printf '=%.0s' {1..20})" "$(printf '=%.0s' {1..15})"

while IFS= read -r worktree_path; do
    if [ -n "$worktree_path" ]; then
        cd "$worktree_path"
        branch=$(git branch --show-current 2>/dev/null || echo "detached")
        status=$(get_git_status "$worktree_path")
        sync=$(get_branch_sync "$worktree_path")
        
        # Highlight current directory
        if [ "$worktree_path" = "$CURRENT_DIR" ]; then
            printf "➤ %-38s %-20s %-20s %-15s\n" "$(basename "$worktree_path")" "$branch" "$status" "$sync"
        else
            printf "  %-38s %-20s %-20s %-15s\n" "$(basename "$worktree_path")" "$branch" "$status" "$sync"
        fi
        cd - > /dev/null
    fi
done <<< "$WORKTREES"

echo

# Detailed information
echo "📊 Detailed Information:"
echo "========================="
echo

echo "🌳 Full Worktree List:"
git worktree list

echo
echo "📈 Disk Usage:"
du -sh ../*"$REPO_NAME"* 2>/dev/null | sort -hr || echo "No additional worktrees found"

echo
echo "🌿 All Branches:"
git branch -a

echo
echo "📅 Recent Activity (last 10 commits across all branches):"
git log --oneline --graph --all --decorate -10

echo
echo "🔍 Stash Status:"
if git stash list | head -5; then
    echo "(Showing up to 5 most recent stashes)"
else
    echo "No stashes found"
fi

echo
echo "⚠️  Potential Issues:"
echo "====================="

# Check for orphaned worktree references
if git worktree list | grep -q "prunable"; then
    echo "🚨 Found orphaned worktree references - run 'git worktree prune'"
else
    echo "✅ No orphaned worktree references"
fi

# Check for very old worktrees (30+ days)
echo "📅 Worktrees older than 30 days:"
find .. -maxdepth 1 -name "*$REPO_NAME*" -type d -mtime +30 2>/dev/null | while read -r old_dir; do
    if [ "$old_dir" != "$(git rev-parse --show-toplevel)" ]; then
        echo "⏰ $(basename "$old_dir") (consider cleanup)"
    fi
done || echo "✅ No worktrees older than 30 days"

# Check for worktrees with many uncommitted changes
echo "🔍 Worktrees with uncommitted work:"
while IFS= read -r worktree_path; do
    if [ -n "$worktree_path" ] && [ -d "$worktree_path" ]; then
        cd "$worktree_path"
        changes=$(git status --porcelain | wc -l)
        if [ "$changes" -gt 0 ]; then
            echo "📝 $(basename "$worktree_path"): $changes uncommitted changes"
        fi
        cd - > /dev/null
    fi
done <<< "$WORKTREES"

echo
echo "💡 Quick Actions:"
echo "=================="
echo "🧹 Clean up orphaned references: git worktree prune"
echo "📋 List all worktrees: git worktree list"  
echo "🗑️  Remove worktree: git worktree remove <path>"
echo "➕ Add new worktree: git worktree add <path> <branch>"
echo "🔧 Run setup script: ./scripts/setup-worktrees.sh"
echo "🧹 Run cleanup script: ./scripts/cleanup-worktrees.sh"

echo
echo "✨ Status check complete! 📊"