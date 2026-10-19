import { Router } from "express";
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "../controllers/user.controllers.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = Router()

router.post("/users", authenticate, requireRole("ADMIN"), createUser);
router.delete("/users/:id", authenticate, requireRole("ADMIN"), deleteUser);
router.get("/users", authenticate, requireRole("ADMIN"), getUsers)
router.get("/users/:id", authenticate, requireRole("ADMIN"), getUserById)
router.patch("/users/:id", authenticate, requireRole("ADMIN"), updateUser)

export default router;