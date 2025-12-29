import express from 'express'

const router = express.Router();

router.post('/login', function (req, res, next) {
  return res.status(200).json({status: 'OK', message: 'Login successful'})
})

export default router;