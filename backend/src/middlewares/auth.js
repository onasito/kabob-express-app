// src/middlewares/auth.js
import { verifyToken } from "../utils/jwt.js";

export function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authentication required. Please provide a valid token.",
      });
    }

    const token = authHeader.substring(7);

    const decoded = verifyToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token." });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired." });
    }
    return res.status(500).json({ error: "Authentication failed." });
  }
}
