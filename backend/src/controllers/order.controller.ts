import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import { OrderStatus } from "../generated/prisma/enums.js";
import { z } from "zod";

const orderItemSchema = z.object({
    menuItemId: z.number().int().positive(),
    quantity: z.number().int().positive(),
})

const orderSchema = z.object({
    customerName: z.string().min(1),
    customerPhone: z.string().min(1),
    items: z.array(orderItemSchema).min(1),
})

const updateOrderSchema = z.object({
    status: z.enum(OrderStatus),
})

const terminalStatuses: Array<OrderStatus> = [OrderStatus.COMPLETED, OrderStatus.CANCELLED];

type ResolvedOrderItem = {
    menuItemId: number,
    quantity: number,
    price: Prisma.Decimal
}

type ResolveOrderItemResult =
    | { success: true, data: ResolvedOrderItem }
    | { success: false, reason: "NOT_FOUND" | "UNAVAILABLE" }

async function resolveOrderItem(menuItemId: number, quantity: number): Promise<ResolveOrderItemResult> {
    const menuItem = await prisma.menuItem.findUnique({ where: { id: menuItemId }});
    if (!menuItem) {
        return { success: false, reason: "NOT_FOUND" };
    }

    if (!menuItem.isAvailable) {
        return { success: false, reason: "UNAVAILABLE" };
    }

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

        const verifiedItems: Array<ResolvedOrderItem> = [];
        let totalPrice: Prisma.Decimal = new Prisma.Decimal(0)

        for (const item of items) {
            // No need to check for menuItemId and quantity here because ZOD takes care of it
            const validatedItem = await resolveOrderItem(item.menuItemId, item.quantity);

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
                userId: req.user?.userId ?? null,
                items: {
                    create: verifiedItems
                },
                totalPrice
            },
            include: { items: true }
        })

        res.status(201).json(newOrder);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function getOrders(req: Request, res: Response): Promise<void> {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { id: 'asc' }
        })

        res.json(orders);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function getOrderById(req: Request, res: Response): Promise<void> {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            res.status(400).json({ message: "Invalid order ID" });
            return;
        }

        const order = await prisma.order.findUnique({ 
            where: { id },
            include: { items: true }
        })

        if (!order) {
            res.status(404).json({ message: "No order was found"});
            return;
        }

        res.json(order);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

// Must run after `authenticate` so req.user is populated.
export async function getMyOrders(req: Request, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }

        const orders = await prisma.order.findMany({
            where: { userId: req.user.userId },
            include: { items: true },
            orderBy: { createdAt: "desc" }
        })

        res.json(orders);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function updateOrder(req: Request, res: Response): Promise<void> {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            res.status(400).json({ message: "Invalid order ID" });
            return;
        }

        const result = updateOrderSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ message: result.error.issues[0]?.message });
            return;
        }

        const { status } = result.data;

        const existingOrder = await prisma.order.findUnique({ where: { id } });
        if (!existingOrder) {
            res.status(404).json({ message: "No order was found" });
            return;
        }

        if (terminalStatuses.includes(existingOrder.status)) {
            res.status(400).json({ message: `Order is already ${existingOrder.status} and can no longer be updated` });
            return;
        }

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status },
        })

        res.json(updatedOrder);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}