import { Router } from "express";
import { createOrder,  } from "../controllers/order.controller.js";
import { attachUserIfPresent } from "../middleware/auth.js";

const router = Router()

router.post("/orders", attachUserIfPresent, createOrder);

export default router;