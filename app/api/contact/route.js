import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import ContactInquiry from "@/models/ContactInquiry";

const inquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  topic: z.enum(["coaching", "membership", "first-session", "other"]).default("other"),
  message: z.string().trim().min(10).max(3000),
  website: z.string().max(200).optional().default(""),
});

export async function POST(request) {
  let data;
  try { data = inquirySchema.parse(await request.json()); }
  catch (error) { return NextResponse.json({ error: error.issues?.[0]?.message || "Please check your message." }, { status: 400 }); }
  if (data.website) return NextResponse.json({ message: "Your note has been sent to the academy team." }, { status: 201 });
  delete data.website;
  try {
    await connectDB();
    await ContactInquiry.create(data);
    return NextResponse.json({ message: "Your note has been sent to the academy team." }, { status: 201 });
  } catch (error) {
    const message = error.message.includes("MongoDB is not configured") ? "Contact messages need MongoDB. Please contact the academy directly while the site is being configured." : "We couldn’t send your note just now. Please try again.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
