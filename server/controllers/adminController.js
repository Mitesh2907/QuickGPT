import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import jwt from "jsonwebtoken";


// POST /api/admin/login
export const adminLogin = async (req, res) => {
  console.log("🔐 ADMIN LOGIN FUNCTION CALLED");
  try {
    console.log("Admin login request received, body:", req.body);
    const { username, password } = req.body;

    console.log("Extracted credentials:", { username, password });

    // Compare with env or default values
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    console.log("Expected credentials:", { adminUsername, adminPassword });
    console.log("Credentials match:", username === adminUsername && password === adminPassword);

    if (
      username !== adminUsername ||
      password !== adminPassword
    ) {
      console.log("Invalid credentials provided");
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    console.log("Admin credentials validated successfully");

    const jwtSecret = process.env.JWT_SECRET || 'default-jwt-secret-for-development';

    const token = jwt.sign(
      { role: "admin" },
      jwtSecret,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    // Get real users from database
    const users = await User.find()
      .select('-password') // Exclude password field
      .sort({ createdAt: -1 }); // Most recent first

    console.log(`Found ${users.length} real users in database`);

    return res.json({ success: true, users });
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


// POST /api/admin/verify-payment
export const adminVerifyPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ success: false, message: "orderId required" });

    // Mock verification
    console.log("Verifying payment for orderId:", orderId);
    return res.json({
      success: true,
      message: "Payment verified and credits added",
      credits: 50
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
