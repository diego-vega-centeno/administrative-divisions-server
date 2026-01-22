import jwt from 'jsonwebtoken';
import pool from '../../config/db';

async function generateTestToken(user = { name: 'test_user_name', email: 'test_user@test.com', oauthId: 'google-test_user' }) {
  const userResp = await pool.query(`
    INSERT INTO users (name, email, oauth_id) 
    VALUES ($1, $2, $3)
    RETURNING id`, [user.name, user.email, user.oauthId]
  );
  return jwt.sign({ id: userResp.rows[0].id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

export { generateTestToken }