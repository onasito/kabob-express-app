import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

/**
 * Public vs protected:
 * - If you haven't built auth yet, leave these unprotected for local testing.
 * - Once JWT auth exists, lock them down (admin/staff).
 */

// GET /api/users
router.get("/", /* requireAuth, requireRole("ADMIN"), */ getUsers);

// GET /api/users/:id
router.get("/:id", /* requireAuth, requireRole("ADMIN"), */ getUserById);

// POST /api/users
router.post("/", /* requireAuth, requireRole("ADMIN"), */ createUser);

// PATCH /api/users/:id
router.patch("/:id", /* requireAuth, requireRole("ADMIN"), */ updateUser);

// DELETE /api/users/:id
router.delete("/:id", /* requireAuth, requireRole("ADMIN"), */ deleteUser);

export default router;