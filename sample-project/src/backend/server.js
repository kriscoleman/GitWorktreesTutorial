// TaskMaster Pro - Backend Server
// INTENTIONAL BUGS INCLUDED FOR TUTORIAL PURPOSES

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Mock database (in-memory for tutorial purposes)
let tasks = [
  { id: 1, title: 'Learn Git Worktrees', completed: false, userId: 1 },
  { id: 2, title: 'Build Sample App', completed: true, userId: 1 },
  { id: 3, title: 'Practice Hotfix Workflow', completed: false, userId: 1 }
];

let users = [
  { id: 1, username: 'demo', password: 'password123' }, // SECURITY BUG: Plain text password!
  { id: 2, username: 'admin', password: 'admin' }       // SECURITY BUG: Weak password!
];

let nextTaskId = 4;
let nextUserId = 3;

// Authentication middleware (BUGGY - for hotfix practice)
const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // BUG: Always returns true - no real authentication!
  // This is intentional for hotfix exercise practice
  req.userId = 1; // Always use user 1
  next();
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  
  // CRITICAL BUG: Password validation is broken!
  // This always fails - perfect for hotfix exercise
  const user = users.find(u => u.username === username && u.password === 'wrong_password');
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Mock JWT token (not real for tutorial purposes)
  const token = `mock-jwt-token-${user.id}-${Date.now()}`;
  
  res.json({ 
    success: true, 
    token,
    user: { id: user.id, username: user.username }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  
  // Check if user exists
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ error: 'Username already exists' });
  }
  
  // Create new user (with plain text password - security bug!)
  const newUser = {
    id: nextUserId++,
    username,
    password // BUG: Should be hashed!
  };
  
  users.push(newUser);
  
  const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;
  
  res.status(201).json({
    success: true,
    token,
    user: { id: newUser.id, username: newUser.username }
  });
});

// Task routes (NO AUTHENTICATION - security bug for hotfix practice!)
app.get('/api/tasks', (req, res) => {
  // BUG: Should use authenticateUser middleware
  const userTasks = tasks.filter(task => task.userId === 1); // Hardcoded user
  res.json({ tasks: userTasks });
});

app.post('/api/tasks', (req, res) => {
  // BUG: No authentication check
  const { title } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Task title required' });
  }
  
  const newTask = {
    id: nextTaskId++,
    title,
    completed: false,
    userId: 1, // Hardcoded user
    createdAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  
  res.status(201).json({ task: newTask });
});

app.put('/api/tasks/:id', (req, res) => {
  // BUG: No authentication check
  const taskId = parseInt(req.params.id);
  const { title, completed } = req.body;
  
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  // CRITICAL BUG: Marking task as complete deletes it instead!
  // This is perfect for hotfix exercise
  if (completed === true) {
    tasks.splice(taskIndex, 1); // BUG: Deletes instead of updating!
    return res.json({ message: 'Task completed and removed' });
  }
  
  // Update task
  if (title !== undefined) {
    tasks[taskIndex].title = title;
  }
  if (completed !== undefined) {
    tasks[taskIndex].completed = completed;
  }
  
  tasks[taskIndex].updatedAt = new Date().toISOString();
  
  res.json({ task: tasks[taskIndex] });
});

app.delete('/api/tasks/:id', (req, res) => {
  // BUG: No authentication check
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  const deletedTask = tasks.splice(taskIndex, 1)[0];
  
  res.json({ message: 'Task deleted', task: deletedTask });
});

// User routes (for future features)
app.get('/api/users/profile', authenticateUser, (req, res) => {
  const user = users.find(u => u.id === req.userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({ 
    user: { 
      id: user.id, 
      username: user.username 
      // Note: Never return password!
    } 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 TaskMaster Pro server running on port ${PORT}`);
  console.log(`📋 API available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log('');
  console.log('⚠️  KNOWN BUGS (for tutorial practice):');
  console.log('   🐛 Login always fails due to password validation bug');
  console.log('   🐛 Completing tasks deletes them instead of marking complete');
  console.log('   🐛 No authentication on task endpoints');
  console.log('   🐛 Passwords stored in plain text');
  console.log('');
  console.log('🎯 Use these bugs for hotfix workflow practice!');
});

module.exports = app;