import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import pool from '../config/db.js'
import GoogleStrategy from 'passport-google-oauth20';

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

passport.use('google', new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.NODE_ENV == 'dev' ? process.env.CALLBACK_DEV_URL : process.env.CALLBACK_PROD_URL,
},
  async function (accessToken, refreshToken, profile, done) {
    try {
      // find user
      const user = await pool.query('SELECT * FROM users WHERE oauth_id = $1', [profile.id]);

      if (!user.rowCount) {
        // create new user
        const newUser = await pool.query('INSERT INTO users (email, name, oauth_id) VALUES ($1, $2, $3) RETURNING *',
          [profile.emails[0].value, profile.displayName, profile.id]
        );
        return done(null, newUser.rows[0]);
      }

      return done(null, user.rows[0]);
    }
    catch (error) {
      return done(error)
    }
  }
));

export default passport;