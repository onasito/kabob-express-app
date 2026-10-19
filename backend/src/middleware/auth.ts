import { verifyToken } from "../utils/jwt.js";
import type { NextFunction } from "express";
import type { Request, Response } from "express";
import type { UserRole } from "../generated/prisma/enums.js";

export function authenticate(req: Request, res: Response, next: NextFunction): void {
    try {
        const authHeader = req.headers.authorization;
    
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                error: "Authentication required. Please provide a valid token.",
            });
            return;
        }

        const token = authHeader.substring(7);

        const decoded = verifyToken(token);

        req.user = decoded;

        next();
    } catch (error) {
        if (error instanceof Error && error.name === "JsonWebTokenError") {
            res.status(401).json({ error: "Invalid token." });
            return;
        }
        if (error instanceof Error && error.name === "TokenExpiredError") {
            res.status(401).json({ error: "Token has expired." });
            return;
        }
        res.status(500).json({ error: "Authentication failed." });
        return;
    }
}

// Returns a middleware that only lets through users whose role is in `roles`.
// Must run after `authenticate` so req.user is populated.
export function requireRole(...roles: UserRole[]) {
    return function (req: Request, res: Response, next: NextFunction): void {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ error: "You do not have permission to access this resource." });
            return;
        }
        next();
    };
}

export function attachUserIfPresent(req: Request, res: Response, next: NextFunction): void {
    try {
        const authHeader = req.headers.authorization;

        // If there is no header then continue as guest
        if (!authHeader) {
            next();
            return;
        }

        const token = authHeader.substring(7);
        const decoded = verifyToken(token);

        req.user = decoded;

        next();

    } catch (error) {
        if (error instanceof Error && error.name === "JsonWebTokenError") {
            res.status(401).json({ error: "Invalid token." });
            return;
        }
        if (error instanceof Error && error.name === "TokenExpiredError") {
            res.status(401).json({ error: "Token has expired." });
            return;
        }
        res.status(500).json({ error: "Authentication failed." });
        return;
    }
}

