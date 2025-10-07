# TaskMaster Pro - Sample Project

A simple task management application for practicing git worktrees workflows. This project intentionally contains bugs, incomplete features, and TODO items to provide realistic scenarios for worktree exercises.

## 🎯 Purpose

This sample project serves as a realistic codebase for practicing git worktree workflows:

- **Multiple Components**: Frontend, backend, and testing code
- **Intentional Issues**: Bugs and TODOs for hotfix practice
- **Feature Opportunities**: Incomplete features for parallel development
- **Real-World Structure**: Mirrors actual project organization

## 🏗️ Project Structure

```
sample-project/
├── src/
│   ├── frontend/         # React frontend components
│   ├── backend/          # Node.js/Express backend
│   └── shared/           # Shared utilities
├── tests/
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   └── e2e/              # End-to-end tests
├── docs/
│   ├── api.md            # API documentation
│   └── setup.md          # Setup instructions
├── config/
│   ├── database.js       # Database configuration
│   └── server.js         # Server configuration
└── package.json          # Project dependencies
```

## 🐛 Known Issues (For Hotfix Practice)

### 🚨 Critical Bugs

1. **Login Bug**: Users cannot log in due to incorrect password validation
2. **Data Loss**: Tasks disappear when marking as complete
3. **Security Issue**: API endpoints accessible without authentication

### ⚠️ Non-Critical Issues  

1. **UI Bug**: Task list doesn't refresh after adding new tasks
2. **Performance**: Slow loading with large task lists
3. **UX Issue**: No loading indicators during API calls

## 🚧 TODO Features (For Parallel Development)

### 📱 Frontend Features

- [ ] Dark mode theme toggle
- [ ] Task categories and tags
- [ ] Drag and drop task reordering
- [ ] Real-time notifications
- [ ] Mobile responsive design

### 🖥️ Backend Features

- [ ] User authentication system
- [ ] Task sharing between users
- [ ] File attachments for tasks
- [ ] Task search and filtering API
- [ ] Email notifications

### 🧪 Testing Features

- [ ] Comprehensive unit test coverage
- [ ] API integration tests
- [ ] E2E user workflow tests
- [ ] Performance testing
- [ ] Security testing

## 🎓 Exercise Scenarios

### Scenario 1: Emergency Bug Fix

While working on the dark mode feature, a critical login bug is reported that prevents all users from accessing the application.

**Worktree Solution**: Create a hotfix worktree to fix the login bug while preserving your dark mode work in progress.

### Scenario 2: Parallel Feature Development

Your team needs to deliver multiple features simultaneously:

- Developer A: User authentication system
- Developer B: Task categories and tags
- Developer C: Real-time notifications

**Worktree Solution**: Each developer uses their own worktree for independent feature development.

### Scenario 3: AI-Assisted Development

Use AI coding assistants to accelerate development:

- AI Agent 1: Generate frontend components
- AI Agent 2: Implement backend APIs
- AI Agent 3: Create comprehensive tests

**Worktree Solution**: Each AI agent works in its own worktree for parallel AI-assisted development.

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Git 2.5+

### Setup

```bash
cd sample-project
npm install
npm run setup-db
npm run start
```

### Available Scripts

```bash
npm start          # Start development server
npm test           # Run test suite
npm run build      # Build for production
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

## 🎯 Practice Workflows

### Basic Worktree Practice

1. Create worktree for bug fixes: `git worktree add ../taskmaster-hotfix main`
2. Create worktree for features: `git worktree add ../taskmaster-feature-auth feature/auth`
3. Work in parallel without context switching

### Advanced Worktree Practice

1. Set up AI agent worktrees for parallel development
2. Coordinate multiple feature streams
3. Practice emergency hotfix workflows
4. Learn cleanup and maintenance strategies

## 📝 Contributing to the Sample

This sample project is designed for tutorial purposes. Feel free to:

- Add more realistic bugs for hotfix practice
- Create additional incomplete features
- Improve the project structure
- Add more comprehensive documentation

## 🔗 Integration with Tutorial

This sample project integrates with the tutorial exercises:

- **Exercise 1**: Basic operations on this codebase
- **Exercise 2**: Parallel feature development scenarios  
- **Exercise 3**: Emergency hotfix using the critical bugs
- **Exercise 4**: AI agent coordination on different components
- **Exercise 5**: Cleanup after completing features

## 📊 Project Status

- ✅ Basic project structure
- ✅ Sample frontend components
- ✅ Basic backend API
- ✅ Intentional bugs for practice
- 🚧 Comprehensive test suite (in progress)
- 🚧 Complete documentation (in progress)

---

**Ready to practice? Start with [Exercise 1](../exercises/01-basic-worktree/) using this sample project!**
