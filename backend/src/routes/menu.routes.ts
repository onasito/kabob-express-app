import { Router } from "express";
import {
    createCategory, updateCategory, deleteCategory, getCategories, getCategoryById, createItem,
    updateItem, deleteItem, getItems, getItemById
} from "../controllers/menu.controller.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = Router();

// Categories
router.post("/categories", authenticate, requireRole("ADMIN"), createCategory);
router.patch("/categories/:id", authenticate, requireRole("ADMIN"), updateCategory);
router.delete("/categories/:id", authenticate, requireRole("ADMIN"), deleteCategory);
router.get("/categories", getCategories);
router.get("/categories/:id", getCategoryById);

// Items
router.post("/items", authenticate, requireRole("ADMIN"), createItem);
router.patch("/items/:id", authenticate, requireRole("ADMIN"), updateItem);
router.delete("/items/:id", authenticate, requireRole("ADMIN"), deleteItem);
router.get("/items", getItems);
router.get("/items/:id", getItemById);

export default router;
