import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    planId: { type: String, required: true },
    amount: { type: Number, required: true },
    credits: { type: Number, required: true },
    orderId: { type: String },
    transactionId: { type: String },
    status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
    isPaid: { type: Boolean, default: false },
    gatewayResponse: { type: Object },
}, { timestamps: true });


export default mongoose.model("Transaction", transactionSchema);
