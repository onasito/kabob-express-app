import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import { z } from "zod";

const orderItemSchema = z.object({
    menuItemId: z.number(),
    quantity: z.number().int().positive(),
})

const orderSchema = z.object({
    customerName: z.string().min(1),
    customerPhone: z.string().min(1),
    items: z.array(orderItemSchema).min(1),
})

type resolvedOrderItem = {
    menuItemId: number,
    quantity: number,
    price: Prisma.Decimal
}

export async function createOrderItem(menuItemId: number, quantity: number): Promise<resolvedOrderItem | null> {
    const menuItem = await prisma.menuItem.findUnique({ where: { id: menuItemId }});
    if (!menuItem) {
        return null;
    };

    if (!menuItem.isAvailable) {
        return null;
    };

    const data = {
        menuItemId,
        quantity,
        price: menuItem.price
    }

    return data;

}

export async function createOrder(req: Request, res: Response): Promise<void> {
    const result = orderSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ message: result.error.issues[0]?.message });
        return;
    };



}