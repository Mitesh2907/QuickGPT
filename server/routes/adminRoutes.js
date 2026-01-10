import express from "express";
import { adminLogin, getAllUsers, adminVerifyPayment } from "../controllers/adminController.js";
import { adminProtect } from "../middlewares/adminAuth.js";

const router = express.Router();

console.log("🚀 Setting up admin routes...");

// Catch-all middleware for debugging
router.use((req, res, next) => {
  console.log(`📡 Admin route: ${req.method} ${req.path}`);
  next();
});

// Test endpoints
router.get("/test", (req, res) => {
  console.log("✅ Admin test route hit");
  res.json({ success: true, message: "Admin routes working" });
});

router.post("/test-post", (req, res) => {
  console.log("📨 POST test received, body:", req.body);
  res.json({ success: true, message: "POST request working", body: req.body });
});

// Admin routes
router.post("/login", adminLogin);
router.get("/users", adminProtect, getAllUsers);
router.post("/verify-payment", adminProtect, adminVerifyPayment);

export default router;
