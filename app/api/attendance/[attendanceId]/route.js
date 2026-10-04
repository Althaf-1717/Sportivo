import { z } from "zod";
import { getApiUser, jsonError, requireApiRole, isObjectId } from "@/lib/api-utils";
import { connectDB } from "@/lib/mongodb";
import { Attendance, Notification } from "@/models";
import { NextResponse } from "next/server";

const updateSchema = z.object({ status: z.enum(["present", "absent"]).optional(), remarks: z.string().trim().max(500).optional() });

export async function PUT(request, { params }) {
  const user = await getApiUser();
  const denied = requireApiRole(user, ["coach", "admin"]);
  if (denied) return denied;
  const { attendanceId } = await params;
  if (!isObjectId(attendanceId)) return jsonError("Attendance record not found.", 404);
  let input;
  try { input = updateSchema.parse(await request.json()); }
  catch (error) { return jsonError(error.issues?.[0]?.message || "Please check the attendance details."); }
  await connectDB();
  const row = await Attendance.findById(attendanceId);
  if (!row) return jsonError("Attendance record not found.", 404);
  if (user.role === "coach" && String(row.coach) !== user.id) return jsonError("You can only update attendance for your own students.", 403);
  Object.assign(row, input);
  await row.save();
  await Notification.create({ user: row.student, title: "Attendance updated", message: `Your attendance record for ${row.date.toLocaleDateString("en-IN")} was updated.`, type: "attendance" });
  return NextResponse.json({ attendance: JSON.parse(JSON.stringify(row)) });
}

export async function DELETE(request, { params }) {
  const user = await getApiUser();
  const denied = requireApiRole(user, ["coach", "admin"]);
  if (denied) return denied;
  const { attendanceId } = await params;
  if (!isObjectId(attendanceId)) return jsonError("Attendance record not found.", 404);
  await connectDB();
  const row = await Attendance.findById(attendanceId);
  if (!row) return jsonError("Attendance record not found.", 404);
  if (user.role === "coach" && String(row.coach) !== user.id) return jsonError("You can only delete attendance for your own students.", 403);
  await Attendance.findByIdAndDelete(attendanceId);
  return NextResponse.json({ success: true, message: "Attendance record deleted." });
}
