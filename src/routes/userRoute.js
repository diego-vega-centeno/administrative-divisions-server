import express from "express";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

router.get('/me', authenticateJWT, (req, res) => {
  res.status(200).json({data: req.user });
});

router.get('/logout', authenticateJWT, (req, res) => {
  res.clearCookie('jwt');
  res.sendStatus(201);
});

export default router;