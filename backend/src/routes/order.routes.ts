import { Router } from "express";
import { createOrder, getOrderById, getOrders, updateOrder } from "../controllers/order.controller.js";
import { attachUserIfPresent, authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router()

router.post("/orders", attachUserIfPresent, createOrder);
router.patch("/orders/:id", authenticate, requireAdmin, updateOrder);
router.get("/orders/:id", authenticate, requireAdmin, getOrderById);
router.get("/orders", authenticate, requireAdmin, getOrders);

export default router;