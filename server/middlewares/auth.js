import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ======================
// USER PROTECTION (OK)
// ======================
export const protect = (req, res, next) => {
    try {
        console.log(`🔒 Protect middleware called for ${req.method} ${req.url}`);

        const authHeader = req.headers.authorization;
        console.log("Auth header present:", !!authHeader);

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log("❌ No token or wrong format");
            return res.status(401).json({ success: false, message: "Not authorized, no token" });
        }

        const token = authHeader.split(" ")[1];
        console.log("Token extracted, length:", token ? token.length : 0);

        // Use default secret if env var not set
        const secret = process.env.JWT_SECRET || 'default-jwt-secret-for-development';
        const decoded = jwt.verify(token, secret);
        console.log("JWT decoded successfully for user:", decoded.id);

        // Create user object from JWT token data
        req.user = {
          _id: decoded.id,
          name: decoded.name,
          email: decoded.email
        };

        console.log("✅ User authenticated, calling next()");
        next();

    } catch (error) {
        console.error("❌ JWT verification failed:", error.message);
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
