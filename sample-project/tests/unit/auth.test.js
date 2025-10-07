// Unit Tests for Authentication
// Includes tests for known bugs (perfect for hotfix practice)

const request = require('supertest');
const app = require('../../src/backend/server');

describe('Authentication Tests', () => {
  
  describe('POST /api/auth/login', () => {
    
    test('should return 400 for missing username', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ password: 'password123' })
        .expect(400);
        
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Username and password required');
    });
    
    test('should return 400 for missing password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'demo' })
        .expect(400);
        
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Username and password required');
    });
    
    test('should return 400 for missing both fields', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);
        
      expect(response.body).toHaveProperty('error');
    });
    
    // This test reveals the CRITICAL BUG - login always fails!
    test('KNOWN BUG: should authenticate valid user but currently fails', async () => {
      const validCredentials = {
        username: 'demo',
        password: 'password123'
      };
      
      const response = await request(app)
        .post('/api/auth/login')
        .send(validCredentials)
        .expect(401); // Currently returns 401 due to bug!
        
      // This test documents the bug - it should return 200 with success: true
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Invalid credentials');
      
      // TODO: After hotfix, this test should expect:
      // .expect(200)
      // expect(response.body).toHaveProperty('success', true);
      // expect(response.body).toHaveProperty('token');
      // expect(response.body.user).toHaveProperty('username', 'demo');
    });
    
    test('should return 401 for non-existent user', async () => {
      const invalidCredentials = {
        username: 'nonexistent',
        password: 'anypassword'
      };
      
      const response = await request(app)
        .post('/api/auth/login')
        .send(invalidCredentials)
        .expect(401);
        
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Invalid credentials');
    });
    
    // Test for when the bug is fixed
    test.skip('AFTER HOTFIX: should authenticate valid user credentials', async () => {
      // This test should pass after the login bug is fixed
      const validCredentials = {
        username: 'demo',
        password: 'password123'
      };
      
      const response = await request(app)
        .post('/api/auth/login')
        .send(validCredentials)
        .expect(200);
        
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('username', 'demo');
      expect(response.body.user).not.toHaveProperty('password');
    });
    
  });
  
  describe('POST /api/auth/register', () => {
    
    test('should return 400 for missing username', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ password: 'newpassword' })
        .expect(400);
        
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Username and password required');
    });
    
    test('should return 400 for missing password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ username: 'newuser' })
        .expect(400);
        
      expect(response.body).toHaveProperty('error');
    });
    
    test('should return 409 for existing username', async () => {
      const existingUser = {
        username: 'demo', // This user already exists
        password: 'anypassword'
      };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(existingUser)
        .expect(409);
        
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Username already exists');
    });
    
    test('should successfully register new user', async () => {
      const newUser = {
        username: `testuser_${Date.now()}`, // Unique username
        password: 'testpassword123'
      };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(201);
        
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('username', newUser.username);
      expect(response.body.user).not.toHaveProperty('password');
    });
    
    // Security test - documents the password storage bug
    test('SECURITY BUG: passwords should be hashed but currently stored in plain text', () => {
      // This test documents a security vulnerability
      // In a real app, this would be a critical security issue
      
      // TODO: After security fix, add test to verify password hashing:
      // - Passwords should never be stored in plain text
      // - Should use bcrypt or similar hashing algorithm
      // - Should include salt for additional security
      
      console.warn('⚠️  SECURITY WARNING: Passwords are stored in plain text!');
      console.warn('   This is intentional for tutorial purposes only.');
      console.warn('   In production, always hash passwords before storage.');
    });
    
  });
  
  describe('Authentication Middleware', () => {
    
    test('SECURITY BUG: authentication middleware is broken', () => {
      // This test documents that the authentication middleware
      // currently allows all requests through without proper validation
      
      // TODO: After security fix, add proper authentication tests:
      // - Valid JWT tokens should be accepted
      // - Invalid tokens should be rejected
      // - Missing tokens should be rejected
      // - Expired tokens should be rejected
      
      console.warn('⚠️  SECURITY WARNING: Authentication middleware bypassed!');
      console.warn('   All requests are currently allowed through.');
      console.warn('   This creates a major security vulnerability.');
    });
    
  });
  
});

// Test utilities for authentication testing
const authTestUtils = {
  
  // Helper to create a test user
  async createTestUser(username = `testuser_${Date.now()}`) {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username,
        password: 'testpassword123'
      });
      
    return response.body;
  },
  
  // Helper to attempt login (will fail due to bug)
  async attemptLogin(username, password) {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username, password });
      
    return response.body;
  }
  
};

module.exports = { authTestUtils };