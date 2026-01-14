import express from 'express';
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken'

const router = express.Router();
let frontendUrl = process.env.NODE_ENV == 'dev' ? process.env.FRONTEND_DEV_URL : process.env.FRONTEND_PROD_URL;

router.get("/",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account"
  })
);

router.get("/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: frontendUrl + "/login"
  }),
  function (req, res) {
    // generate token after passing google authentication
    const token = jwt.sign({ id: req.user.id, email: req.user.email }, process.env.JWT_SECRET, { expiresIn: '1h' })

    // return res.status(200).json({ status: 'OK', message: 'Login successful', data: { id: req.user.id, email: req.user.email, token: token } });
    if (!frontendUrl) {
      console.error('Missing FRONTEND_URL');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  }
);

export default router;