import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import pool from '../config/db.js'

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true,
  ignoreExpiration: false
}

passport.use('jwt', new JwtStrategy(opts, async function (req, payload, done) {
  try {
    const email = req.body.email;
    if (email) {
      const userResponse = await pool.query('SELECT * FROM users WHERE email=$1 LIMIT 1', [email]);
      if (!userResponse.rowCount) return done(null, false, { message: 'User not found' })
      if (userResponse.rows[0].id !== payload.id) return done(null, false, { message: 'User unauthorized' })
        
      return done(null, userResponse.rows[0].id);
    }
    
  } catch (error) {
    return done(error)
  }
}));

export default passport;