import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { z } from "zod";
import { getApiUser, jsonError, requireApiRole, isObjectId } from "@/lib/api-utils";
import { connectDB } from "@/lib/mongodb";
import { Coach, Enrollment, MembershipPlan, Payment, Sport } from "@/models";

const orderSchema = z.object({ sportId: z.string().min(1), coachId: z.string().min(1), planId: z.string().min(1) });

export async function POST(request) {
  const user = await getApiUser();
  const denied = requireApiRole(user, ["student"]);
  if (denied) return denied;
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return jsonError("Razorpay test credentials are not configured on the server.", 503);
  if (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID !== process.env.RAZORPAY_KEY_ID) return jsonError("Razorpay public and server keys do not match. Check the app configuration.", 503);
  let input;
  try { input = orderSchema.parse(await request.json()); }
  catch (error) { return jsonError(error.issues?.[0]?.message || "Choose a sport, coach, and membership."); }
  if (![input.sportId, input.coachId, input.planId].every(isObjectId)) return jsonError("One of your selections is no longer available. Refresh and try again.", 400);
  try {
    await connectDB();
    if (await Enrollment.exists({ student: user.id, status: "active" })) return jsonError("You already have an active membership.", 409);
    const [sport, coach, plan] = await Promise.all([
      Sport.findOne({ _id: input.sportId, isActive: true }),
      Coach.findOne({ user: input.coachId, isActive: true }).populate("sports", "_id"),
      MembershipPlan.findOne({ _id: input.planId, isActive: true }),
    ]);
    if (!sport || !coach || !plan) return jsonError("One of your selections is unavailable. Please choose again.", 404);
    if (!coach.sports.some((item) => String(item._id) === String(sport._id))) return jsonError("That coach is not assigned to the selected sport.", 400);
    if (String(plan.sport) !== String(sport._id)) return jsonError("That membership does not match the selected sport.", 400);

    const gateway = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    const order = await gateway.orders.create({ amount: Math.round(plan.price * 100), currency: "INR", receipt: `fh_${user.id.slice(-8)}_${Date.now().toString(36)}`, notes: { studentId: user.id, sportId: sport._id.toString(), coachId: input.coachId, membershipPlanId: plan._id.toString() } });
    await Payment.create({ student: user.id, membershipPlan: plan._id, sport: sport._id, coach: input.coachId, razorpayOrderId: order.id, amount: plan.price, currency: order.currency || "INR", status: "pending" });
    return NextResponse.json({ id: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID, sport: sport.name, plan: plan.name });
  } catch (error) {
    console.error("Razorpay order creation failed:", error.message);
    return jsonError("We couldn’t start checkout. Please try again in a moment.", 503);
  }
}
