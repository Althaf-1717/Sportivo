import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  enrollment: { type: mongoose.Schema.Types.ObjectId, ref: "Enrollment", required: true },
  coach: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sport: { type: mongoose.Schema.Types.ObjectId, ref: "Sport", required: true },
  date: { type: Date, required: true },
  time: { type: String, default: "" },
  work: { type: String, default: "" },
  status: { type: String, enum: ["present", "absent"], required: true },
  remarks: { type: String, default: "", maxlength: 500 },
}, { timestamps: true });

AttendanceSchema.index({ student: 1, enrollment: 1, date: 1 }, { unique: true });
export default mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);
