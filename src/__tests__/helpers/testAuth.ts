import jwt from 'jsonwebtoken';
import pool from '../../config/db.js';

async function generateTestToken(user = { name: 'test_user_name', oauthId: 'google-test_user' }) {
  const userResp = await pool.query(`
    INSERT INTO users (name, oauth_id) 
    VALUES ($1, $2)
    RETURNING id`, [user.name, user.oauthId]
  );
  return jwt.sign({ id: userResp.rows[0].id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
}

export { generateTestToken }