import request from 'supertest';
import app from '../../../app.js';
import pool from '../../config/db.js';

describe('POST /login', () => {

  afterAll(async () => {
    // Close db connection
    await pool.end();
  });

  test('should successfully log in', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'user1@gmail.com'
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
  });

  test('should return 400 if email is missing', async () => {
    const response = await request(app)
      .post('/login')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('ERROR');
  });

  test('should return 400 if email is invalid', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'invalid-email' });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('ERROR');
  });

  test('should return 404 if user not found', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'nonexistentuser@test.com' });

    expect(response.status).toBe(404);
    expect(response.body.status).toBe('ERROR');
    expect(response.body.message).toBe('User not found');
  });

});

