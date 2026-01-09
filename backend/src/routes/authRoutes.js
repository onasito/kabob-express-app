import express from 'express';
import {
    register,
    login,
    me
} from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// GET /api/auth/me - get current logged in user
router.get("/me", /* requireAuth, */ me);

export default router;