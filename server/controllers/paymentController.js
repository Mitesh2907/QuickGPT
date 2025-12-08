import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import { v4 as uuid } from "uuid";

// ---------------------------------------
// AVAILABLE PLANS
// ---------------------------------------
const plans = [
  { _id: "basic", price: 1, credits: 100 },
  { _id: "pro", price: 20, credits: 500 },
  { _id: "premium", price: 30, credits: 1000 }
];

// =======================================
// 1️⃣ PURCHASE PLAN (CREATE ORDER)
// =======================================
export const purchasePlan = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user._id;

    const plan = plans.find((p) => p._id === planId);
    if (!plan) {
      return res.json({ success: false, message: "Invalid plan selected" });
    }

    const orderId = uuid();

    const upiLink =
      `upi://pay?pa=${process.env.UPI_ID}` +
      `&pn=Mitesh` +
      `&am=${plan.price}` +
      `&cu=INR` +
      `&tn=QuickGPT-${orderId}`;

    // Save transaction
    await Transaction.create({
      userId,
      planId: plan._id,
      amount: plan.price,
      credits: plan.credits,
      orderId,
      status: "pending",
      isPaid: false,
    });

    return res.json({
      success: true,
      message: "Order created successfully",
      orderId,
      upiLink,
      amount: plan.price,
      credits: plan.credits,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// =======================================
// 2️⃣ GET PLANS API
// =======================================
export const getPlans = async (req, res) => {
  try {
    return res.json({ success: true, plans });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// =======================================
// 3️⃣ VERIFY PAYMENT (Manual or Auto)
// =======================================
export const verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const trx = await Transaction.findOne({ orderId });
    if (!trx) {
      return res.json({ success: false, message: "Transaction not found" });
    }

    if (trx.isPaid) {
      return res.json({ success: true, message: "Already verified" });
    }

    // Update transaction
    trx.isPaid = true;
    trx.status = "success";
    await trx.save();

    // Add credits to user
    await User.updateOne(
      { _id: trx.userId },
      { $inc: { credits: trx.credits } }
    );

    return res.json({
      success: true,
      message: "Payment verified. Credits added!",
      creditsAdded: trx.credits,
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// =======================================
// 4️⃣ CHECK PAYMENT STATUS (For Polling)
// =======================================
export const checkTransactionStatus = async (req, res) => {
  try {
    const { orderId } = req.query;

    const trx = await Transaction.findOne({ orderId });

    if (!trx) {
      return res.json({ success: false, status: "not_found" });
    }

    // Only return what is actually saved
    return res.json({
      success: true,
      status: trx.isPaid ? "success" : "pending",
      isPaid: trx.isPaid,
      credits: trx.credits
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


export const forceVerifyPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const trx = await Transaction.findOne({ orderId });
    if (!trx) {
      return res.json({ success: false, message: "Order not found" });
    }

    if (trx.isPaid) {
      return res.json({ success: true, message: "Already paid" });
    }

    // Mark transaction as successful
    trx.isPaid = true;
    trx.status = "success";
    await trx.save();

    // Add credits to user
    await User.updateOne(
      { _id: trx.userId },
      { $inc: { credits: trx.credits } }
    );

    return res.json({
      success: true,
      message: "Credits added successfully!"
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
