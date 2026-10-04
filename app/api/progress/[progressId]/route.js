import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiUser, jsonError, requireApiRole, isObjectId } from "@/lib/api-utils";
import { connectDB } from "@/lib/mongodb";
import { Notification, Progress } from "@/models";

const score = z.number().int().min(0).max(100);
const updateSchema = z.object({ skillLevel: z.enum(["Beginner", "Intermediate", "Advanced", "Professional"]).optional(), fitnessScore: score.optional(), technicalScore: score.optional(), performanceScore: score.optional(), remarks: z.string().trim().max(1000).optional(), trainingNotes: z.string().trim().max(2000).optional() });

export async function PUT(request, { params }) {
  const user = await getApiUser();
  const denied = requireApiRole(user, ["coach", "admin"]);
  if (denied) return denied;
  const { progressId } = await params;
  if (!isObjectId(progressId)) return jsonError("Progress review not found.", 404);
  let input;
  try { input = updateSchema.parse(await request.json()); }
  catch (error) { return jsonError(error.issues?.[0]?.message || "Please check the progress review."); }
  await connectDB();
  const row = await Progress.findById(progressId);
  if (!row) return jsonError("Progress review not found.", 404);
  if (user.role === "coach" && String(row.coach) !== user.id) return jsonError("You can only update your own reviews.", 403);
  Object.assign(row, input);
  row.overallProgress = Math.round((row.fitnessScore + row.technicalScore + row.performanceScore) / 3);
  await row.save();
  await Notification.create({ user: row.student, title: "Progress updated", message: "Your coach updated a progress review.", type: "progress" });
  return NextResponse.json({ progress: JSON.parse(JSON.stringify(row)) });
}

export async function DELETE(request, { params }) {
  const user = await getApiUser();
  const denied = requireApiRole(user, ["coach", "admin"]);
  if (denied) return denied;
  const { progressId } = await params;
  if (!isObjectId(progressId)) return jsonError("Progress review not found.", 404);
  await connectDB();
  const row = await Progress.findById(progressId);
  if (!row) return jsonError("Progress review not found.", 404);
  if (user.role === "coach" && String(row.coach) !== user.id) return jsonError("You can only delete your own reviews.", 403);
  await Progress.findByIdAndDelete(progressId);
  return NextResponse.json({ success: true, message: "Progress review deleted." });
}
