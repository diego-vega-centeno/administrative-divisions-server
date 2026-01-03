import express from 'express'
import pool from '../config/db.js'
import jwt from 'jsonwebtoken'

const router = express.Router();

router.post('/', async function (req, res, next) {
  try {
    let dbQueryRes = await pool.query('SELECT * FROM users WHERE email = $1', [req.body.email])

    if (!dbQueryRes.rowCount) return res.status(404).json({ status: 'ERROR', message: 'User not found' })

    const user = dbQueryRes.rows[0]

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' })

    return res.status(200).json({ status: 'OK', message: 'Login successful', data: { id: user.id, email: user.email, token: token } })
  } catch (error) {
    next(error);
  }
})

export default router;