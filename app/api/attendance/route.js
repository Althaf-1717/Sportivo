import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiUser, jsonError, requireApiRole } from "@/lib/api-utils";
import { connectDB } from "@/lib/mongodb";
import { Attendance, Enrollment, Notification } from "@/models";

const singleAttendanceInput = z.object({
  enrollmentId: z.string().min(1),
  date: z.string(),
  time: z.string().optional().default(""),
  work: z.string().optional().default(""),
  status: z.enum(["present", "absent"]),
  remarks: z.string().trim().max(500).default(""),
});

const batchAttendanceInput = z.object({
  date: z.string(),
  time: z.string().optional().default(""),
  work: z.string().optional().default(""),
  records: z.array(
    z.object({
      enrollmentId: z.string().min(1),
      status: z.enum(["present", "absent"]),
      remarks: z.string().trim().max(500).optional().default(""),
    })
  ),
});

export async function GET(request) {
  const user = await getApiUser();
  if (!user) return jsonError("Sign in to view attendance.", 401);
  await connectDB();
  const params = new URL(request.url).searchParams;
  const studentId = params.get("studentId");
  const query =
    user.role === "admin"
      ? studentId
        ? { student: studentId }
        : {}
      : user.role === "coach"
      ? { coach: user.id, ...(studentId ? { student: studentId } : {}) }
      : { student: user.id };

  const attendance = await Attendance.find(query)
    .sort({ date: -1, createdAt: -1 })
    .limit(300)
    .populate("student", "name email studentId")
    .populate("coach", "name")
    .populate("sport", "name")
    .lean();

  return NextResponse.json({ attendance: JSON.parse(JSON.stringify(attendance)) });
}

export async function POST(request) {
  const user = await getApiUser();
  const denied = requireApiRole(user, ["coach", "admin"]);
  if (denied) return denied;

  const body = await request.json();
  await connectDB();

  // Handle batch submission (e.g. from Coach Attendance roster)
  if (Array.isArray(body.records)) {
    let input;
    try {
      input = batchAttendanceInput.parse(body);
    } catch (error) {
      return jsonError(error.issues?.[0]?.message || "Invalid batch attendance data.");
    }

    const sessionDate = new Date(input.date);
    sessionDate.setUTCHours(0, 0, 0, 0);

    const savedRecords = [];
    for (const item of input.records) {
      const enrollment = await Enrollment.findOne({ _id: item.enrollmentId, status: "active" });
      if (!enrollment) continue;
      if (user.role === "coach" && String(enrollment.coach) !== user.id) continue;

      const record = await Attendance.findOneAndUpdate(
        { student: enrollment.student, enrollment: enrollment._id, date: sessionDate },
        {
          $set: {
            coach: enrollment.coach,
            sport: enrollment.sport,
            time: input.time || "",
            work: input.work || "",
            status: item.status,
            remarks: item.remarks || "",
          },
        },
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
      );

      savedRecords.push(record);

      await Notification.create({
        user: enrollment.student,
        title: "Attendance Recorded",
        message: `Your coach marked you ${item.status.toUpperCase()} for session on ${sessionDate.toLocaleDateString("en-IN")}. ${input.work ? `Work: ${input.work}` : ""}`,
        type: "attendance",
      });
    }

    return NextResponse.json(
      {
        success: true,
        count: savedRecords.length,
        attendance: JSON.parse(JSON.stringify(savedRecords)),
      },
      { status: 201 }
    );
  }

  // Handle single record submission
  let singleInput;
  try {
    singleInput = singleAttendanceInput.parse(body);
  } catch (error) {
    return jsonError(error.issues?.[0]?.message || "Please check the attendance details.");
  }

  const enrollment = await Enrollment.findOne({ _id: singleInput.enrollmentId, status: "active" });
  if (!enrollment) return jsonError("An active student enrolment is required.", 404);
  if (user.role === "coach" && String(enrollment.coach) !== user.id)
    return jsonError("You can only mark attendance for your own students.", 403);

  const date = new Date(singleInput.date);
  date.setUTCHours(0, 0, 0, 0);

  try {
    const row = await Attendance.findOneAndUpdate(
      { student: enrollment.student, enrollment: enrollment._id, date },
      {
        $set: {
          coach: enrollment.coach,
          sport: enrollment.sport,
          time: singleInput.time || "",
          work: singleInput.work || "",
          status: singleInput.status,
          remarks: singleInput.remarks,
        },
      },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );

    await Notification.create({
      user: enrollment.student,
      title: "Attendance updated",
      message: `Your ${singleInput.status} attendance for ${date.toLocaleDateString("en-IN")} was recorded.`,
      type: "attendance",
    });

    return NextResponse.json({ attendance: JSON.parse(JSON.stringify(row)) }, { status: 201 });
  } catch (error) {
    if (error.code === 11000)
      return jsonError("Attendance for this student and date already exists. Update the existing record instead.", 409);
    return jsonError("Could not record attendance.", 503);
  }
}
