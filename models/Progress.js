import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  enrollment: { type: mongoose.Schema.Types.ObjectId, ref: "Enrollment", required: true, index: true },
  coach: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sport: { type: mongoose.Schema.Types.ObjectId, ref: "Sport", required: true },
  skillLevel: { type: String, enum: ["Beginner", "Intermediate", "Advanced", "Professional"], default: "Beginner" },
  fitnessScore: { type: Number, min: 0, max: 100, default: 0 },
  technicalScore: { type: Number, min: 0, max: 100, default: 0 },
  performanceScore: { type: Number, min: 0, max: 100, default: 0 },
  overallProgress: { type: Number, min: 0, max: 100, default: 0 },
  remarks: { type: String, default: "", maxlength: 1000 },
  trainingNotes: { type: String, default: "", maxlength: 2000 },
}, { timestamps: true });

ProgressSchema.index({ student: 1, createdAt: -1 });
export default mongoose.models.Progress || mongoose.model("Progress", ProgressSchema);
