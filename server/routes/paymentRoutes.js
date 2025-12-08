import express from "express";
import { purchasePlan, verifyPayment, getPlans, checkTransactionStatus, forceVerifyPayment } from "../controllers/paymentController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/plans", getPlans);
router.post("/purchase", protect, purchasePlan);
router.post("/verify", protect, verifyPayment);
router.get("/status", protect, checkTransactionStatus);
router.post("/force-verify", forceVerifyPayment);

export default router;
