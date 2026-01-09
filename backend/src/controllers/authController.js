// src/controllers/authController.js
import bcrypt from "bcryptjs";
import prisma from "../config/prismaClient.js";
import { signToken } from "../utils/jwt.js";

const userSafeSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

// POST /api/auth/register
export async function register(req, res, next) {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        if (!String(email).includes("@")) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        if (String(password).length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "Email is already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role ?? undefined, // defaults to CUSTOMER
            },
            select: userSafeSelect,
        })

        const token = signToken({ userId: user.id, role: user.role });

        res.status(201).json({ user, token });

    } catch (error) {
        next(error);
    }
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const userWithPassword = await prisma.user.findUnique({
            where: { email },
            // give me all the safe fields plus the password
            select: { ...userSafeSelect, password: true },
        })

        if (!userWithPassword) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        
        const valid = await bcrypt.compare(password, userWithPassword.password);
        if (!valid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const { password: _pw, ...safeUser } = userWithPassword;
        const token = signToken({ userId: safeUser.id, role: safeUser.role });

        res.json({ user: safeUser, token });
    } catch (error) {
        next(error);
    }
}

export async function me(req, res) {
    res.json({ user: req.user})
}