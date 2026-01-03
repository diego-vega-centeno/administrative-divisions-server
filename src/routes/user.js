import express from 'express'
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', authenticateJWT,
  function (req, res, next) {
    return res.status(200).json({ status: 'OK', message: 'User found', data: { id: req.user.id, email: req.user.email} });
  }
)

export default router;