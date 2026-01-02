import express from 'express';
import passport from '../config/passport.js';
import { saveFavorites } from '../models/dbWrites.js';

const router = express.Router();

router.post('/',
  passport.authenticate('jwt', { session: false }),
  async function (req, res, next) {
    const userId = req.user;
    try {
      saveFavorites(userId, req.body.osmRelId, req.body.osmRelName)
      return res.status(200).json({ status: 'OK', message: 'Favorite saved' })
    } catch (error) {
      next(error)
    }
  });

export default router;