import request from 'supertest';
import app from '../../../app.js';
import pool from '../../config/db.js';

let token;

beforeAll(async () => {
  const response = await request(app)
    .post('/login')
    .send({
      email: 'user1@test.com'
    });

  token = response.body.data.token;
});

afterAll(async () => {
  // Close db connection
  await pool.end();
});

describe('GET /api/v1/countries/:countryId', () => {
  test('should return 403 if unauthorized', async () => {
    const response = await request(app)
      .get('/api/v1/countries/288247')
      .set('Authorization', `Bearer not-a-token`);

    expect(response.status).toBe(403);
    expect(response.body.status).toBe('FAILURE');
  });

  test('should return 404  and no country found', async () => {
    const response = await request(app)
      .get('/api/v1/countries/non-an-id')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.status).toBe('ERROR');
  });

  test('should return a valid JSON structure', async () => {
    const response = await request(app)
      .get('/api/v1/countries/288247')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.data).toBeDefined();
    expect(Array.isArray(response.body.data)).toBe(true);

    // Check if data has expected structure
    if (response.body.data.length > 0) {
      const rels = response.body.data;
      expect(rels.every(rel => (
        Object.hasOwn(rel, 'id') &&
        Object.hasOwn(rel, 'admin_level')
      ))).toBe(true);
    }
  });

  test('should filter by levels correctly', async () => {
    const response = await request(app)
      .get('/api/v1/countries/288247?levels=4,6')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.every(rel =>
      ['4', '6'].includes(rel.admin_level)
    )).toBe(true);
  });
});