import express from 'express';
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken'

const router = express.Router();
let frontendUrl = process.env.NODE_ENV == 'development' ? process.env.FRONTEND_DEV_URL : process.env.FRONTEND_PROD_URL;

router.get("/",
  passport.authenticate("google", {
    scope: ["profile"],
    prompt: "select_account",
    session: false
  })
);

router.get("/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: frontendUrl + "?error=oauth_failed"
  }),
  function (req, res) {

    // generate token after passing google authentication
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24 // 1d
    })

    res.redirect(`${frontendUrl}/`);
  }
);

export default router;