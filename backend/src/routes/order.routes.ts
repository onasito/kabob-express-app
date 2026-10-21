import { Router } from "express";
import { createOrder, getOrderById, getOrders, updateOrder, getMyOrders } from "../controllers/order.controller.js";
import { attachUserIfPresent, authenticate, requireRole } from "../middleware/auth.js";

const router = Router()

router.post("/orders", attachUserIfPresent, createOrder);
router.get("/orders/me", authenticate, getMyOrders);
router.patch("/orders/:id", authenticate, requireRole("ADMIN", "STAFF"), updateOrder);
router.get("/orders/:id", authenticate, requireRole("ADMIN", "STAFF"), getOrderById);
router.get("/orders", authenticate, requireRole("ADMIN", "STAFF"), getOrders);

export default router;