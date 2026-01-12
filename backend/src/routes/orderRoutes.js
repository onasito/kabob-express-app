import express from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getOrdersByUser,
} from '../controllers/orderController.js';

const router = express.Router();

/**
 * Order Routes
 *
 * These routes handle order management for the kabob restaurant.
 * Consider adding authentication middleware for production use.
 */

// GET /api/orders - Get all orders (supports ?status=PENDING&userId=1 query params)
router.get('/', getOrders);

// GET /api/orders/user/:userId - Get all orders for a specific user
router.get('/user/:userId', getOrdersByUser);

// GET /api/orders/:id - Get a specific order with items
router.get('/:id', getOrderById);

// POST /api/orders - Create a new order
router.post('/', createOrder);

// PATCH /api/orders/:id - Update order details (customerName, customerPhone, status)
router.patch('/:id', updateOrder);

// PATCH /api/orders/:id/status - Update only the order status
router.patch('/:id/status', updateOrderStatus);

// DELETE /api/orders/:id - Delete an order
router.delete('/:id', deleteOrder);

export default router;
