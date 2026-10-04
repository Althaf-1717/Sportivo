import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiUser, jsonError, requireApiRole, isObjectId } from "@/lib/api-utils";
import { connectDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { Coach, Sport, User } from "@/models";

const coachUpdates = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  phone: z.string().trim().max(30).optional(),
  password: z.string().min(8).max(72).optional(),
  specialization: z.string().trim().max(120).optional(),
  experience: z.coerce.number().min(0).max(60).optional(),
  bio: z.string().trim().max(2000).optional(),
  sports: z.array(z.string().max(100)).min(1).optional(),
  certifications: z.array(z.string().trim().max(150)).max(20).optional(),
  image: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function PUT(request, { params }) {
  const user = await getApiUser();
  const denied = requireApiRole(user, ["admin"]);
  if (denied) return denied;
  const { coachId } = await params;
  if (!isObjectId(coachId)) return jsonError("Invalid coach id.", 400);
  let input;
  try { input = coachUpdates.parse(await request.json()); }
  catch (error) { return jsonError(error.issues?.[0]?.message || "Please check the coach details."); }
  await connectDB();
  const coach = await Coach.findById(coachId);
  if (!coach) return jsonError("Coach not found.", 404);
  if (input.sports) {
    const sports = await Sport.find({
      isActive: true,
      $or: [
        { _id: { $in: input.sports.filter(isObjectId) } },
        { slug: { $in: input.sports.map((name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-")) } },
        { name: { $in: input.sports.map((name) => new RegExp(`^${name.trim()}$`, "i")) } },
      ],
    });
    if (sports.length) coach.sports = sports.map((sport) => sport._id);
  }
  const { name, phone, password, image, isActive, ...details } = input;
  Object.assign(coach, details);
  if (image !== undefined) coach.image = image;
  if (isActive !== undefined) coach.isActive = isActive;
  await coach.save();

  const account = await User.findById(coach.user);
  if (account) {
    if (name) account.name = name;
    if (phone !== undefined) account.phone = phone;
    if (image !== undefined) account.image = image;
    if (isActive !== undefined) account.isActive = isActive;
    if (password) account.password = await bcrypt.hash(password, 12);
    await account.save();
  }
  return NextResponse.json({ coach: await Coach.findById(coach._id).populate("user", "name email phone image isActive").populate("sports", "name").lean() });
}

export async function DELETE(request, { params }) {
  const user = await getApiUser();
  const denied = requireApiRole(user, ["admin"]);
  if (denied) return denied;
  const { coachId } = await params;
  if (!isObjectId(coachId)) return jsonError("Invalid coach id.", 400);
  await connectDB();
  const coach = await Coach.findByIdAndUpdate(coachId, { isActive: false }, { new: true });
  if (!coach) return jsonError("Coach not found.", 404);
  await User.findByIdAndUpdate(coach.user, { isActive: false });
  return NextResponse.json({ message: "Coach access has been deactivated." });
}
