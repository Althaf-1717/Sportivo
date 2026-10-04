import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiUser, jsonError, requireApiRole } from "@/lib/api-utils";
import { connectDB } from "@/lib/mongodb";
import { getMembershipPlans } from "@/lib/public-data";
import { MembershipPlan, Sport } from "@/models";

const planSchema = z.object({ name: z.string().trim().min(2).max(60), sport: z.string().min(1), duration: z.coerce.number().int().min(1).max(36), price: z.coerce.number().int().min(1).max(1000000), description: z.string().trim().max(500).default(""), features: z.array(z.string().trim().min(1).max(120)).max(12).default([]), isActive: z.boolean().default(true) });

export async function GET() {
  const plans = await getMembershipPlans();
  return NextResponse.json({ plans });
}

export async function POST(request) {
  const user = await getApiUser();
  const denied = requireApiRole(user, ["admin"]);
  if (denied) return denied;
  let input;
  try { input = planSchema.parse(await request.json()); }
  catch (error) { return jsonError(error.issues?.[0]?.message || "Please check the membership details."); }
  await connectDB();
  const sport = await Sport.findOne({ isActive: true, $or: [{ slug: input.sport.toLowerCase() }, ...( /^[a-f\d]{24}$/i.test(input.sport) ? [{ _id: input.sport }] : [])] });
  if (!sport) return jsonError("Choose an active sport.");
  const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const plan = await MembershipPlan.create({ ...input, slug, sport: sport._id });
  return NextResponse.json({ plan }, { status: 201 });
}
