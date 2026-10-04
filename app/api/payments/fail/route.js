import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiUser, jsonError, requireApiRole } from "@/lib/api-utils";
import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";

const failureSchema = z.object({ orderId: z.string().min(5).max(100) });

export async function POST(request) {
  const user = await getApiUser();
  const denied = requireApiRole(user, ["student"]);
  if (denied) return denied;

  let input;
  try { input = failureSchema.parse(await request.json()); }
  catch (error) { return jsonError(error.issues?.[0]?.message || "Payment order is invalid."); }

  await connectDB();
  const payment = await Payment.findOne({ student: user.id, razorpayOrderId: input.orderId });
  if (!payment) return jsonError("Payment order not found for this student.", 404);
  if (payment.status === "successful") return jsonError("This payment has already been verified.", 409);
  if (payment.status === "pending") {
    payment.status = "failed";
    await payment.save();
  }
  return NextResponse.json({ updated: true, status: payment.status });
}
