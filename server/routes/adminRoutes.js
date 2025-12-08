import express from "express";
import { adminLogin, getAllUsers, getAllTransactions, adminVerifyPayment } from "../controllers/adminController.js";
import { adminProtect } from "../middlewares/adminAuth.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/users", adminProtect, getAllUsers);
router.get("/transactions", adminProtect, getAllTransactions);
router.post("/verify-payment", adminProtect, adminVerifyPayment);


export default router;
