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

type CreateOrderItemResult =
    | { success: true, data: resolvedOrderItem }
    | { success: false, reason: "NOT_FOUND" | "UNAVAILABLE" }

export async function createOrderItem(menuItemId: number, quantity: number): Promise<CreateOrderItemResult> {
    const menuItem = await prisma.menuItem.findUnique({ where: { id: menuItemId }});
    if (!menuItem) {
        return { success: false, reason: "NOT_FOUND" };
    };

    if (!menuItem.isAvailable) {
        return { success: false, reason: "UNAVAILABLE" };
    };

    const data = {
        menuItemId,
        quantity,
        price: menuItem.price
    }

    return { success: true, data };

}

export async function createOrder(req: Request, res: Response): Promise<void> {
    try {
        const result = orderSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ message: result.error.issues[0]?.message });
            return;
        };

        const {customerName, customerPhone, items} = result.data;

        const verifiedItems: Array<resolvedOrderItem> = [];
        let totalPrice: Prisma.Decimal = new Prisma.Decimal(0)

        for (const item of items) {
            // No need to check for menuItemId and quantity here because ZOD takes care of it
            const validatedItem = await createOrderItem(item.menuItemId, item.quantity);

            if (!validatedItem.success) {
                res.status(400).json({ message: validatedItem.reason })
                return;
            }

            totalPrice = totalPrice.plus(validatedItem.data.price.times(validatedItem.data.quantity))

            verifiedItems.push(validatedItem.data);

        }

        const newOrder = await prisma.order.create({
            data: {
                customerName,
                customerPhone,
                items: {
                    create: verifiedItems
                },
                totalPrice
            },
            include: { items: true }
        });

        res.status(201).json(newOrder);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }



}