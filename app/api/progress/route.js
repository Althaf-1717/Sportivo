import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiUser, jsonError, requireApiRole } from "@/lib/api-utils";
import { connectDB } from "@/lib/mongodb";
import { Enrollment, Notification, Progress } from "@/models";

const score = z.number().int().min(0).max(100);
const progressInput = z.object({ enrollmentId: z.string().min(1), skillLevel: z.enum(["Beginner", "Intermediate", "Advanced", "Professional"]), fitnessScore: score, technicalScore: score, performanceScore: score, overallProgress: score.optional(), remarks: z.string().trim().max(1000).default(""), trainingNotes: z.string().trim().max(2000).default("") });

export async function GET(request) {
  const user = await getApiUser();
  if (!user) return jsonError("Sign in to view progress.", 401);
  await connectDB();
  const params = new URL(request.url).searchParams;
  const studentId = params.get("studentId");
  const query = user.role === "admin" ? (studentId ? { student: studentId } : {}) : user.role === "coach" ? { coach: user.id, ...(studentId ? { student: studentId } : {}) } : { student: user.id };
  const progress = await Progress.find(query).sort({ createdAt: -1 }).limit(300).populate("student", "name email").populate("coach", "name").populate("sport", "name").lean();
  return NextResponse.json({ progress: JSON.parse(JSON.stringify(progress)) });
}

export async function POST(request) {
  const user = await getApiUser();
  const denied = requireApiRole(user, ["coach", "admin"]);
  if (denied) return denied;
  let input;
  try { input = progressInput.parse(await request.json()); }
  catch (error) { return jsonError(error.issues?.[0]?.message || "Please check the progress review."); }
  await connectDB();
  const enrollment = await Enrollment.findOne({ _id: input.enrollmentId, status: "active" });
  if (!enrollment) return jsonError("An active student enrolment is required.", 404);
  if (user.role === "coach" && String(enrollment.coach) !== user.id) return jsonError("You can only review progress for your own students.", 403);
  const calculated = Math.round((input.fitnessScore + input.technicalScore + input.performanceScore) / 3);
  const overallProgress = typeof input.overallProgress === "number" ? input.overallProgress : calculated;
  const progress = await Progress.create({ ...input, student: enrollment.student, coach: enrollment.coach, sport: enrollment.sport, overallProgress });
  await Notification.create({ user: enrollment.student, title: "Progress updated", message: `Your coach added a new ${input.skillLevel.toLowerCase()} skill review.`, type: "progress" });
  return NextResponse.json({ progress: JSON.parse(JSON.stringify(progress)) }, { status: 201 });
}
