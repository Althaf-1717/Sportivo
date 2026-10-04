import mongoose from "mongoose";

const SportSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, default: "" },
  detail: { type: String, default: "" },
  image: { type: String, default: "" },
  icon: { type: String, default: "" },
  focus: [{ type: String }],
  isActive: { type: Boolean, default: true, index: true },
}, { timestamps: true });

export default mongoose.models.Sport || mongoose.model("Sport", SportSchema);
