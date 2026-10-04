import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  enrollment: { type: mongoose.Schema.Types.ObjectId, ref: "Enrollment", default: null },
  membershipPlan: { type: mongoose.Schema.Types.ObjectId, ref: "MembershipPlan", required: true },
  sport: { type: mongoose.Schema.Types.ObjectId, ref: "Sport", required: true },
  coach: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  razorpayOrderId: { type: String, required: true, unique: true, index: true },
  razorpayPaymentId: { type: String, default: "", index: true },
  razorpaySignature: { type: String, default: "" },
  amount: { type: Number, required: true, min: 1 },
  currency: { type: String, default: "INR" },
  status: { type: String, enum: ["pending", "successful", "failed", "refunded"], default: "pending", index: true },
}, { timestamps: true });

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
