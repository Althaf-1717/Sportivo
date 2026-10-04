import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiUser, jsonError, requireApiRole } from "@/lib/api-utils";
import { connectDB } from "@/lib/mongodb";
import { getSports } from "@/lib/public-data";
import Sport from "@/models/Sport";

const sportSchema = z.object({
  name: z.string().trim().min(2).max(60),
  description: z.string().trim().max(500).default(""),
  detail: z.string().trim().max(2000).default(""),
  image: z.string().trim().max(1000).default(""),
  icon: z.string().trim().max(10).default(""),
  focus: z.array(z.string().trim().max(100)).max(10).default([]),
  isActive: z.boolean().default(true),
});

export async function GET() {
  const sports = await getSports();
  return NextResponse.json({ sports });
}

export async function POST(request) {
  const user = await getApiUser();
  const denied = requireApiRole(user, ["admin"]);
  if (denied) return denied;
  let input;
  try { input = sportSchema.parse(await request.json()); }
  catch (error) { return jsonError(error.issues?.[0]?.message || "Please check the sport details."); }
  try {
    await connectDB();
    const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const sport = await Sport.create({ ...input, slug });
    return NextResponse.json({ sport }, { status: 201 });
  } catch (error) {
    return jsonError(error.code === 11000 ? "A sport with that name already exists." : "Could not save the sport.", error.code === 11000 ? 409 : 503);
  }
}
