---
theme: default
background: https://source.unsplash.com/1920x1080/?git,code
class: text-center
highlighter: shiki
lineNumbers: false
info: |
  ## Git Worktrees Tutorial Presentation
  
  A comprehensive presentation showcasing the Git Worktrees Tutorial
  
  Learn more at [GitHub Repository](https://github.com/kriscoleman/GitWorktreesTutorial)
drawings:
  persist: false
transition: slide-left
title: Git Worktrees Tutorial
mdc: true
---

# Git Worktrees Tutorial 🌳

Supercharge your development workflow with parallel Git branches

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Press Space for next page <kbd>space</kbd>
  </span>
</div>

<div class="abs-br m-6 flex gap-2">
  <button @click="$slidev.nav.openInEditor()" title="Open in Editor" class="text-xl slidev-icon-btn opacity-50 !border-none !hover:text-white">
    <carbon:edit />
  </button>
  <a href="https://github.com/kriscoleman/GitWorktreesTutorial" target="_blank" alt="GitHub"
    class="text-xl slidev-icon-btn opacity-50 !border-none !hover:text-white">
    <carbon-logo-github />
  </a>
</div>

---
transition: fade-out
---

# The Problem 🤔

## Traditional Git Workflow Pain Points

<v-clicks>

- **Context Switching Overhead**: Constantly stashing and switching branches
- **Lost Mental Context**: What were you working on before the urgent bug fix?
- **Merge Conflicts**: Stashing complex changes can cause issues
- **Development Interruption**: Can't work on multiple features simultaneously
- **AI Development Bottleneck**: Single branch limits parallel AI agent workflows

</v-clicks>

<br>

```bash {all|2-3|4-5|6-7|8-9|all}
# The typical painful workflow
git add .                    # Working on feature-a
git stash                    # Urgent bug reported!
git checkout main            # Switch context
git pull                     # Update main
git checkout -b hotfix-123   # Create hotfix branch
# Fix bug, commit, merge...
git checkout feature-a       # Back to feature work
git stash pop               # What was I working on again? 🤯
```

---
layout: default
---

# The Solution: Git Worktrees 🌟

## Multiple Working Directories, One Repository

<div grid="~ cols-2 gap-12">
<div>

### What are Git Worktrees?
- **Separate directories** for each branch
- **Shared repository** history and configuration  
- **Independent working states** per directory
- **No context switching** required

### Key Benefits
- 🚀 **Parallel Development**: Multiple features at once
- 🔥 **Instant Hotfixes**: No stashing or switching
- 🤖 **AI Agent Workflows**: Multiple AI assistants working simultaneously
- 👀 **Clean Code Reviews**: Dedicated review environment
- 🧪 **Safe Experimentation**: Try approaches without risk

</div>
<div>

```bash
# Git Worktree Workflow
cd ~/myproject              # Main directory: feature-a
git worktree add ../myproject-hotfix main
cd ../myproject-hotfix      # New directory: hotfix
# Fix bug here while feature-a stays intact!

# Directory structure:
~/workspace/
├── myproject/           # feature-a branch
├── myproject-hotfix/    # hotfix branch  
├── myproject-review/    # main branch (clean)
└── myproject-exp/       # experimental branch
```

<div class="mt-8 p-4 bg-green-100 dark:bg-green-900 rounded">
<strong>🎯 Result:</strong> Work on urgent fixes without losing your feature work context!
</div>

</div>
</div>

---
transition: slide-up
level: 2
---

# Real-World Scenarios 🎭

<div grid="~ cols-2 gap-8">

<div>

## Scenario 1: The Urgent Bug Fix 🚨
<v-clicks>

- You're deep in a complex feature implementation
- **Critical production bug** is reported
- With worktrees: Keep feature work untouched
- Create hotfix in separate directory
- Deploy fix without context loss

</v-clicks>

<br>

<v-click>

```bash
# No interruption to your feature work!
git worktree add ../myproject-hotfix main
cd ../myproject-hotfix
# Fix bug, test, deploy
cd ../myproject  # Back to feature work
```

</v-click>

</div>

<div>

## Scenario 2: AI-Assisted Parallel Development 🤖
<v-clicks>

- Multiple AI agents working simultaneously
- Each agent gets its own worktree
- **No conflicts** between AI workflows
- **Parallel progress** on different features

</v-clicks>

<br>

<v-click>

```bash
# Main: Claude Code on auth refactor
# Worktree 1: GPT-4 building dashboard
git worktree add ../project-dashboard feature-dash

# Worktree 2: Cursor on API optimization  
git worktree add ../project-api feature-api

# Review: Clean main for code reviews
git worktree add ../project-review main
```

</v-click>

</div>

</div>

---
layout: image-right
image: https://source.unsplash.com/800x600/?tutorial,learning
---

# Tutorial Repository 📚

## Comprehensive Learning Experience

<v-clicks>

### 🎯 **5 Hands-on Exercises**
- Basic worktree operations
- Parallel feature development  
- Hotfix workflows
- AI agent coordination
- Cleanup and maintenance

### 📖 **Rich Documentation** 
- Command cheatsheet
- Best practices guide
- AI development workflows

### 🛠️ **Helper Scripts**
- Setup and cleanup automation
- Status monitoring
- Exercise validation

### 🌐 **Sample Project**
- Real web application with bugs
- Practice scenarios
- Realistic workflow examples

</v-clicks>

---
transition: slide-left
---

# Exercise 1: Basic Operations 🚀

## Master the Fundamentals

<div grid="~ cols-2 gap-8">

<div>

### Learning Objectives
<v-clicks>

- Create and list worktrees
- Navigate between directories  
- Remove worktrees safely
- Understand directory structure

</v-clicks>

<br>

### Key Commands
<v-clicks>

```bash
# Create new worktree
git worktree add <path>

# Create with specific branch
git worktree add <path> -b <branch>

# List all worktrees  
git worktree list

# Remove a worktree
git worktree remove <path>
```

</v-clicks>

</div>

<div>

### Hands-on Practice

<v-click>

```bash
# Step 1: Check current state
git worktree list

# Step 2: Create first worktree
git worktree add ../tut-feat-a

# Step 3: Explore the new environment
cd ../tut-feat-a
git branch  # You're on tut-feat-a
ls -la      # Same files, different branch

# Step 4: Make independent changes
echo "# Feature A Notes" > feat-a-notes.md
git add feat-a-notes.md
git commit -m "Add feature A notes"

# Step 5: Verify independence
cd ../GitWorktreesTutorial
ls -la  # No feat-a-notes.md here!
```

</v-click>

<div class="mt-4 p-3 bg-blue-100 dark:bg-blue-900 rounded text-sm">
<strong>💡 Key Insight:</strong> Each worktree is completely independent but shares the same repository history!
</div>

</div>

</div>

---
layout: default  
---

# Exercise 4: AI Agent Workflows 🤖

## Parallel AI Development Made Easy

<div grid="~ cols-2 gap-12">

<div>

### The Challenge
<v-clicks>

- Multiple AI coding assistants
- Different tasks requiring isolation
- Avoiding merge conflicts  
- Coordinated development workflow

</v-clicks>

<br>

### The Worktree Solution
<v-clicks>

- **Claude Code**: Authentication refactor (main directory)
- **GPT-4**: New dashboard (worktree 1)  
- **Cursor**: API optimization (worktree 2)
- **Review Environment**: Clean main branch (worktree 3)

</v-clicks>

</div>

<div>

### Implementation

```bash {all|1-3|5-7|9-11|13-15}
# Main directory: Claude Code working
# on authentication refactor
git checkout -b auth-refactor

# Worktree 1: GPT-4 building dashboard
git worktree add ../project-dashboard -b feature-dashboard

# Worktree 2: Cursor optimizing API
git worktree add ../project-api -b optimize-api  

# Worktree 3: Clean environment for reviews
git worktree add ../project-review main

# Each AI agent works independently!
# No conflicts, no context switching
```

<div class="mt-4 p-3 bg-purple-100 dark:bg-purple-900 rounded text-sm">
<strong>🚀 Pro Tip:</strong> Use different terminals/IDEs for each worktree to maximize AI agent efficiency!
</div>

</div>

</div>

---
layout: center
---

# Best Practices & Tips 💡

<div grid="~ cols-3 gap-8">

<div>

## 📁 Directory Organization

```bash
~/workspace/
├── myproject/           # main
├── myproject-feat-auth/ # features
├── myproject-feat-dash/ # features  
├── myproject-hotfix/    # hotfixes
└── myproject-review/    # reviews
```

<div class="mt-4 text-sm text-gray-600 dark:text-gray-400">
Consistent naming helps identify purpose
</div>

</div>

<div>

## ⚡ Git Aliases

```bash
# Add to ~/.gitconfig
[alias]
    wt = worktree
    wtlist = worktree list
    wtadd = worktree add  
    wtremove = worktree remove
    wtprune = worktree prune
```

<div class="mt-4 text-sm text-gray-600 dark:text-gray-400">
Speed up your worktree commands
</div>

</div>

<div>

## 🔧 VSCode Integration

- Each worktree = separate folder
- Multiple VS Code windows
- Independent extensions/settings  
- Parallel development environments

<div class="mt-4 text-sm text-gray-600 dark:text-gray-400">
Perfect for multi-tasking developers
</div>

</div>

</div>

---
layout: default
---

# Sample Project: Real-World Practice 🌐

## Web Application with Intentional Learning Opportunities

<div grid="~ cols-2 gap-8">

<div>

### Project Structure
```bash
sample-project/
├── src/
│   ├── frontend/     # React app
│   │   ├── App.js
│   │   └── App.css
│   └── backend/      # Node.js server  
│       └── server.js
├── tests/
│   ├── unit/         # Unit tests
│   └── integration/  # Integration tests
├── config/           # Configuration
├── docs/            # Documentation
└── package.json
```

</div>

<div>

### Practice Scenarios  
<v-clicks>

- **🐛 Bug Fixes**: Critical issues to resolve
- **✨ New Features**: Authentication, dashboard
- **🔧 Refactoring**: Code improvements
- **📊 Performance**: Optimization tasks
- **🧪 Testing**: Add test coverage

</v-clicks>

<br>

### Learning Outcomes
<v-clicks>

- Practice worktree workflows on real code
- Experience parallel development benefits
- Handle realistic merge scenarios  
- Build confidence with complex projects

</v-clicks>

</div>

</div>

<div class="mt-8 p-4 bg-yellow-100 dark:bg-yellow-900 rounded">
<strong>🎯 Goal:</strong> Apply worktree concepts to realistic development scenarios and build practical skills
</div>

---
transition: slide-up
---

# Advanced Workflows 🔥

<div grid="~ cols-2 gap-12">

<div>

## Code Review Workflow

<v-clicks>

### The Setup
```bash
# Dedicated review environment
git worktree add ../project-review main
cd ../project-review

# Always clean main branch for reviews
# Continue feature work in main directory
```

### Benefits
- 🎯 **Clean Environment**: No work-in-progress files
- 🔍 **Focus**: Dedicated space for reviews
- ⚡ **Fast Switching**: No stashing required
- 📊 **Context**: Keep feature work visible

</v-clicks>

</div>

<div>

## Experimentation Workflow  

<v-clicks>

### The Setup
```bash
# Try risky experiments safely
git worktree add ../project-experiment -b experiment-new-arch

# Compare approaches
git worktree add ../project-comparison -b comparison-approach-2
```

### Benefits  
- 🧪 **Safe Testing**: Original work protected
- 📈 **A/B Comparison**: Side-by-side evaluation
- 🔄 **Easy Rollback**: Just remove the worktree
- 💡 **Innovation**: Try bold ideas without fear

</v-clicks>

</div>

</div>

<br>

<div class="text-center p-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded">
<strong>🚀 Pro Tip:</strong> Use worktrees for any workflow that benefits from isolation and parallel development!
</div>

---
layout: center
class: text-center
---

# Ready to Transform Your Workflow? 🚀

## Get Started with the Git Worktrees Tutorial

<div class="mt-8 mb-8">

### 📚 **GitHub Repository**
[github.com/kriscoleman/GitWorktreesTutorial](https://github.com/kriscoleman/GitWorktreesTutorial)

</div>

<div grid="~ cols-3 gap-8 mt-12">

<div>
<div class="text-4xl mb-4">🎯</div>
<h3>5 Hands-on Exercises</h3>
<p class="text-sm text-gray-600 dark:text-gray-400">From basics to advanced workflows</p>
</div>

<div>
<div class="text-4xl mb-4">🤖</div>  
<h3>AI Development Ready</h3>
<p class="text-sm text-gray-600 dark:text-gray-400">Perfect for modern AI-assisted coding</p>
</div>

<div>
<div class="text-4xl mb-4">🛠️</div>
<h3>Production Ready</h3>
<p class="text-sm text-gray-600 dark:text-gray-400">Real-world scenarios and best practices</p>
</div>

</div>

<div class="mt-12">
<div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
Start with Exercise 1: Basic Worktree Operations
</div>
<div class="text-lg mt-2 text-gray-600 dark:text-gray-400">
Master the fundamentals in 15 minutes
</div>
</div>

---
layout: end
class: text-center
---

# Thank You! 🙏

## Questions & Discussion

<div class="mt-12">

### Resources
- 📖 **Tutorial**: [GitHub Repository](https://github.com/kriscoleman/GitWorktreesTutorial)
- 📑 **Documentation**: Command cheatsheet, best practices, AI workflows  
- 🛠️ **Scripts**: Setup, cleanup, and validation helpers
- 💬 **Support**: GitHub Issues and Discussions

</div>

<div class="mt-8 text-lg">
<strong>Ready to supercharge your development workflow with Git worktrees?</strong>
</div>

<div class="abs-br m-6 flex gap-2">
  <a href="https://github.com/kriscoleman/GitWorktreesTutorial" target="_blank" alt="GitHub"
    class="text-xl slidev-icon-btn opacity-50 !border-none !hover:text-white">
    <carbon-logo-github />
  </a>
</div>