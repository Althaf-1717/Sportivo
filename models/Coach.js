import mongoose from "mongoose";

const CoachSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  slug: { type: String, lowercase: true, trim: true, index: true },
  bio: { type: String, default: "" },
  experience: { type: Number, default: 0, min: 0 },
  specialization: { type: String, default: "" },
  certifications: [{ type: String }],
  sports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sport" }],
  isActive: { type: Boolean, default: true, index: true },
}, { timestamps: true });

export default mongoose.models.Coach || mongoose.model("Coach", CoachSchema);
