import { verifyToken } from "../utils/jwt.js";
import type { NextFunction } from "express";
import type { Request, Response } from "express";

export function authenticate(req: Request, res: Response, next: NextFunction): void {
    try {
        const authHeader = req.headers.authorization;
    
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                error: "Authentication required. Please provide a valid token.",
            });
            return;
        }

        const token = authHeader?.substring(7);

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

// Must run after `authenticate` so req.user is populated.
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
    if (req.user?.role !== "ADMIN") {
        res.status(403).json({ error: "Admin access required." });
        return;
    }
    next();
}

