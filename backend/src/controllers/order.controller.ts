import type { Request, Response } from "express";
import { z } from "zod";

const orderItemSchema = z.object({
    quantity: z.number().int(),

})

const orderSchema = z.object({
    customerName: z.string().min(1),
    customerPhone: z.string().min(1),
    items: z.array(orderItemSchema).min(1),
})

export async function createOrder(req: Request, res: Response): Promise<void> {
    const result = orderSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ message: result.error.issues[0]?.message });
        return;
    };

}