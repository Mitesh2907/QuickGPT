import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import jwt from "jsonwebtoken";


// POST /api/admin/login
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("Login Request:", username, password);
    console.log("ENV:", process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);

    // Compare with env
    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { role: "admin" },
      process.env.JWT_SECRET,
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
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/transactions
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    return res.json({ success: true, transactions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/admin/verify-payment
export const adminVerifyPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ success: false, message: "orderId required" });

    const trx = await Transaction.findOne({ orderId });
    if (!trx) return res.status(404).json({ success: false, message: "Transaction not found" });

    if (trx.isPaid) return res.json({ success: true, message: "Already verified" });

    // mark paid and add credits
    trx.isPaid = true;
    trx.status = "success";
    await trx.save();

    await User.updateOne({ _id: trx.userId }, { $inc: { credits: trx.credits } });

    return res.json({ success: true, message: "Payment verified and credits added", credits: trx.credits });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
