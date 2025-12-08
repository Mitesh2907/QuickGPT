import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ======================
// USER PROTECTION (OK)
// ======================
export const protect = async (req, res, next) => {
    let token = req.headers.authorization;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "Not authorized, user not found" });
        }

        req.user = user;  // attaching user object
        next();

    } catch (error) {
        res.status(401).json({ message: "Not authorized, token failed" });
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
