import type { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcrypt"
import { prisma } from "../lib/prisma.js";
import { Prisma } from "../generated/prisma/client.js";

const userSafeSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export default function handleUserError(error: unknown, res: Response): void {
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

export async function createUser(req: Request, res: Response): Promise<void> {
    const userSchema = z.object({
        name: z.string(),
        email: z.email("Invalid email address"),
        password: z.string().min(8),
        role: z.enum(["CUSTOMER", "ADMIN", "STAFF"]).optional()
    });

    try {
        // pass req body through zod to make sure name, email, password, and role are valid
        const result = userSchema.safeParse(req.body);
        if(!result.success) {
            res.status(400).json({ message: result.error.issues[0]?.message });
            return;
        };

        const {name, email, password, role} = result.data

        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists) {
            res.status(400).json({ message: "Email already in use" });
            return;
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                // key omitted entirely (not just undefined) so Prisma's default CUSTOMER applies
                ...(role !== undefined && { role }),
            },
            select: userSafeSelect,
        });
        res.status(201).json(newUser);

    } catch (error) {
        handleUserError(error, res);
    }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            res.status(400).json({ message: "Invalid user ID" })
            return;
        }

        await prisma.user.delete({ where: { id } });
        res.status(204).send;

    } catch (error) {
        handleUserError(error, res);
    }
}

export async function getUsers(req: Request, res: Response): Promise<void> {
    try {
        const users = await prisma.user.findMany({
            select: userSafeSelect,
            orderBy: { id: 'asc' },
        });
        if (!users) {
            res.status(400).json({ messsage: "No users in database" });
            return;
        }
        res.json(users);
    } catch (error) {
        handleUserError(error, res);
    }
}

export async function getUserById(req: Request, res: Response): Promise<void> {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            res.status(400).json({ message: "Invalid user ID" });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id },
            select: userSafeSelect
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json(user);
    } catch (error) {
        handleUserError(error, res);
    }
}

export async function updateUser(req: Request, res: Response): Promise<void> {
        const updateUserSchema = z.object({
            name: z.string().optional(),
            email: z.email("Invalid email address").optional(),
            password: z.string().min(8).optional()
        });

    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            res.status(400).json({  message: "Invalid user ID" });
            return;
        }

        const result = updateUserSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({  message: result.error.issues[0]?.message })
            return;
        }

        const existing = await prisma.user.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const { name, email, password } = result.data;

        if (email && email !== existing.email) {
            const emailTaken = await prisma.user.findUnique({ where: { email } });
            if (emailTaken) {
                res.status(409).json({ message: "Email already in use" });
                return;
            }
        }

        const data: Prisma.UserUpdateInput = {
            // name key is only given value if it is undefined otherwise data object never gets name (not even name = undefined)
            ...(name !== undefined && { name }),
            ...(email !== undefined && { email }),
            ...(password !== undefined && { password: await bcrypt.hash(password, 10) }),
        };

        const updatedUser = await prisma.user.update({
            where: { id },
            data,
            select: userSafeSelect,
        });

        res.json(updatedUser);

    } catch (error) {
        handleUserError(error, res);
    }
}