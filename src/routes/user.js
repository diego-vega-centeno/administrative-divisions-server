import express from 'express'
import passport from '../config/passport.js';

const router = express.Router();

router.get('/:user',
  passport.authenticate('jwt', { session: false }),
  function (req, res, next) {
    return res.status(200).json({ status: 'OK', message: 'User found' })
  }
)

export default router;