import express from 'express';
// import pool from '../config/db.js';
import { saveFavorites } from '../models/dbWrites.js';
import { authenticateJWT } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { favoriteSchema } from '../schemas/validation.js';

const router = express.Router();

// PUT /api/favorites - Save a favorite
router.put('/', authenticateJWT, validate(favoriteSchema),
  async function (req, res, next) {
    try {
      await saveFavorites(req.user.id, req.body.osmRelId, req.body.osmRelName);
      return res.status(200).json({ status: 'OK', message: 'Favorite saved' });
    } catch (error) {
      next(error);
    }
  });

// GET /api/favorites - Get user's favorites
// router.get('/', authenticateJWT,
//   async function (req, res, next) {
//     const userId = req.user.id;
//     try {
//       const result = await pool.query('SELECT * FROM favorites WHERE user_id = $1', [userId]);
//       return res.status(200).json({ status: 'OK', data: result.rows });
//     } catch (error) {
//       next(error);
//     }
//   });

// // DELETE /api/favorites/:id - Delete a favorite
// router.delete('/:id', authenticateJWT,
//   async function (req, res, next) {
//     const userId = req.user.id;
//     const favoriteId = req.params.id;
//     try {
//       const result = await pool.query('DELETE FROM favorites WHERE id = $1 AND user_id = $2', [favoriteId, userId]);
//       if (result.rowCount === 0) {
//         return res.status(404).json({ status: 'ERROR', message: 'Favorite not found' });
//       }
//       return res.status(200).json({ status: 'OK', message: 'Favorite deleted' });
//     } catch (error) {
//       next(error);
//     }
//   });

export default router;