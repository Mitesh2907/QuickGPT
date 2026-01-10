import jwt from "jsonwebtoken";

export const adminProtect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("Admin auth - received header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Admin auth - no token or wrong format");
      return res.status(401).json({ success: false, message: "No token" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Admin auth - extracted token:", token ? "present" : "missing");

    const jwtSecret = process.env.JWT_SECRET || 'default-jwt-secret-for-development';
    const decoded = jwt.verify(token, jwtSecret);
    console.log("Admin auth - decoded token:", decoded);

    if (decoded.role !== "admin") {
      console.log("Admin auth - role check failed:", decoded.role);
      return res.status(401).json({ success: false, message: "Access denied" });
    }

    console.log("Admin auth - success!");
    next();

  } catch (error) {
    console.error("Admin auth error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
