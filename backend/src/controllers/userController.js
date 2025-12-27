import bcrypt from 'bcrypt';
import prisma from '../config/prismaClient.js';

const userSafeSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

// GET /api/users
export async function getUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: userSafeSelect,
      // Order by ID ascending
      orderBy: { id: 'asc' },
    });
    res.json(users);
  } catch (error) {
    // Handle error
    next(error);
  }
}

export async function getUserById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: userSafeSelect,
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function createUser(req, res, next) {
    try {
        const { name, email, password, role } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        // basic email format check
        if (!String(email).includes("@")) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(409).json({ message: "Email already in use" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name, 
                email,
                passwordHash,
                role: role ?? undefined, // uses default CUSTOMER if not provided
            },
            select : userSafeSelect,
        });
        res.status(201).json(newUser);
    }
    catch (err) {
        next(err);
    }
}

export async function updateUser(req, res, next) {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            return res.status(400).json({ message: "Invalid user id" });
        }

        const { name, email, password, role } = req.body;

        // Build update object only with provided fields
        const data = {};

        if (name !== undefined) data.name = name;
        if (email !== undefined) {
            // basic email format check
            if (!String(email).includes("@")) {
                return res.status(400).json({ message: "Invalid email format" });
            }

            // if changing email ensure it's not taken
            const existing = await prisma.user.findUnique({ where: { email } });
            if (existing && existing.id !== id) {
                return res.status(409).json({ message: "Email already in use" });
            }
            data.email = email;
        }

        if (role !== undefined) data.role = role;

        if (password !== undefined) {
            if (password.length < 6) {
                return res.status(400).json({ message: "Password must be at least 6 characters" });
            }
            data.password = await bcrypt.hash(password, 10);
        }
        const updatedUser = await prisma.user.update({
            where: { id },
            data,
            select: userSafeSelect,
        })

        res.json(updatedUser);

    } catch (err) {
        if (err?.code === 'P2025') {
            return res.status(404).json({ message: "User not found" });
        }
        next(err);
    }
}

export async function deleteUser(req, res, next) {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            return res.status(400).json({ message: "Invalid user id" });
        }

        await prisma.user.delete({ where: { id } });
        res.status(204).send();

    } catch (err) {
        if (err?.code === 'P2025') {
            return res.status(404).json({ message: "User not found" });
        }
        next(err);
    }
}