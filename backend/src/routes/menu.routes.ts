import { Router } from "express";
import {
    createCategory, updateCategory, deleteCategory, getCategories, getCategoryById, createItem,
    updateItem, deleteItem, getItems, getItemById
} from "../controllers/menu.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

// Categories
router.post("/categories", authenticate, requireAdmin, createCategory);
router.patch("/categories/:id", authenticate, requireAdmin, updateCategory);
router.delete("/categories/:id", authenticate, requireAdmin, deleteCategory);
router.get("/categories", getCategories);
router.get("/categories/:id", getCategoryById);

// Items
router.post("/items", authenticate, requireAdmin, createItem);
router.patch("/items/:id", authenticate, requireAdmin, updateItem);
router.delete("/items/:id", authenticate, requireAdmin, deleteItem);
router.get("/items", getItems);
router.get("/items/:id", getItemById);

export default router;
