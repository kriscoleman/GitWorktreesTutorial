# Exercise 1: Basic Worktree Operations

Welcome to your first git worktree exercise! In this exercise, you'll learn the fundamental commands for creating, listing, and managing worktrees.

## 🎯 Learning Objectives

By the end of this exercise, you'll be able to:

- Create new worktrees
- List existing worktrees
- Navigate between worktrees
- Remove worktrees safely
- Understand worktree directory structure

## 📚 Background

Git worktrees allow you to have multiple working directories for the same repository. Each worktree can check out a different branch, allowing you to work on multiple features simultaneously without the overhead of stashing changes or switching contexts.

## 🛠️ Prerequisites

Make sure you're in the root directory of this tutorial repository:

```bash
cd /path/to/GitWorktreesTutorial
pwd  # Should show the tutorial repository path
```

## 📝 Exercise Steps

### Step 1: Check Current Worktree Status

First, let's see the current state of worktrees in this repository:

```bash
git worktree list
```

You should see output similar to:

```
/path/to/GitWorktreesTutorial  9dd2408 [main]
```

This shows you have one worktree (the main repository directory) with the main branch checked out.

### Step 2: Create Your First Worktree

Let's create a new worktree with a new branch:

```bash
# Create a new worktree with a new branch
git worktree add ../tut-feat-a
```

This command:

- Creates a new directory `../tut-feat-a`
- Creates a new branch called `tut-feat-a` (same as the directory name)
- Checks out `tut-feat-a` in the new worktree

### Step 3: Explore the New Worktree

Navigate to your new worktree:

```bash
cd ../tut-feat-a
pwd  # Confirm you're in the new directory
git branch  # Should show you're on tut-feat-a branch
ls -la  # See the same files as the original directory
```

### Step 4: Make Changes in the New Worktree

Create a new file to demonstrate independence:

```bash
echo "# Feature A Development" > feat-a-notes.md
git add feat-a-notes.md
git commit -m "Add initial notes for feature A"
```

### Step 5: Check Worktree List Again

```bash
git worktree list
```

You should now see two worktrees:

```
/path/to/GitWorktreesTutorial         63c4f0e [main]
/path/to/tut-feat-a                   63c4f0e [tut-feat-a]
```

### Step 6: Navigate Back to Original Directory

```bash
cd ../GitWorktreesTutorial
ls -la  # Notice feat-a-notes.md is NOT here
git branch -a  # You can see the tut-feat-a branch exists
```

### Step 7: Create Another Worktree from Existing Branch

Create a worktree with a new branch based on main for code review:

```bash
git worktree add ../tut-review -b review-branch main
```

### Step 8: View All Worktrees with Details

```bash
git worktree list --porcelain
```

This shows detailed information about each worktree.

### Step 9: Remove a Worktree

First, navigate back to the main directory (you can't remove a worktree you're currently in):

```bash
cd ../GitWorktreesTutorial
git worktree remove ../tut-review
```

### Step 10: Verify Removal

```bash
git worktree list
ls -la ../  # Confirm the directory was removed
```

## ✅ Validation

Run this command to check your work:

```bash
# From the main repository directory
../../scripts/validate-exercise.sh 01
```

Expected state after completing this exercise:

- You should have 2 worktrees: main directory and tut-feat-a directory
- The tut-feat-a worktree should have a `feat-a-notes.md` file
- The tut-review worktree should be removed

## 🎓 Key Takeaways

1. **Worktree Independence**: Each worktree is completely independent with its own working directory and checked-out branch
2. **Shared Repository**: All worktrees share the same `.git` directory and repository history
3. **Branch Restrictions**: You cannot have the same branch checked out in multiple worktrees simultaneously
4. **Directory Management**: Worktree directories are typically created as siblings to your main repository

## 🔄 Common Commands Reference

```bash
# Create worktree with new branch (auto-named from path)
git worktree add <path>

# Create worktree with specific new branch name
git worktree add <path> -b <new-branch>

# Create worktree from existing branch as new branch
git worktree add <path> -b <new-branch> <existing-branch>

# List all worktrees
git worktree list

# Remove a worktree
git worktree remove <path>

# Prune (clean up) worktree references
git worktree prune
```

## 🚀 Next Steps

Great job! You've mastered the basics of git worktrees.

In [Exercise 2](../02-parallel-features/), you'll learn how to use multiple worktrees to develop features in parallel without context switching.

## 🐛 Troubleshooting

**Issue**: `fatal: '<path>' already exists`
**Solution**: Choose a different path or remove the existing directory

**Issue**: `fatal: '<branch>' is already checked out`
**Solution**: You cannot check out the same branch in multiple worktrees. Use a different branch or create a new one.

**Issue**: Worktree removed but `git worktree list` still shows it
**Solution**: Run `git worktree prune` to clean up stale references
