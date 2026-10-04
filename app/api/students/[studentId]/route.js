import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiUser, jsonError, isObjectId } from "@/lib/api-utils";
import { connectDB } from "@/lib/mongodb";
import { Enrollment, User } from "@/models";

const updateSchema = z.object({ name: z.string().trim().min(2).max(100).optional(), phone: z.string().trim().max(30).optional(), address: z.string().trim().max(500).optional(), isActive: z.boolean().optional() });

export async function GET(request, { params }) {
  const sessionUser = await getApiUser();
  if (!sessionUser) return jsonError("Sign in to view student information.", 401);
  const { studentId } = await params;
  if (!isObjectId(studentId)) return jsonError("Student not found.", 404);
  await connectDB();
  const student = await User.findOne({ _id: studentId, role: "student" }).select("name email image phone address isActive createdAt").lean();
  if (!student) return jsonError("Student not found.", 404);
  if (sessionUser.role !== "admin" && sessionUser.id !== studentId) {
    const enrollment = await Enrollment.exists({ student: studentId, coach: sessionUser.id, status: "active" });
    if (sessionUser.role !== "coach" || !enrollment) return jsonError("You do not have permission to view this student.", 403);
  }
  return NextResponse.json({ student: JSON.parse(JSON.stringify(student)) });
}

export async function PATCH(request, { params }) {
  const sessionUser = await getApiUser();
  if (!sessionUser) return jsonError("Sign in to update student information.", 401);
  const { studentId } = await params;
  if (!isObjectId(studentId)) return jsonError("Student not found.", 404);
  if (sessionUser.role !== "admin" && sessionUser.id !== studentId) return jsonError("You do not have permission to update this account.", 403);
  let input;
  try { input = updateSchema.parse(await request.json()); }
  catch (error) { return jsonError(error.issues?.[0]?.message || "Please check the account details."); }
  if (sessionUser.role !== "admin") delete input.isActive;
  await connectDB();
  const student = await User.findOneAndUpdate({ _id: studentId, role: "student" }, { $set: input }, { new: true, runValidators: true }).select("name email phone address isActive").lean();
  return student ? NextResponse.json({ student: JSON.parse(JSON.stringify(student)) }) : jsonError("Student not found.", 404);
}
