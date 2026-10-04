import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiUser, jsonError, requireApiRole, isObjectId } from "@/lib/api-utils";
import { connectDB } from "@/lib/mongodb";
import { getSportBySlug } from "@/lib/public-data";
import Sport from "@/models/Sport";

const updates = z.object({ name: z.string().trim().min(2).max(60).optional(), description: z.string().trim().max(500).optional(), detail: z.string().trim().max(2000).optional(), image: z.string().trim().max(1000).optional(), icon: z.string().trim().max(10).optional(), focus: z.array(z.string().trim().max(100)).max(10).optional(), isActive: z.boolean().optional() });

export async function GET(request, { params }) {
  const { sportId } = await params;
  const sport = await getSportBySlug(sportId);
  return sport ? NextResponse.json({ sport }) : jsonError("Sport not found.", 404);
}

export async function PUT(request, { params }) {
  const user = await getApiUser();
  const denied = requireApiRole(user, ["admin"]);
  if (denied) return denied;
  const { sportId } = await params;
  if (!isObjectId(sportId)) return jsonError("Invalid sport id.", 400);
  let input;
  try { input = updates.parse(await request.json()); }
  catch (error) { return jsonError(error.issues?.[0]?.message || "Please check the sport details."); }
  if (input.name) input.slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  await connectDB();
  try {
    const sport = await Sport.findByIdAndUpdate(sportId, { $set: input }, { new: true, runValidators: true });
    return sport ? NextResponse.json({ sport }) : jsonError("Sport not found.", 404);
  } catch (error) { return jsonError(error.code === 11000 ? "A sport with that name already exists." : "Could not update the sport.", error.code === 11000 ? 409 : 400); }
}

export async function DELETE(request, { params }) {
  const user = await getApiUser();
  const denied = requireApiRole(user, ["admin"]);
  if (denied) return denied;
  const { sportId } = await params;
  if (!isObjectId(sportId)) return jsonError("Invalid sport id.", 400);
  await connectDB();
  const sport = await Sport.findByIdAndUpdate(sportId, { isActive: false }, { new: true });
  return sport ? NextResponse.json({ sport }) : jsonError("Sport not found.", 404);
}
