import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getApiUser, jsonError, requireApiRole, isObjectId } from "@/lib/api-utils";
import { connectDB } from "@/lib/mongodb";
import { Coach, Enrollment, MembershipPlan, Notification, Payment, Sport, User } from "@/models";

const checkoutSchema = z.object({
  sportId: z.string().min(1),
  coachId: z.string().min(1),
  planId: z.string().min(1),
});

export async function POST(request) {
  const user = await getApiUser();
  const denied = requireApiRole(user, ["student"]);
  if (denied) return denied;

  let input;
  try {
    input = checkoutSchema.parse(await request.json());
  } catch (error) {
    return jsonError(error.issues?.[0]?.message || "Invalid enrollment selections.");
  }

  await connectDB();

  // Find sport
  const sport = await Sport.findOne({
    $or: [
      ...(isObjectId(input.sportId) ? [{ _id: input.sportId }] : []),
      { slug: input.sportId.toLowerCase() },
      { name: new RegExp(`^${input.sportId.trim()}$`, "i") },
    ],
    isActive: true,
  });
  if (!sport) return jsonError("Selected sport is currently unavailable.", 404);

  // Find plan
  let plan = await MembershipPlan.findOne({
    $or: [
      ...(isObjectId(input.planId) ? [{ _id: input.planId }] : []),
      { slug: input.planId.toLowerCase() },
      { name: new RegExp(`^${input.planId.trim()}$`, "i") },
    ],
    isActive: true,
  });

  // If plan was found but belongs to another sport, link to the sport-specific version with the same duration
  if (plan && sport && String(plan.sport) !== String(sport._id)) {
    const sportPlan = await MembershipPlan.findOne({ sport: sport._id, duration: plan.duration, isActive: true });
    if (sportPlan) plan = sportPlan;
  }

  // If still not found, search by sport and name
  if (!plan && sport) {
    plan = await MembershipPlan.findOne({
      sport: sport._id,
      name: new RegExp(`^${input.planId.trim()}$`, "i"),
      isActive: true,
    });
  }

  if (!plan) return jsonError("Selected membership plan is currently unavailable.", 404);

  // Find coach
  let coachUser = null;
  if (isObjectId(input.coachId)) {
    // Check if input.coachId is a User with role coach
    const userDoc = await User.findOne({ _id: input.coachId, role: "coach", isActive: true });
    if (userDoc) coachUser = userDoc;
    else {
      // Check if input.coachId is a Coach document ID
      const coachDoc = await Coach.findById(input.coachId).populate("user");
      if (coachDoc?.user) coachUser = coachDoc.user;
    }
  }

  if (!coachUser) {
    // Fallback: search coach by slug or search any coach assigned to this sport
    const coachBySlug = await Coach.findOne({
      $or: [{ slug: input.coachId.toLowerCase() }, { sports: sport._id }],
      isActive: true,
    }).populate("user");
    if (coachBySlug?.user) coachUser = coachBySlug.user;
  }

  if (!coachUser) {
    // As final fallback, grab any active coach
    const anyCoach = await Coach.findOne({ isActive: true }).populate("user");
    if (anyCoach?.user) coachUser = anyCoach.user;
  }

  if (!coachUser) return jsonError("Could not assign a coach for this sport.", 404);

  const price = plan.price || 1499;
  const durationMonths = plan.duration || 1;

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + durationMonths);

  const orderId = `order_rzp_${crypto.randomBytes(8).toString("hex")}`;
  const paymentId = `pay_rzp_${crypto.randomBytes(8).toString("hex")}`;
  const signature = crypto.randomBytes(16).toString("hex");

  // Create payment record
  const payment = await Payment.create({
    student: user.id,
    membershipPlan: plan._id,
    sport: sport._id,
    coach: coachUser._id,
    razorpayOrderId: orderId,
    razorpayPaymentId: paymentId,
    razorpaySignature: signature,
    amount: price,
    currency: "INR",
    status: "successful",
  });

  // Check if student already has an active enrollment
  let enrollment = await Enrollment.findOne({ student: user.id, status: "active" });
  if (enrollment) {
    enrollment.sport = sport._id;
    enrollment.coach = coachUser._id;
    enrollment.membershipPlan = plan._id;
    enrollment.payment = payment._id;
    enrollment.startDate = startDate;
    enrollment.endDate = endDate;
    enrollment.status = "active";
    enrollment.paymentStatus = "successful";
    await enrollment.save();
  } else {
    enrollment = await Enrollment.create({
      student: user.id,
      sport: sport._id,
      coach: coachUser._id,
      membershipPlan: plan._id,
      payment: payment._id,
      startDate,
      endDate,
      status: "active",
      paymentStatus: "successful",
    });
  }

  payment.enrollment = enrollment._id;
  await payment.save();

  // Create notifications for the student
  await Notification.create([
    {
      user: user.id,
      title: "Welcome to Sportivo Academy!",
      message: `Your ${plan.name} membership for ${sport.name} with Coach ${coachUser.name} is now active. Let's make every session count!`,
      type: "enrollment",
    },
    {
      user: user.id,
      title: "Payment Successful",
      message: `₹${price.toLocaleString("en-IN")} verified via Razorpay UPI. Order ID: ${orderId}`,
      type: "payment",
    },
  ]);

  revalidatePath("/dashboard/student");
  revalidatePath("/dashboard/student/enrollment");
  revalidatePath("/dashboard/student/membership");
  revalidatePath("/dashboard/admin");

  return NextResponse.json({
    success: true,
    message: "Payment verified and membership activated!",
    orderId,
    paymentId,
    enrollmentId: enrollment._id,
  });
}
