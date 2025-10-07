# Git Worktrees Tutorial 🌳

A comprehensive, hands-on tutorial for mastering Git worktrees to supercharge your development workflow, especially in the era of AI-assisted coding.

## 🎯 What You'll Learn

Git worktrees allow you to check out multiple branches simultaneously into separate directories. This is incredibly powerful for:

- **Context Switching**: Work on urgent bug fixes without stashing your feature work
- **Parallel Development**: Develop multiple features concurrently
- **AI-Assisted Development**: Run multiple AI coding agents on different tasks simultaneously
- **Code Review**: Keep a clean main branch for reviewing while working on features
- **Experimentation**: Try different approaches without affecting your main work

## 🚀 Quick Start

This repository is a GitHub template designed to teach you git worktrees through hands-on exercises.

### Prerequisites

- Git 2.5+ (worktrees were introduced in Git 2.5)
- Basic familiarity with Git branches
- Terminal/command line access

### Getting Started

1. **Use this template** to create your own repository
2. Clone your new repository locally
3. Follow the exercises in order (see [Exercises](#exercises) below)
4. Use the provided scripts to practice and validate your learning

## 📚 Core Concepts

### What is a Git Worktree?

A worktree is a separate working directory linked to your repository. Each worktree can have:

- Its own checked-out branch
- Independent file changes
- Separate index/staging area

### Key Benefits

**Traditional Workflow Problems:**

```bash
# Working on feature-a
git add .
git stash
git checkout main
git pull
git checkout -b hotfix-urgent
# Fix bug, commit, merge
git checkout feature-a
git stash pop
# Lost context, mental overhead
```

**Worktree Solution:**

```bash
# Working on feature-a in main directory
git worktree add ../myproject-hotfix hotfix-urgent
cd ../myproject-hotfix
# Fix bug in separate directory, no stashing needed
```

## 🎓 Exercises

Work through these exercises in order to master git worktrees:

### [Exercise 1: Basic Worktree Operations](exercises/01-basic-worktree/)

Learn to create, list, and remove worktrees

### [Exercise 2: Parallel Feature Development](exercises/02-parallel-features/)

Work on multiple features simultaneously without context switching

### [Exercise 3: Hotfix Workflow](exercises/03-hotfix-workflow/)

Handle urgent bug fixes while preserving feature work

### [Exercise 4: AI Agent Workflows](exercises/04-ai-agents/)

Use worktrees with AI coding assistants for parallel development

### [Exercise 5: Cleanup and Maintenance](exercises/05-cleanup/)

Properly manage and clean up worktrees

## 🛠️ Helper Scripts

This repository includes several scripts to help you practice:

- `scripts/setup-worktrees.sh` - Initialize practice environment
- `scripts/cleanup-worktrees.sh` - Clean up all practice worktrees
- `scripts/worktree-status.sh` - Show status of all worktrees
- `scripts/validate-exercise.sh` - Check your exercise solutions

## 📖 Documentation

- [Command Cheatsheet](docs/CHEATSHEET.md) - Quick reference for all git worktree commands
- [Best Practices](docs/BEST_PRACTICES.md) - Advanced workflows and tips
- [AI Development Guide](docs/AI_DEVELOPMENT.md) - Using worktrees with AI coding tools

## 🏗️ Sample Project

The `sample-project/` directory contains a simple web application with intentional bugs and TODO items for practicing worktree workflows in realistic scenarios.

## 💡 Real-World Scenarios

### Scenario 1: The Urgent Bug Fix

You're implementing a complex feature when a critical production bug is reported. With worktrees:

1. Keep your feature work untouched in the main directory
2. Create a hotfix worktree: `git worktree add ../project-hotfix main`
3. Fix the bug in the hotfix directory
4. Deploy the fix
5. Return to your feature work without any context loss

### Scenario 2: AI-Assisted Parallel Development

Run multiple AI coding agents simultaneously:

1. Main worktree: Claude Code working on authentication refactor
2. Feature worktree: Another AI agent building a new dashboard
3. Review worktree: Clean main branch for code review
4. Each agent works independently without conflicts

### Scenario 3: Code Review Without Interruption

Keep a dedicated worktree for code reviews:

```bash
git worktree add ../project-review main
# Always have a clean main branch for reviewing PRs
# Continue feature work in your main directory
```

## 🔧 Advanced Tips

### Directory Organization

```
~/workspace/
├── myproject/           # Main worktree (usually main branch)
├── myproject-feature-a/ # Feature branch worktree
├── myproject-hotfix/    # Hotfix worktree
└── myproject-review/    # Code review worktree
```

### Useful Git Aliases

Add these to your `.gitconfig`:

```ini
[alias]
    wt = worktree
    wtlist = worktree list
    wtadd = worktree add
    wtremove = worktree remove
    wtprune = worktree prune
```

### VSCode Integration

Each worktree appears as a separate folder in VSCode, allowing you to:

- Open multiple instances of your project
- Work on different features in separate windows
- Use different extensions/settings per worktree

## 🤝 Contributing

Found an issue or want to improve the tutorial? Please:

1. Create an issue describing the problem or improvement
2. Use the provided issue templates
3. Submit a pull request with your changes

## 📜 License

This tutorial is open source and available under the MIT License.

## 🙋‍♂️ Support

Having trouble with the exercises? Check out:

- [GitHub Issues](../../issues) for common problems
- [Discussions](../../discussions) for questions and tips
- The `docs/` directory for additional resources

---

**Ready to supercharge your development workflow? Start with [Exercise 1](exercises/01-basic-worktree/)!**
