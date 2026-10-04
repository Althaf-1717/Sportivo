import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getApiUser, jsonError, requireApiRole } from "@/lib/api-utils";
import { connectDB } from "@/lib/mongodb";
import { getCoaches } from "@/lib/public-data";
import { Coach, Sport, User } from "@/models";

const coachSchema = z.object({
  name: z.string().trim().min(2).max(100), email: z.string().trim().email().max(254), phone: z.string().trim().max(30).default(""),
  password: z.string().min(8).max(72).optional(), specialization: z.string().trim().max(120).default(""), experience: z.coerce.number().min(0).max(60).default(0),
  bio: z.string().trim().max(2000).default(""), sports: z.array(z.string().max(100)).min(1), certifications: z.array(z.string().trim().max(150)).max(20).default([]),
  image: z.string().optional(),
});

export async function GET() {
  if (!process.env.MONGODB_URI) return NextResponse.json({ coaches: (await getCoaches()).map((coach) => ({ ...coach, userId: coach.slug })) });
  await connectDB();
  const coaches = await Coach.find({ isActive: true }).populate("user", "name email phone image isActive").populate("sports", "name slug").sort({ createdAt: -1 }).lean();
  return NextResponse.json({ coaches: JSON.parse(JSON.stringify(coaches.map((coach) => ({ ...coach, userId: coach.user?._id, image: coach.user?.image || coach.image || "" })))) });
}

export async function POST(request) {
  const user = await getApiUser();
  const denied = requireApiRole(user, ["admin"]);
  if (denied) return denied;
  let input;
  try { input = coachSchema.parse(await request.json()); }
  catch (error) { return jsonError(error.issues?.[0]?.message || "Please check the coach details."); }
  await connectDB();
  const email = input.email.toLowerCase();
  try {
    let sportRecords = await Sport.find({
      isActive: true,
      $or: [
        { _id: { $in: input.sports.filter((id) => /^[a-f\d]{24}$/i.test(id)) } },
        { slug: { $in: input.sports.map((name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-")) } },
        { name: { $in: input.sports.map((name) => new RegExp(`^${name.trim()}$`, "i")) } },
      ],
    });
    if (!sportRecords.length) {
      sportRecords = await Sport.find({ isActive: true }).limit(2);
    }
    if (!sportRecords.length) return jsonError("Select at least one active sport.");
    let account = await User.findOne({ email });
    if (account && account.role !== "coach") return jsonError("That email is already used by a different account role.", 409);
    if (!account) {
      if (!input.password) return jsonError("Set an initial temporary password for the new coach account.");
      account = await User.create({ name: input.name, email, phone: input.phone, image: input.image || "", role: "coach", password: await bcrypt.hash(input.password, 12), isActive: true });
    } else {
      account.name = input.name; account.phone = input.phone; account.isActive = true; account.role = "coach";
      if (input.image) account.image = input.image;
      if (input.password) account.password = await bcrypt.hash(input.password, 12);
      await account.save();
    }
    const slug = input.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const coach = await Coach.findOneAndUpdate({ user: account._id }, { $set: { slug, bio: input.bio, experience: input.experience, specialization: input.specialization, sports: sportRecords.map((sport) => sport._id), certifications: input.certifications || [], image: input.image || account.image || "", isActive: true } }, { new: true, upsert: true, runValidators: true });
    const populated = await Coach.findById(coach._id).populate("user", "name email phone image isActive").populate("sports", "name").lean();
    return NextResponse.json({ coach: populated }, { status: 201 });
  } catch (error) {
    console.error("Coach setup failed:", error.message);
    return jsonError(error.code === 11000 ? "That coach is already registered." : "Could not save the coach account.", error.code === 11000 ? 409 : 503);
  }
}
