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
    const userParam = req.body.user + '@gmail.com';
    if (userParam) {
      const userRes = await pool.query('SELECT * FROM users WHERE email=$1 LIMIT 1', [userParam]);
      if (userRes.rowCount) return done(null, userRes.rows[0].id);
    }
    done(null, false, { message: 'User not found' })
  } catch (error) {
    return done(error)
  }
}));

export default passport;