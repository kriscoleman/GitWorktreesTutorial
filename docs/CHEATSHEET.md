# Git Worktrees Command Cheatsheet

Quick reference for all git worktree commands and common workflows.

## 📋 Basic Commands

### List Worktrees
```bash
git worktree list                    # Show all worktrees
git worktree list --porcelain        # Machine-readable format
```

### Add Worktrees
```bash
# Create worktree with new branch
git worktree add <path> <new-branch>

# Create worktree from existing branch  
git worktree add <path> <existing-branch>

# Create worktree from specific commit
git worktree add <path> <commit-hash>

# Create worktree with branch tracking remote
git worktree add <path> -b <branch> origin/<remote-branch>
```

### Remove Worktrees
```bash
git worktree remove <path>           # Remove worktree
git worktree remove --force <path>   # Force remove (with uncommitted changes)
```

### Maintenance
```bash
git worktree prune                   # Clean up stale worktree references
git worktree prune --dry-run         # Show what would be pruned
```

## 🎯 Common Workflows

### Emergency Hotfix
```bash
# Current: working on feature branch with uncommitted changes
git worktree add ../project-hotfix main
cd ../project-hotfix
git checkout -b hotfix/critical-bug
# Fix bug, commit, merge to main
cd ../project  # Return to feature work
```

### Parallel Feature Development
```bash
# Set up multiple feature streams
git worktree add ../project-auth feature/authentication
git worktree add ../project-ui feature/dashboard  
git worktree add ../project-api feature/backend-api

# Work in parallel without context switching
cd ../project-auth     # Work on auth
cd ../project-ui       # Work on UI
cd ../project-api      # Work on API
```

### Code Review Setup
```bash
# Dedicated review environment
git worktree add ../project-review main
cd ../project-review
# Always clean main branch for reviewing PRs
```

### AI Agent Coordination
```bash
# Multiple AI agents working simultaneously
git worktree add ../project-ai-frontend feature/ui-components
git worktree add ../project-ai-backend feature/api-backend
git worktree add ../project-ai-testing feature/test-suite

# Each AI agent works in isolation
```

## ⚙️ Advanced Usage

### Working with Remote Branches
```bash
# Track remote branch in new worktree
git worktree add ../project-remote -b local-branch origin/remote-branch

# Push from worktree
cd ../project-feature
git push -u origin feature/new-feature
```

### Temporary Worktrees
```bash
# Quick experiment
git worktree add /tmp/experiment HEAD
cd /tmp/experiment
# Try something risky
cd -
git worktree remove /tmp/experiment
```

### Branch Management
```bash
# Create and switch in one command
git worktree add ../project-feature -b feature/new-feature

# Move worktree to different branch
cd ../project-feature
git checkout different-branch
```

## 🛠️ Directory Organization Patterns

### Project-Based Structure
```
~/workspace/
├── myproject/              # Main worktree (main branch)  
├── myproject-auth/         # Authentication feature
├── myproject-dashboard/    # Dashboard feature
├── myproject-hotfix/       # Emergency fixes
└── myproject-review/       # Code review
```

### Feature-Based Structure
```
~/workspace/myproject/
├── main/                   # Main branch
├── features/
│   ├── authentication/    # Auth feature
│   ├── dashboard/         # Dashboard feature  
│   └── payment/           # Payment feature
├── hotfixes/
│   └── critical-bug/      # Hotfix
└── review/                # Review branch
```

### AI-Agent Structure
```
~/workspace/myproject/
├── main/                   # Human coordination
├── agents/
│   ├── frontend-ai/       # Frontend AI agent
│   ├── backend-ai/        # Backend AI agent
│   ├── testing-ai/        # Testing AI agent
│   └── docs-ai/           # Documentation AI agent
└── integration/           # Integration branch
```

## 🚀 Git Aliases

Add these to your `~/.gitconfig`:

```ini
[alias]
    # Worktree shortcuts
    wt = worktree
    wtls = worktree list
    wtadd = worktree add
    wtrm = worktree remove
    wtprune = worktree prune
    
    # Common workflows
    hotfix = "!f() { git worktree add ../$(basename $(pwd))-hotfix main && cd ../$(basename $(pwd))-hotfix && git checkout -b hotfix/$1; }; f"
    feature = "!f() { git worktree add ../$(basename $(pwd))-$1 -b feature/$1; }; f"
    review = "!git worktree add ../$(basename $(pwd))-review main"
    
    # Cleanup
    wtclean = "!git worktree prune && echo 'Worktree references cleaned'"
```

Usage:
```bash
git hotfix login-bug        # Creates hotfix worktree and branch
git feature dashboard       # Creates feature worktree and branch  
git review                  # Creates review worktree
git wtclean                 # Cleans up references
```

## 🔧 Shell Functions

Add to your `~/.bashrc` or `~/.zshrc`:

```bash
# Quick worktree navigation
wtcd() {
    local worktree=$(git worktree list | fzf | awk '{print $1}')
    if [ -n "$worktree" ]; then
        cd "$worktree"
    fi
}

# Worktree status overview
wtstatus() {
    echo "🌳 Worktree Status Overview"
    echo "=========================="
    echo
    git worktree list
    echo
    echo "💾 Disk Usage:"
    du -sh ../*$(basename $(pwd))* 2>/dev/null | sort -hr
}

# Quick worktree creation
wtquick() {
    local name=$1
    local branch=${2:-feature/$name}
    git worktree add "../$(basename $(pwd))-$name" -b "$branch"
    cd "../$(basename $(pwd))-$name"
}
```

## ⚠️ Important Limitations

### Cannot Check Out Same Branch Twice
```bash
# ❌ This will fail
git worktree add ../project-feature feature/auth
git worktree add ../project-feature2 feature/auth  # Error!

# ✅ Use different branches
git worktree add ../project-feature feature/auth
git worktree add ../project-feature2 feature/auth-v2
```

### Git LFS Not Supported
```bash
# ❌ Worktrees don't support Git LFS files
# If your repo uses LFS, files may not be available in worktrees
```

### Relative Paths in Hooks
```bash
# ⚠️ Git hooks with relative paths may not work correctly
# Use absolute paths in hooks when using worktrees
```

## 🧹 Cleanup Best Practices

### Daily Cleanup
```bash
# Remove merged feature worktrees
for worktree in ../project-*; do
    if [ -d "$worktree" ]; then
        cd "$worktree"
        branch=$(git branch --show-current)
        if git merge-base --is-ancestor HEAD main; then
            echo "Removing merged worktree: $worktree"
            cd ..
            git worktree remove "$worktree"
        fi
        cd - > /dev/null
    fi
done
```

### Weekly Maintenance
```bash
# Prune orphaned references
git worktree prune

# List old worktrees
find .. -maxdepth 1 -name "*$(basename $(pwd))*" -type d -mtime +7
```

## 🐛 Troubleshooting

### Worktree Directory Deleted Manually
```bash
# If you deleted the directory but worktree still listed
git worktree prune  # Clean up the reference
```

### Cannot Remove Worktree
```bash
# If worktree has uncommitted changes
git worktree remove --force <path>

# Or commit/stash changes first
cd <worktree-path>
git add . && git commit -m "Save work"
cd -
git worktree remove <path>
```

### Worktree on Wrong Branch
```bash
cd <worktree-path>
git checkout <correct-branch>
# or
git checkout -b <new-branch>
```

### Permission Issues
```bash
# On some systems, check permissions
chmod -R u+w <worktree-path>
git worktree remove <path>
```

## 💡 Pro Tips

1. **Consistent Naming**: Use prefixes like `project-feature-name`
2. **Regular Cleanup**: Don't let worktrees accumulate
3. **Backup Important Work**: Before removing worktrees with unique changes
4. **Use Absolute Paths**: Avoid issues with relative paths
5. **Team Communication**: Notify team when removing shared worktrees

## 📚 See Also

- [Git Worktree Documentation](https://git-scm.com/docs/git-worktree)
- [Best Practices Guide](BEST_PRACTICES.md)
- [AI Development Guide](AI_DEVELOPMENT.md)
- [Tutorial Exercises](../exercises/)

---

**Keep this cheatsheet handy for quick reference during your worktree workflows!** 🚀