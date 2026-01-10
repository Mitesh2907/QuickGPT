import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ======================
// USER PROTECTION (OK)
// ======================
export const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];

    try {
        // Use default secret if env var not set
        const secret = process.env.JWT_SECRET || 'default-jwt-secret-for-development';
        const decoded = jwt.verify(token, secret);

        // Create user object from JWT token data
        req.user = {
          _id: decoded.id,
          name: decoded.name,
          email: decoded.email
        };
        next();

    } catch (error) {
        console.error("JWT verification failed:", error.message);
        return res.status(401).json({ success: false, message: "Not authorized, invalid token" });
    }
};



// ======================
// ADMIN ONLY PROTECTION
// ======================
export const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ 
            success: false, 
            message: "Access denied, admin only" 
        });
    }
    next();
};
