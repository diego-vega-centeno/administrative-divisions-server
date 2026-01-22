import request from 'supertest';
import app from '../../../app.js';
import pool from '../../config/db.js';
import { installMockGoogleStrategy, restoreOriginalGoogleStrategy } from '../helpers/passportMock.js';

describe('OAuth Google Authentication', () => {

  beforeAll(() => {
    // Install mock strategy before tests
    installMockGoogleStrategy();
  });

  afterAll(async () => {
    // Restore original strategy
    restoreOriginalGoogleStrategy();

    // Clean up test users
    const usersResult = await pool.query("SELECT id FROM users WHERE oauth_id LIKE 'google-test-%'");
    const userIds = usersResult.rows.map(row => row.id);

    if (userIds.length > 0) {
      await pool.query('DELETE FROM users WHERE id = ANY($1)', [userIds]);
    }

    // Close db connection
    await pool.end();
  });

  describe('GET /auth/google', () => {
    test('should redirect to Google OAuth', async () => {
      const response = await request(app)
        .get('/auth/google');

      expect(response.status).toBe(302);
      expect(response.headers.location).toContain('accounts.google.com');
      expect(response.headers.location).toContain('scope=profile%20email');
    });

    test('should handle OAuth redirect without session errors', async () => {
      // Test that the initial OAuth request doesn't require sessions
      const response = await request(app)
        .get('/auth/google')
        .expect(302);

      // Should not throw session-related errors
      expect(response.headers.location).toBeDefined();
    });
  });

  describe('GET /auth/google/callback', () => {
    test('should handle failed oauth code', async () => {
      const response = await request(app)
        .get('/auth/google/callback')
        .query({ code: 'oauth_failed' });

      // Should redirect to frontend with error
      expect(response.status).toBe(302);
      expect(response.headers.location).toContain('error=oauth_failed');
    });

    test('should successfully authenticate with mock strategy', async () => {
      // Mock the OAuth callback with mock code
      const response = await request(app)
        .get('/auth/google/callback')
        .query({ code: 'oauth_succeeded' });

      // With mock strategy, should redirect to frontend on success
      expect(response.status).toBe(302);

      // Should redirect to frontend URL (not error)
      expect(response.headers.location).not.toContain('error=oauth_failed');

      // Check that JWT cookie is set
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'][0]).toContain('jwt=');
    });

      test('should set secure JWT cookie in production', async () => {
        // Temporarily set production mode to set secure to true
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';

        const response = await request(app)
          .get('/auth/google/callback')
          .query({ code: 'oauth_succeeded' });

        // Restore original env
        process.env.NODE_ENV = originalEnv;

        expect(response.status).toBe(302);

        // Check for secure cookie attributes in production
        const cookieHeader = response.headers['set-cookie'][0];
        expect(cookieHeader).toContain('Secure');
        expect(cookieHeader).toContain('HttpOnly');
      });
  });
});
