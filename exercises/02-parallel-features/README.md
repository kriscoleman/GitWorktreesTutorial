# Exercise 2: Parallel Feature Development

Now that you understand the basics, let's explore one of the most powerful use cases for git worktrees: developing multiple features simultaneously without context switching.

## 🎯 Learning Objectives

By the end of this exercise, you'll be able to:

- Set up multiple worktrees for parallel development
- Work on different features simultaneously
- Understand branch isolation between worktrees
- Merge features without conflicts
- Organize your workspace efficiently

## 📚 Scenario

You're working on a web application and need to implement three features simultaneously:

1. **User Authentication** - Login/logout functionality
2. **Dashboard Widgets** - New dashboard components  
3. **API Rate Limiting** - Backend rate limiting system

Traditionally, you'd work on one feature at a time, constantly switching contexts. With worktrees, you can work on all three simultaneously!

## 🛠️ Setup

Start from the main repository directory:

```bash
cd /path/to/GitWorktreesTutorial
git worktree list  # Should show your main worktree
```

## 📝 Exercise Steps

### Step 1: Create Feature Worktrees

Create three worktrees for your parallel features:

```bash
# Authentication feature
git worktree add ../tut-auth

# Dashboard feature  
git worktree add ../tut-dashboard

# Rate limiting feature
git worktree add ../tut-ratelimit
```

### Step 2: Verify Your Workspace

```bash
git worktree list
ls -la ../
```

You should see four directories:

- `GitWorktreesTutorial` (main)
- `tut-auth`
- `tut-dashboard`
- `tut-ratelimit`

### Step 3: Simulate Parallel Development

Let's simulate working on all three features simultaneously.

#### Work on Authentication (Terminal 1 or sequentially)

```bash
cd ../tut-auth
echo "# Authentication Module

## Features
- User login
- Password validation
- Session management

## Implementation Notes
- Using JWT tokens
- BCrypt for password hashing
" > auth.md

git add auth.md
git commit -m "feat: add authentication module design"
```

#### Work on Dashboard (Terminal 2 or sequentially)

```bash
cd ../tut-dashboard  
echo "# Dashboard Widgets

## New Widgets
- User stats widget
- Revenue chart
- Activity feed

## Technical Notes
- React components
- Chart.js for visualizations
" > dashboard.md

git add dashboard.md
git commit -m "feat: add dashboard widgets specification"
```

#### Work on Rate Limiting (Terminal 3 or sequentially)

```bash
cd ../tut-ratelimit
echo "# API Rate Limiting

## Requirements
- 100 requests per minute per user
- Redis for tracking
- Graceful degradation

## Implementation
- Express middleware
- Redis counters with TTL
" > rate-limiting.md

git add rate-limiting.md
git commit -m "feat: add rate limiting design"
```

### Step 4: Check Progress Across All Features

From any worktree, check the branches:

```bash
git branch -a
git log --oneline --graph --all
```

You'll see all three feature branches with their commits!

### Step 5: Simulate Context Switching

The beauty of worktrees is you can switch between features instantly:

```bash
# Work on auth
cd ../tut-auth
echo "- Token expiration: 24 hours" >> auth.md
git add auth.md
git commit -m "feat: add token expiration specification"

# Immediately switch to dashboard work
cd ../tut-dashboard
echo "- Real-time updates via WebSocket" >> dashboard.md
git add dashboard.md  
git commit -m "feat: add real-time updates requirement"

# No stashing, no context loss!
```

### Step 6: Review Changes in Main Worktree

Navigate to your main worktree to review the overall progress:

```bash
cd ../GitWorktreesTutorial
git branch -a
git log --oneline --graph --all --decorate
```

Notice how you can see all the work done across different worktrees without any of the individual feature files being present in the main directory.

### Step 7: Merge Features (Simulation)

Let's simulate merging one completed feature:

```bash
# From main directory
git checkout main
git merge feature/authentication
ls -la  # You should now see auth.md in main
```

### Step 8: Handle Merge Conflicts (Demo)

Create a potential conflict scenario:

```bash
# In main worktree, modify README.md
echo "
## Features in Development
- Authentication system
" >> README.md
git add README.md
git commit -m "docs: add features section to README"

# In auth worktree, modify the same file differently
cd ../GitWorktreesTutorial-auth
echo "
## Current Features  
- User authentication module
" >> README.md
git add README.md
git commit -m "docs: update README with auth info"

# Try to merge (this will create a conflict)
cd ../GitWorktreesTutorial
git merge feature/authentication
# Resolve the conflict in your editor, then:
# git add README.md
# git commit -m "docs: resolve merge conflict in README"
```

### Step 9: Clean Up Completed Features

Once a feature is merged and no longer needed:

```bash
git branch -d tut-auth
git worktree remove ../tut-auth
```

## ✅ Validation

Check your progress:

```bash
../../scripts/validate-exercise.sh 02
```

Expected state:

- Three feature worktrees created
- Commits made in each feature branch
- At least one feature merged to main
- Understanding of parallel development workflow

## 🎓 Key Takeaways

1. **No Context Switching**: Work on multiple features without losing focus
2. **Complete Isolation**: Each feature develops independently
3. **Instant Access**: Switch between features immediately
4. **Clean Merging**: Merge features when ready without affecting ongoing work
5. **Efficient Workspace**: Organize multiple development streams clearly

## 💡 Real-World Tips

### Workspace Organization

```bash
~/projects/
├── myapp/                    # Main worktree (main branch)
├── myapp-feature-auth/       # Authentication feature
├── myapp-feature-api/        # API improvements
├── myapp-hotfix/            # Emergency fixes
└── myapp-review/            # Code review branch
```

### Naming Conventions

- Use consistent prefixes: `projectname-purpose`
- Include branch type: `projectname-feature-name` or `projectname-hotfix-issue`
- Keep names short but descriptive

### Best Practices

1. **One Feature Per Worktree**: Don't mix multiple features in one worktree
2. **Regular Commits**: Commit frequently in each worktree
3. **Sync with Main**: Regularly rebase or merge from main to avoid conflicts
4. **Clean Up**: Remove worktrees for completed/abandoned features

## 🚀 Next Steps

Excellent! You now understand how to develop multiple features in parallel.

In [Exercise 3](../03-hotfix-workflow/), you'll learn how to handle urgent bug fixes without disrupting your feature work - a critical skill for production environments.

## 🔧 Advanced Scenarios

### Working with Remote Branches

```bash
# Create worktree from remote branch
git worktree add ../myapp-remote-feature origin/feature/remote-work

# Push from specific worktree
cd ../myapp-feature-new
git push -u origin feature/new-feature
```

### Multiple People, Multiple Features

- Person A: Works on authentication in their auth worktree
- Person B: Works on dashboard in their dashboard worktree  
- Person C: Fixes bugs in a hotfix worktree
- All can merge to main independently when ready
