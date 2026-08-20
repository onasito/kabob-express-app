import { Router } from "express";
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "../controllers/user.controllers.js";

const router = Router()

router.post("/users", createUser);
router.delete("/users/:id", deleteUser);
router.get("/users", getUsers)
router.get("/users/:id", getUserById)
router.patch("/users/:id", updateUser)

export default router;