// TaskMaster Pro - Frontend Application
// INTENTIONAL BUGS AND INCOMPLETE FEATURES FOR TUTORIAL

import React, { useState, useEffect } from 'react';
import './App.css';

// Mock API service (with intentional bugs)
const API_BASE = 'http://localhost:3001/api';

const apiService = {
  async login(username, password) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return response.json();
  },

  async getTasks() {
    const response = await fetch(`${API_BASE}/tasks`);
    return response.json();
  },

  async createTask(title) {
    const response = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    return response.json();
  },

  async updateTask(id, updates) {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return response.json();
  },

  async deleteTask(id) {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }
};

// Login Component (with bugs)
function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await apiService.login(username, password);
      
      if (result.success) {
        onLogin(result.user, result.token);
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error - please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>TaskMaster Pro</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="demo-credentials">
        <p><strong>Demo Credentials:</strong></p>
        <p>Username: demo</p>
        <p>Password: password123</p>
        <p><em>(Note: Login currently has a bug - perfect for hotfix practice!)</em></p>
      </div>
    </div>
  );
}

// Task List Component (with bugs and missing features)
function TaskList({ user, token, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const result = await apiService.getTasks();
      setTasks(result.tasks || []);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    
    if (!newTaskTitle.trim()) {
      return;
    }

    try {
      const result = await apiService.createTask(newTaskTitle);
      
      if (result.task) {
        // BUG: Task list doesn't refresh automatically!
        // This is intentional for tutorial practice
        setNewTaskTitle('');
        // Missing: setTasks([...tasks, result.task]);
        console.log('Task created, but list not refreshed - BUG!');
      }
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      // BUG: This will delete the task due to backend bug!
      await apiService.updateTask(task.id, { completed: !task.completed });
      
      // BUG: No proper state update after API call
      // This should reload tasks or update state properly
      console.log('Task update attempted - may have been deleted due to backend bug!');
      
      // TODO: Add proper state management
      // loadTasks(); // This should be called but isn't
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await apiService.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  return (
    <div className="task-container">
      <header className="task-header">
        <h1>TaskMaster Pro</h1>
        <div className="user-info">
          <span>Welcome, {user.username}!</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="add-task-form">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Enter new task..."
          className="task-input"
        />
        <button type="submit" className="add-btn">Add Task</button>
      </form>

      {/* TODO: Add task filters and search */}
      {/* TODO: Add task categories */}
      {/* TODO: Add drag and drop reordering */}
      
      {/* Task List */}
      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : (
        <div className="task-list">
          {tasks.length === 0 ? (
            <div className="no-tasks">
              <p>No tasks yet. Add your first task above!</p>
              <p><em>Note: If you added tasks but don't see them, there's a refresh bug - perfect for practice!</em></p>
            </div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <div className="task-content">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task)}
                    className="task-checkbox"
                  />
                  <span className="task-title">{task.title}</span>
                </div>
                <div className="task-actions">
                  {/* TODO: Add edit functionality */}
                  <button 
                    onClick={() => handleDeleteTask(task.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TODO: Add task statistics */}
      {/* TODO: Add dark mode toggle */}
      {/* TODO: Add real-time updates */}
      
      <div className="tutorial-notes">
        <h3>🎯 Tutorial Practice Opportunities:</h3>
        <ul>
          <li>🐛 <strong>Login Bug</strong>: Fix the authentication issue</li>
          <li>🐛 <strong>Task Completion Bug</strong>: Tasks disappear when marked complete</li>
          <li>🐛 <strong>UI Refresh Bug</strong>: New tasks don't appear without page refresh</li>
          <li>✨ <strong>Dark Mode</strong>: Add theme toggle feature</li>
          <li>✨ <strong>Task Categories</strong>: Add category system</li>
          <li>✨ <strong>Real-time Updates</strong>: Add WebSocket support</li>
        </ul>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const handleLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Check for existing auth on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  return (
    <div className="App">
      {user ? (
        <TaskList user={user} token={token} onLogout={handleLogout} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;