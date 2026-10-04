import mongoose from "mongoose";

const ContactInquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  topic: { type: String, required: true, enum: ["coaching", "membership", "first-session", "other"] },
  message: { type: String, required: true, trim: true, maxlength: 3000 },
  status: { type: String, enum: ["new", "reviewed", "closed"], default: "new", index: true },
}, { timestamps: true });

export default mongoose.models.ContactInquiry || mongoose.model("ContactInquiry", ContactInquirySchema);
