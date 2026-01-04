import request from 'supertest';
import app from '../../../app.js';
import pool from '../../config/db.js';

let token;
let favorite;

beforeAll(async () => {
  const response = await request(app)
    .post('/login')
    .send({
      email: 'user1@test.com'
    });

  token = response.body.data.token;

  const usersResult = await pool.query("SELECT * FROM users WHERE email LIKE '%@test.com'");
  const userIds = usersResult.rows.map(row => row.id);

  if (userIds.length > 0) {
    await pool.query('DELETE FROM favorites WHERE user_id = ANY($1)', [userIds]);
  }
});

afterAll(async () => {
  const usersResult = await pool.query("SELECT id FROM users WHERE email LIKE '%@test.com'");
  const userIds = usersResult.rows.map(row => row.id);

  // clean favorites
  if (userIds.length > 0) {
    await pool.query('DELETE FROM favorites WHERE user_id = ANY($1)', [userIds]);
  }
  // Close db connection
  await pool.end();
});

describe('PUT /api/favorites', () => {

  test('should successfuly add new favorites', async () => {
    const response = await request(app)
      .put('/api/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({ osmRelName: 'rel1_name', osmRelId: 'rel1_id' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
  });

  test('should return 403 if unauthorized', async () => {
    const response = await request(app)
      .put('/api/favorites')
      .set('Authorization', `Bearer not-a-token`);

    expect(response.status).toBe(403);
    expect(response.body.status).toBe('FAILURE');
  });

  test('should return 400 if osmRelId is missing', async () => {
    const response = await request(app)
      .put('/api/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({ osmRelName: 'Test Name' });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('ERROR');
  });

  test('should return 400 if osmRelName is missing', async () => {
    const response = await request(app)
      .put('/api/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({ osmRelId: '123' });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('ERROR');
  });
});

describe('GET /api/favorites', () => {

  test('should return 200 and user favorites', async () => {
    const response = await request(app)
      .get('/api/favorites')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).not.toHaveLength(0);

    favorite = response.body.data[0];
  });

  test('should successfully delete favorite', async () => {
    const response = await request(app)
      .delete(`/api/favorites/${favorite.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
  });
});

