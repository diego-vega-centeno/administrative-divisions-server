import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import pool from '../config/db.js'
import GoogleStrategy from 'passport-google-oauth20';
import OAuth2Strategy from 'passport-oauth2';

const cookieExtractor = (req) => {
  // all token available
  let token;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  return token;
}

const opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET,
  ignoreExpiration: false
}

passport.use('jwt', new JwtStrategy(opts, async function (payload, done) {
  try {
    const userResponse = await pool.query(
      'SELECT * FROM users WHERE id=$1 LIMIT 1',
      [payload.id]
    );
    if (!userResponse.rowCount) return done(null, false, { message: 'User not found' });

    return done(null, userResponse.rows[0]);
  } catch (error) {
    return done(error);
  }
}));

passport.use('google', new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.NODE_ENV === 'development' ?
    process.env.CALLBACK_DEV_GOOGLE_URL : process.env.CALLBACK_PROD_GOOGLE_URL,
},
  async function (accessToken, refreshToken, profile, done) {
    try {
      // find user
      let user;
      user = await pool.query(
        'SELECT * FROM users WHERE oauth_id = $1',
        ['google-' + profile.id]
      );

      if (!user.rowCount) {
        // create new user
        user = await pool.query(
          'INSERT INTO users (name, oauth_id) VALUES ($1, $2) RETURNING *',
          [profile.displayName, 'google-' + profile.id]
        );
      }

      return done(null, user.rows[0]);
    }
    catch (error) {
      return done(error)
    }
  }
));


passport.use(new OAuth2Strategy({
  authorizationURL: 'https://www.openstreetmap.org/oauth2/authorize?' +
    'response_type=code&' +
    `client_id=${process.env.OSM_CLIENT_ID}&` +
    `redirect_uri=${process.env.CALLBACK_DEV_OSM_URL}&` +
    `scope=read_prefs`,
  tokenURL: 'https://www.openstreetmap.org/oauth2/token',
  clientID: process.env.OSM_CLIENT_ID,
  clientSecret: process.env.OSM_CLIENT_SECRET,
  callbackURL: process.env.NODE_ENV === 'development' ?
    process.env.CALLBACK_DEV_OSM_URL : process.env.CALLBACK_PROD_OSM_URL,
  scope: ['read_prefs']
},
  async function (accessToken, refreshToken, profile, done) {
    try {
      const res = await fetch('https://api.openstreetmap.org/api/0.6/user/details.json', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const userData = await res.json();

      // find user
      let user;
      user = await pool.query(
        'SELECT * FROM users WHERE oauth_id = $1',
        ['osm-' + userData.user.id]
      );

      if (!user.rowCount) {
        // create new user
        user = await pool.query(
          'INSERT INTO users (name, oauth_id) VALUES ($1, $2) RETURNING *',
          [userData.user.display_name, 'osm-' + userData.user.id]
        );
      }

      return done(null, user.rows[0]);
    }
    catch (error) {
      return done(error)
    }
  }
));;


export default passport;