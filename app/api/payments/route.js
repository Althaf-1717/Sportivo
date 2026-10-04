import { NextResponse } from "next/server";
import { getApiUser, jsonError } from "@/lib/api-utils";
import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";

export async function GET(request) {
  const user = await getApiUser();
  if (!user) return jsonError("Sign in to view payments.", 401);
  await connectDB();
  const status = new URL(request.url).searchParams.get("status");
  const query = user.role === "admin" ? (status ? { status } : {}) : { student: user.id, ...(status ? { status } : {}) };
  const payments = await Payment.find(query).sort({ createdAt: -1 }).limit(300).populate("student", "name email").populate("membershipPlan", "name").lean();
  return NextResponse.json({ payments: JSON.parse(JSON.stringify(payments)) });
}
