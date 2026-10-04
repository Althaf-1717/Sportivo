import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, select: false },
  role: { type: String, enum: ["student", "coach", "admin"], default: "student", index: true },
  studentId: { type: Number, unique: true, sparse: true, index: true },
  image: { type: String, default: "" },
  phone: { type: String, default: "" },
  dateOfBirth: { type: Date, default: null },
  gender: { type: String, enum: ["", "female", "male", "non-binary", "prefer-not-to-say"], default: "" },
  address: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
