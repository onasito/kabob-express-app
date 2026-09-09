import { Router } from "express";
import { createOrder,  } from "../controllers/order.controller.js";

const router = Router()

router.post("/orders", createOrder);

export default router;