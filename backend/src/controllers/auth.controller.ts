import type { Request, Response } from "express";
import bcrypt from "bcrypt"
import { prisma } from "../lib/prisma.js";
import { Prisma } from "../generated/prisma/client.js"
import { signToken } from "../utils/jwt.js";
import { z } from "zod";

const userSafeSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

// Used to keep bcrypt.compareSync's cost constant when no user is found,
// so response timing doesn't reveal whether an email is registered.
const DUMMY_PASSWORD_HASH = bcrypt.hashSync("dummy-password", 10);

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

export async function login(req: Request, res: Response): Promise<void> {
    try {
        const {email, password} = req.body
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }

        

        const userWithPassword = await prisma.user.findUnique({
            where: {email},
            select: {...userSafeSelect, password: true}
        });
        
        const valid = bcrypt.compareSync(password, userWithPassword?.password ?? DUMMY_PASSWORD_HASH);
        if (!userWithPassword || !valid) {
            res.status(400).json({ message: "Invalid email or password" });
            return;
        }


        const token = signToken({ userId: userWithPassword.id, role: userWithPassword.role })

        res.status(200).json({ token })
        
    } catch (error) {
        handleUserError(error, res);
    }
}

export async function register(req: Request, res: Response): Promise<void> {
    const userSchema = z.object({
            name: z.string(),
            email: z.email("Invalid email address"),
            password: z.string().min(8),
        });

    try {
        // pass req body through zod to make sure name, email, and password are valid
        const result = userSchema.safeParse(req.body);
        if(!result.success) {
            res.status(400).json({ message: result.error.issues[0]?.message });
            return;
        };

        const {name, email, password} = result.data;

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
            },
            select: userSafeSelect,
        });
        res.status(201).json(newUser);


    } catch (error) {
        handleUserError(error, res);
    }
}