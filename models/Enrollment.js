import mongoose from "mongoose";

const EnrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  sport: { type: mongoose.Schema.Types.ObjectId, ref: "Sport", required: true },
  coach: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  membershipPlan: { type: mongoose.Schema.Types.ObjectId, ref: "MembershipPlan", required: true },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment", required: true, unique: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ["active", "expired", "cancelled"], default: "active", index: true },
  paymentStatus: { type: String, enum: ["pending", "successful", "failed", "refunded"], default: "successful" },
}, { timestamps: true });

EnrollmentSchema.index({ student: 1, status: 1 });
export default mongoose.models.Enrollment || mongoose.model("Enrollment", EnrollmentSchema);
