import express from 'express';
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken'

const router = express.Router();
let frontendUrl = process.env.NODE_ENV == 'development' ? process.env.FRONTEND_DEV_URL : process.env.FRONTEND_PROD_URL;

router.get("/",
  passport.authenticate('oauth2', {
    session: false
  }),
);

router.get("/callback",
  passport.authenticate("oauth2", {
    session: false,
    failureRedirect: frontendUrl + "?error=oauth_failed"
  }),
  function (req, res) {
    console.log({ id: req.user.id, name: req.user.name });
    // generate token after passing osm authentication
    const token = jwt.sign(
      { id: req.user.id, name: req.user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 // 1d
    })

    res.redirect(`${frontendUrl}/`);
  }
);

export default router;