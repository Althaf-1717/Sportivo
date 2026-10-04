import mongoose from "mongoose";

const MembershipPlanSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, lowercase: true, trim: true },
  sport: { type: mongoose.Schema.Types.ObjectId, ref: "Sport", required: true, index: true },
  duration: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 1 },
  description: { type: String, default: "" },
  features: [{ type: String }],
  isActive: { type: Boolean, default: true, index: true },
}, { timestamps: true });

export default mongoose.models.MembershipPlan || mongoose.model("MembershipPlan", MembershipPlanSchema);
