import { NextResponse } from "next/server";
import { getApiUser, jsonError } from "@/lib/api-utils";
import { connectDB } from "@/lib/mongodb";
import { Enrollment } from "@/models";

export async function GET() {
  const user = await getApiUser();
  if (!user) return jsonError("Sign in to view enrolments.", 401);
  await connectDB();
  const query = user.role === "admin" ? {} : user.role === "coach" ? { coach: user.id } : { student: user.id };
  const enrollments = await Enrollment.find(query).sort({ createdAt: -1 }).limit(250).populate("student", "name email image").populate("sport", "name slug").populate("coach", "name email image").populate("membershipPlan", "name duration price").populate("payment", "status amount razorpayPaymentId").lean();
  return NextResponse.json({ enrollments: JSON.parse(JSON.stringify(enrollments)) });
}

export async function POST() {
  const user = await getApiUser();
  if (!user) return jsonError("Sign in to continue.", 401);
  return NextResponse.json({ error: "Enrolments are created only after Razorpay payment verification." }, { status: 405 });
}
