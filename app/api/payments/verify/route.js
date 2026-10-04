import crypto from "node:crypto";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getApiUser, jsonError, requireApiRole } from "@/lib/api-utils";
import { connectDB } from "@/lib/mongodb";
import { Enrollment, MembershipPlan, Notification, Payment } from "@/models";

const verifySchema = z.object({ razorpay_order_id: z.string().min(5).max(100), razorpay_payment_id: z.string().min(5).max(100), razorpay_signature: z.string().min(20).max(300) });

export async function POST(request) {
  const user = await getApiUser();
  const denied = requireApiRole(user, ["student"]);
  if (denied) return denied;
  if (!process.env.RAZORPAY_KEY_SECRET) return jsonError("Razorpay verification is not configured on the server.", 503);
  let input;
  try { input = verifySchema.parse(await request.json()); }
  catch (error) { return jsonError(error.issues?.[0]?.message || "Payment verification data is incomplete."); }

  const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(`${input.razorpay_order_id}|${input.razorpay_payment_id}`).digest("hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(input.razorpay_signature, "hex");
  if (expectedBuffer.length !== receivedBuffer.length || !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) return jsonError("Payment verification failed. No membership was activated.", 400);

  let session;
  try {
    await connectDB();
    const existing = await Payment.findOne({ razorpayOrderId: input.razorpay_order_id, student: user.id });
    if (!existing) return jsonError("Payment order not found for this student.", 404);
    if (existing.status === "successful" && existing.enrollment) return NextResponse.json({ verified: true, enrollmentId: String(existing.enrollment), message: "This payment was already verified." });

    session = await mongoose.startSession();
    let enrollmentId;
    await session.withTransaction(async () => {
      const payment = await Payment.findOne({ razorpayOrderId: input.razorpay_order_id, student: user.id }).session(session);
      if (!payment) throw new Error("Payment order not found.");
      if (payment.status === "successful" && payment.enrollment) { enrollmentId = String(payment.enrollment); return; }
      const plan = await MembershipPlan.findById(payment.membershipPlan).session(session);
      if (!plan || !plan.isActive) throw new Error("Membership is no longer available.");
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + plan.duration);
      const [enrollment] = await Enrollment.create([{ student: payment.student, sport: payment.sport, coach: payment.coach, membershipPlan: payment.membershipPlan, payment: payment._id, startDate, endDate, status: "active", paymentStatus: "successful" }], { session });
      payment.status = "successful";
      payment.razorpayPaymentId = input.razorpay_payment_id;
      payment.razorpaySignature = input.razorpay_signature;
      payment.enrollment = enrollment._id;
      await payment.save({ session });
      await Notification.create([{ user: payment.student, title: "Welcome to Sportivo", message: `Your ${plan.name} membership is active. See you at training.`, type: "enrollment" }, { user: payment.student, title: "Payment successful", message: `Your ${plan.name} membership payment was verified.`, type: "payment" }], { session });
      enrollmentId = String(enrollment._id);
    });
    revalidatePath("/dashboard/student");
    revalidatePath("/dashboard/admin");
    return NextResponse.json({ verified: true, enrollmentId, message: "Payment verified and membership activated." });
  } catch (error) {
    console.error("Payment verification could not activate the membership:", error.message);
    return jsonError(error.message === "Membership is no longer available." ? error.message : "Payment verification could not complete. Please contact the academy before retrying the payment.", 503);
  } finally { await session?.endSession(); }
}
