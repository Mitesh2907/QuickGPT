import jwt from "jsonwebtoken";

export const adminProtect = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ success: false, message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(401).json({ success: false, message: "Access denied" });
    }

    next();

  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
