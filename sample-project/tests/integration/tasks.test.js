// Integration Tests for Task Management
// Includes tests for known bugs (perfect for hotfix practice)

const request = require('supertest');
const app = require('../../src/backend/server');

describe('Task Management Integration Tests', () => {
  
  describe('GET /api/tasks', () => {
    
    test('should return tasks without authentication (SECURITY BUG)', async () => {
      // This test documents a security bug - tasks are accessible without auth
      const response = await request(app)
        .get('/api/tasks')
        .expect(200);
        
      expect(response.body).toHaveProperty('tasks');
      expect(Array.isArray(response.body.tasks)).toBe(true);
      
      console.warn('⚠️  SECURITY BUG: Tasks accessible without authentication!');
    });
    
    test('should return sample tasks for demo', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(200);
        
      expect(response.body.tasks.length).toBeGreaterThan(0);
      
      // Check structure of returned tasks
      const firstTask = response.body.tasks[0];
      expect(firstTask).toHaveProperty('id');
      expect(firstTask).toHaveProperty('title');
      expect(firstTask).toHaveProperty('completed');
      expect(firstTask).toHaveProperty('userId');
    });
    
  });
  
  describe('POST /api/tasks', () => {
    
    test('should create new task without authentication (SECURITY BUG)', async () => {
      const newTask = {
        title: 'Test Task from Integration Test'
      };
      
      const response = await request(app)
        .post('/api/tasks')
        .send(newTask)
        .expect(201);
        
      expect(response.body).toHaveProperty('task');
      expect(response.body.task.title).toBe(newTask.title);
      expect(response.body.task.completed).toBe(false);
      expect(response.body.task).toHaveProperty('id');
      expect(response.body.task).toHaveProperty('createdAt');
      
      console.warn('⚠️  SECURITY BUG: Can create tasks without authentication!');
    });
    
    test('should return 400 for missing title', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({})
        .expect(400);
        
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Task title required');
    });
    
    test('should return 400 for empty title', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: '' })
        .expect(400);
        
      expect(response.body).toHaveProperty('error');
    });
    
  });
  
  describe('PUT /api/tasks/:id', () => {
    
    let testTaskId;
    
    beforeEach(async () => {
      // Create a test task before each test
      const createResponse = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task for Update Test' });
        
      testTaskId = createResponse.body.task.id;
    });
    
    test('should update task title', async () => {
      const updatedTitle = 'Updated Task Title';
      
      const response = await request(app)
        .put(`/api/tasks/${testTaskId}`)
        .send({ title: updatedTitle })
        .expect(200);
        
      expect(response.body.task.title).toBe(updatedTitle);
      expect(response.body.task).toHaveProperty('updatedAt');
    });
    
    test('CRITICAL BUG: marking task as complete deletes it instead!', async () => {
      // This test documents the critical task completion bug
      
      const response = await request(app)
        .put(`/api/tasks/${testTaskId}`)
        .send({ completed: true })
        .expect(200);
        
      // The bug: task gets deleted instead of marked complete
      expect(response.body.message).toBe('Task completed and removed');
      
      // Verify task is actually gone
      const getResponse = await request(app)
        .get('/api/tasks')
        .expect(200);
        
      const taskExists = getResponse.body.tasks.find(task => task.id === testTaskId);
      expect(taskExists).toBeUndefined();
      
      console.error('🐛 CRITICAL BUG: Task deleted when marked complete!');
      console.error('   Expected: Task should be marked as completed');
      console.error('   Actual: Task gets deleted from the system');
      console.error('   Impact: Users lose their completed tasks');
    });
    
    test('should return 404 for non-existent task', async () => {
      const nonExistentId = 99999;
      
      const response = await request(app)
        .put(`/api/tasks/${nonExistentId}`)
        .send({ title: 'Updated Title' })
        .expect(404);
        
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Task not found');
    });
    
    // Test for when the bug is fixed
    test.skip('AFTER HOTFIX: should mark task as complete without deleting', async () => {
      // This test should pass after the completion bug is fixed
      
      const response = await request(app)
        .put(`/api/tasks/${testTaskId}`)
        .send({ completed: true })
        .expect(200);
        
      expect(response.body.task.completed).toBe(true);
      expect(response.body.task.id).toBe(testTaskId);
      
      // Verify task still exists
      const getResponse = await request(app)
        .get('/api/tasks')
        .expect(200);
        
      const updatedTask = getResponse.body.tasks.find(task => task.id === testTaskId);
      expect(updatedTask).toBeDefined();
      expect(updatedTask.completed).toBe(true);
    });
    
  });
  
  describe('DELETE /api/tasks/:id', () => {
    
    let testTaskId;
    
    beforeEach(async () => {
      // Create a test task before each test
      const createResponse = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task for Delete Test' });
        
      testTaskId = createResponse.body.task.id;
    });
    
    test('should delete task successfully', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${testTaskId}`)
        .expect(200);
        
      expect(response.body.message).toBe('Task deleted');
      expect(response.body.task.id).toBe(testTaskId);
      
      // Verify task is gone
      const getResponse = await request(app)
        .get('/api/tasks')
        .expect(200);
        
      const deletedTask = getResponse.body.tasks.find(task => task.id === testTaskId);
      expect(deletedTask).toBeUndefined();
    });
    
    test('should return 404 for non-existent task', async () => {
      const nonExistentId = 99999;
      
      const response = await request(app)
        .delete(`/api/tasks/${nonExistentId}`)
        .expect(404);
        
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Task not found');
    });
    
  });
  
  describe('Task Workflow Integration', () => {
    
    test('complete task lifecycle (create, read, update, delete)', async () => {
      // Create task
      const createResponse = await request(app)
        .post('/api/tasks')
        .send({ title: 'Lifecycle Test Task' })
        .expect(201);
        
      const taskId = createResponse.body.task.id;
      
      // Read tasks
      const readResponse = await request(app)
        .get('/api/tasks')
        .expect(200);
        
      const createdTask = readResponse.body.tasks.find(task => task.id === taskId);
      expect(createdTask).toBeDefined();
      expect(createdTask.title).toBe('Lifecycle Test Task');
      
      // Update task title (this should work)
      const updateResponse = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({ title: 'Updated Lifecycle Task' })
        .expect(200);
        
      expect(updateResponse.body.task.title).toBe('Updated Lifecycle Task');
      
      // Delete task
      await request(app)
        .delete(`/api/tasks/${taskId}`)
        .expect(200);
        
      // Verify task is gone
      const finalReadResponse = await request(app)
        .get('/api/tasks')
        .expect(200);
        
      const deletedTask = finalReadResponse.body.tasks.find(task => task.id === taskId);
      expect(deletedTask).toBeUndefined();
    });
    
    test('BUG SCENARIO: task disappears when user tries to mark as complete', async () => {
      // This test simulates the user experience of the completion bug
      
      // User creates a task
      const createResponse = await request(app)
        .post('/api/tasks')
        .send({ title: 'Important Work Task' })
        .expect(201);
        
      const taskId = createResponse.body.task.id;
      
      // User works on the task and wants to mark it complete
      // BUG: Task gets deleted instead!
      await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({ completed: true })
        .expect(200);
        
      // User checks their tasks and the completed task is gone!
      const getResponse = await request(app)
        .get('/api/tasks')
        .expect(200);
        
      const missingTask = getResponse.body.tasks.find(task => task.id === taskId);
      expect(missingTask).toBeUndefined();
      
      console.error('🐛 USER IMPACT: Important work task disappeared!');
      console.error('   This would cause significant user frustration');
      console.error('   Users would lose track of their completed work');
    });
    
  });
  
  describe('Security Issues', () => {
    
    test('SECURITY: all task endpoints accessible without authentication', async () => {
      // Document all the security issues in one test
      
      console.warn('🚨 SECURITY AUDIT FINDINGS:');
      console.warn('');
      console.warn('1. GET /api/tasks - No authentication required');
      console.warn('   Risk: Anyone can view all tasks');
      console.warn('');
      console.warn('2. POST /api/tasks - No authentication required');
      console.warn('   Risk: Anyone can create tasks');
      console.warn('');
      console.warn('3. PUT /api/tasks/:id - No authentication required'); 
      console.warn('   Risk: Anyone can modify any task');
      console.warn('');
      console.warn('4. DELETE /api/tasks/:id - No authentication required');
      console.warn('   Risk: Anyone can delete any task');
      console.warn('');
      console.warn('RECOMMENDATION: Add authentication middleware to all task routes');
      
      // Verify all endpoints work without auth
      await request(app).get('/api/tasks').expect(200);
      await request(app).post('/api/tasks').send({title: 'Unauthorized task'}).expect(201);
      
      // This is a serious security vulnerability in a real app!
    });
    
  });
  
});