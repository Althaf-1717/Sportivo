import { NextResponse } from "next/server";
import { getApiUser, jsonError } from "@/lib/api-utils";
import { connectDB } from "@/lib/mongodb";
import { Enrollment, User } from "@/models";

export async function GET(request) {
  const user = await getApiUser();
  if (!user) return jsonError("Sign in to view student records.", 401);
  await connectDB();
  const params = new URL(request.url).searchParams;
  const search = params.get("search")?.trim();
  const sport = params.get("sport");
  const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  if (user.role === "student") {
    const student = await User.findById(user.id).select("name email image phone isActive createdAt").lean();
    return NextResponse.json({ students: student ? [JSON.parse(JSON.stringify(student))] : [] });
  }
  if (user.role === "coach") {
    const enrollments = await Enrollment.find({ coach: user.id, status: "active" }).populate("student", "name email image phone isActive createdAt").populate("sport", "name").lean();
    const students = [...new Map(enrollments.map((enrollment) => [String(enrollment.student?._id), { ...enrollment.student, sport: enrollment.sport?.name, enrollmentId: enrollment._id }])).values()].filter((student) => !search || search.split(/\s+/).some((term) => `${student.name} ${student.email}`.toLowerCase().includes(term.toLowerCase())));
    return NextResponse.json({ students: JSON.parse(JSON.stringify(students)) });
  }
  if (user.role !== "admin") return jsonError("You do not have permission to view student records.", 403);

  const query = { role: "student", ...(search ? { $or: [{ name: new RegExp(escape(search), "i") }, { email: new RegExp(escape(search), "i") }] } : {}) };
  const records = await User.find(query).select("name email image phone isActive createdAt").sort({ createdAt: -1 }).limit(250).lean();
  const ids = records.map((item) => item._id);
  const enrollments = await Enrollment.find({ student: { $in: ids }, status: "active", ...(sport ? { sport } : {}) }).populate("sport", "name").populate("membershipPlan", "name").populate("coach", "name").lean();
  const latestEnrollment = new Map(enrollments.map((item) => [String(item.student), item]));
  return NextResponse.json({ students: JSON.parse(JSON.stringify(records.filter((student) => !sport || latestEnrollment.has(String(student._id))).map((student) => ({ ...student, enrollment: latestEnrollment.get(String(student._id)) || null })))) });
}
