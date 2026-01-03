import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import pool from '../config/db.js'

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  ignoreExpiration: false
}

passport.use('jwt', new JwtStrategy(opts, async function (payload, done) {
  try {
    const userResponse = await pool.query('SELECT * FROM users WHERE id=$1 LIMIT 1', [payload.id]);
    if (!userResponse.rowCount) return done(null, false, { message: 'User not found' });
    
    return done(null, userResponse.rows[0]);
  } catch (error) {
    return done(error);
  }
}));

export default passport;