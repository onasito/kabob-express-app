import jwt, { type JwtPayload } from "jsonwebtoken";
import type { StringValue } from "ms"
import 'dotenv/config';

export interface TokenPayload {
    userId: number
    role: string
}

export function signToken(payload: TokenPayload): string {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN as StringValue || "7d";
    
    if (!secret) throw new Error("JWT_SECRET is missing in .env");

    return jwt.sign(payload, secret, { expiresIn })
}

export function verifyToken(token: string): TokenPayload {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is missing in .env");

    const decoded = jwt.verify(token, secret);

    if (typeof decoded === "string") {
        throw new Error("Invalid token payload")
    }

    return decoded as TokenPayload;
}