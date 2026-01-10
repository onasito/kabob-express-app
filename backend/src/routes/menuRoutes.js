import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from '../controllers/menuController.js';

const router = express.Router();

// ============== CATEGORY ROUTES ==============

// GET /api/menu/categories - Get all categories with their items
router.get('/categories', getCategories);

// GET /api/menu/categories/:id - Get a specific category with its items
router.get('/categories/:id', getCategoryById);

// POST /api/menu/categories - Create a new category
router.post('/categories', createCategory);

// PUT /api/menu/categories/:id - Update a category
router.put('/categories/:id', updateCategory);

// DELETE /api/menu/categories/:id - Delete a category
router.delete('/categories/:id', deleteCategory);

// ============== ITEM ROUTES ==============

// GET /api/menu/items - Get all menu items
router.get('/items', getItems);

// GET /api/menu/items/:id - Get a specific menu item
router.get('/items/:id', getItemById);

// POST /api/menu/items - Create a new menu item
router.post('/items', createItem);

// PUT /api/menu/items/:id - Update a menu item
router.put('/items/:id', updateItem);

// DELETE /api/menu/items/:id - Delete a menu item
router.delete('/items/:id', deleteItem);

export default router;
