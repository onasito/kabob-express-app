import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import { z } from "zod"

const itemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.coerce.number().positive(),
  isAvailable: z.boolean().optional(),
  categoryId: z.number().int(),
});

const categorySchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
})

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

// ============== ITEM CONTROLLERS ==============

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
    try {
        const result = itemSchema.partial().safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ message: result.error.issues[0]?.message });
            return;
        }

        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            res.status(400).json({  message: "Invalid item ID" });
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

        const updatedItem = await prisma.menuItem.update({
            where: { id },
            data,
            include: { category: true }
        })

        res.status(200).json(updatedItem);
    } catch (error) {
        handleUserError(error, res);
    }
}

export async function deleteItem(req:Request, res: Response): Promise<void> {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            res.status(400).json({  message: "Invalid item ID" });
            return;
        }

        const valid = await prisma.menuItem.findUnique({ where: { id } });
        if (!valid) {
            res.status(400).json({ message: "Item does not exist" });
            return;
        }

        await prisma.menuItem.delete({ where: { id } });
        res.status(204).send;

    } catch (error) {
        handleUserError(error, res);
    }
};

export async function getItems(_req: Request, res: Response): Promise<void> {
    try {
        const items = await prisma.menuItem.findMany({
            orderBy: { id: "asc" },
            include: { category: true }
        });

        if (!items) {
            res.status(400).json({ messsage: "No items in database" });
            return;
        };

        res.json(items);
    } catch (error) {
        handleUserError(error, res);
    }
}

export async function getItemById(req: Request, res: Response): Promise<void> {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            res.status(400).json({  message: "Invalid item ID" });
            return;
        };

        const item = await prisma.menuItem.findUnique({ where: { id }});
        if (!item) {
            res.status(400).json({ message: "Item does not exist" })
            return;
        };

        res.json(item);

    } catch (error) {
        handleUserError(error, res);
    }
}

// ============== MENU CATEGORIES CONTROLLERS ==============

export async function createCategory(req: Request, res: Response): Promise<void> {
    try {
        const result = categorySchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ message: result.error.issues[0]?.message });
            return;
        }

        const { name, slug } = result.data;

        const category = await prisma.menuCategory.create({
            data: {
                name,
                slug,
            },
            include: {items: true},
        });

        res.status(201).json(category);

    } catch (error) {
        handleUserError(error, res);
    }
};

export async function updateCategory(req: Request, res: Response): Promise<void> {
    try {
        const result = categorySchema.partial().safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ message: result.error.issues[0]?.message });
            return;
        }

        const { name, slug } = result.data;

        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            res.status(400).json({  message: "Invalid category ID" });
            return;
        };

        const exists = await prisma.menuCategory.findUnique({ where: { id } });
        if (!exists) {
            res.status(400).json({ message: "Category does not exist" });
            return;
        }
        
        const data: Prisma.MenuCategoryUpdateInput = {
            ...(name !== undefined && { name }),
            ...(slug !== undefined && { slug })
        };

        const updatedCat = await prisma.menuCategory.update({
            where: { id },
            data,
        });

        res.status(200).json(updatedCat);

    } catch (error) {
        handleUserError(error, res);
    }
}

export async function deleteCategory(req: Request, res: Response): Promise<void> {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            res.status(400).json({  message: "Invalid category ID" });
            return;
        }

        const category = await prisma.menuCategory.findUnique({
            where: { id },
            include: { _count: { select: { items: true } } },
        });
        if (!category) {
            res.status(400).json({ message: "Category does not exist" });
            return;
        }

        if (category._count.items > 0) {
            res.status(400).json({ message: "Cannot delete a category that still has menu items assigned to it" });
            return;
        }

        await prisma.menuCategory.delete({ where: { id } });
        res.status(204).send();

    } catch (error) {
        handleUserError(error, res);
    }
}

export async function getCategories(_req: Request, res: Response): Promise<void> {
    try {
        const categories = await prisma.menuCategory.findMany({ orderBy: { id: "asc" } })
        if (!categories) {
            res.status(400).json({ message: "No categories exist in database" })
            return;
        }

        res.json(categories)
    } catch (error) {
        handleUserError(error, res);
    }
}

export async function getCategoryById(req: Request, res: Response): Promise<void> {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            res.status(400).json({  message: "Invalid category ID" });
            return;
        }

        const category = await prisma.menuCategory.findUnique({ where: { id } });
        if (!category) {
            res.status(400).json({ message: "Category does not exist" });
            return;
        }

        res.json(category);


    } catch (error) {
        handleUserError(error, res);
    }
}