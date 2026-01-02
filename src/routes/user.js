import express from 'express'
import passport from '../config/passport.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

router.get('/:user', authenticateJWT,
  function (req, res, next) {
    return res.status(200).json({ status: 'OK', message: 'User found' })
  }
)

export default router;