import { Router } from "express";
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "../controllers/user.controllers.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router()

router.post("/users", authenticate, requireAdmin, createUser);
router.delete("/users/:id", authenticate, requireAdmin, deleteUser);
router.get("/users", authenticate, requireAdmin, getUsers)
router.get("/users/:id", authenticate, requireAdmin, getUserById)
router.patch("/users/:id", authenticate, requireAdmin, updateUser)

export default router;