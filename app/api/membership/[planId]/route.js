import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiUser, jsonError, requireApiRole, isObjectId } from "@/lib/api-utils";
import { connectDB } from "@/lib/mongodb";
import { MembershipPlan, Sport } from "@/models";

const planUpdates = z.object({ name: z.string().trim().min(2).max(60).optional(), sport: z.string().optional(), duration: z.coerce.number().int().min(1).max(36).optional(), price: z.coerce.number().int().min(1).max(1000000).optional(), description: z.string().trim().max(500).optional(), features: z.array(z.string().trim().min(1).max(120)).max(12).optional(), isActive: z.boolean().optional() });

export async function GET(request, { params }) {
  const { planId } = await params;
  if (!isObjectId(planId)) return jsonError("Membership not found.", 404);
  await connectDB();
  const plan = await MembershipPlan.findOne({ _id: planId, isActive: true }).populate("sport", "name slug").lean();
  return plan ? NextResponse.json({ plan }) : jsonError("Membership not found.", 404);
}

export async function PUT(request, { params }) {
  const user = await getApiUser();
  const denied = requireApiRole(user, ["admin"]);
  if (denied) return denied;
  const { planId } = await params;
  if (!isObjectId(planId)) return jsonError("Invalid membership id.", 400);
  let input;
  try { input = planUpdates.parse(await request.json()); }
  catch (error) { return jsonError(error.issues?.[0]?.message || "Please check the membership details."); }
  await connectDB();
  if (input.sport) {
    const sport = await Sport.findOne({ isActive: true, $or: [{ slug: input.sport.toLowerCase() }, ...(isObjectId(input.sport) ? [{ _id: input.sport }] : [])] });
    if (!sport) return jsonError("Choose an active sport.");
    input.sport = sport._id;
  }
  if (input.name) input.slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const plan = await MembershipPlan.findByIdAndUpdate(planId, { $set: input }, { new: true, runValidators: true }).populate("sport", "name");
  return plan ? NextResponse.json({ plan }) : jsonError("Membership not found.", 404);
}

export async function DELETE(request, { params }) {
  const user = await getApiUser();
  const denied = requireApiRole(user, ["admin"]);
  if (denied) return denied;
  const { planId } = await params;
  if (!isObjectId(planId)) return jsonError("Invalid membership id.", 400);
  await connectDB();
  const plan = await MembershipPlan.findByIdAndUpdate(planId, { isActive: false }, { new: true });
  return plan ? NextResponse.json({ message: "Membership plan deactivated." }) : jsonError("Membership not found.", 404);
}
