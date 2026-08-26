import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import { z } from "zod"

const itemSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.coerce.number().positive(),
  isAvailable: z.boolean().optional(),
  categoryId: z.number().int(),
});

function handleUserError(error: unknown, res: Response): void {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (error.code === 'P2002') {
            res.status(409).json({ message: "Email already in use" });
            return;
        }
    }
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
    return;
}



export async function createItem(req: Request, res: Response): Promise<void> {
    try {
        const result = itemSchema.safeParse(req.body)
        if (!result.success) {
            res.status(400).json({ message: result.error.issues[0]?.message });
            return;
        }

        const { name, description, price, isAvailable, categoryId } = result.data;

        if (!name || price === undefined || !Number.isInteger(categoryId)) {
            res.status(400).json({ message: "Name, price, and categoryId are required" });
            return; 
        }

        const validate = await prisma.menuCategory.findUnique({ where: { id: categoryId } });
        if (!validate) {
            res.status(400).json({ message: "Category does not exist" });
            return;
        }

        const item = await prisma.menuItem.create({
            data: {
                name,
                description: description ?? null,
                price,
                ...(isAvailable !== undefined && { isAvailable }),
                categoryId,
            },
            include: {
                category: true,
            }
        });

        res.status(201).json(item);

    } catch (error) {
        handleUserError(error, res);
    }
}

export async function updateItem(req: Request, res: Response): Promise<void> {
    const updateItemSchema = itemSchema.partial();
    try {
        const result = updateItemSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ message: result.error.issues[0]?.message });
            return;
        }

        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            res.status(400).json({  message: "Invalid user ID" });
            return;
        }

        const { name, description, price, isAvailable, categoryId} = result.data;

        const data: Prisma.MenuItemUpdateInput = {
            ...(name !== undefined && { name }),
            ...(description !== undefined && { description }),
            ...(price !== undefined && { price }),
            ...(isAvailable !== undefined && { isAvailable }),
            ...(categoryId !== undefined && { categoryId }),
        }

        const updatedItem = prisma.menuItem.update({
            where: { id },
            data,
            include: {category: true}
        })

        res.status(200).json(updateItem);
    } catch (error) {
        handleUserError(error, res);
    }
}

// ============== MENU CATEGORIES ==============

export async function createCategory(req: Request, res: Response): Promise<void> {
    try {
        const { name, slug } = req.body;

        if (!name || !slug) {
            res.status(400).json({ message: "Name and slug are required" })
            return;
        }

        const category = prisma.menuCategory.create({
            data: {
                name,
                slug,
            }
        });

        res.status(201).json(category);


    } catch (error) {
        handleUserError(error, res);
    }
    
}

