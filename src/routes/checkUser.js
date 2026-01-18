import express from "express";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

router.get('/', authenticateJWT, (req, res) => {
  res.status(200).json({ status: 'OK', data: req.user });
});

export default router;