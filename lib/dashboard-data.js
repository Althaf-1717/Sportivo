import { connectDB } from "@/lib/mongodb";
import { Attendance, Coach, Enrollment, MembershipPlan, Payment, Progress, Sport, User } from "@/models";

const plain = (value) => JSON.parse(JSON.stringify(value));

export async function getStudentDashboard(studentId) {
  if (!process.env.MONGODB_URI) return { enrollments: [], attendance: [], progress: [], payments: [], summary: { attendanceRate: 0, progress: 0, skillLevel: "Beginner" }, configured: false };
  await connectDB();
  const [enrollments, attendance, progress, payments] = await Promise.all([
    Enrollment.find({ student: studentId }).sort({ createdAt: -1 }).limit(10).populate("sport", "name slug").populate("coach", "name image").populate("membershipPlan", "name price duration").lean(),
    Attendance.find({ student: studentId }).sort({ date: -1 }).limit(100).populate("sport", "name").populate("coach", "name").lean(),
    Progress.find({ student: studentId }).sort({ createdAt: -1 }).limit(12).populate("sport", "name").populate("coach", "name").lean(),
    Payment.find({ student: studentId }).sort({ createdAt: -1 }).limit(20).populate("membershipPlan", "name duration price").populate("sport", "name").populate("coach", "name").lean(),
  ]);
  const present = attendance.filter((item) => item.status === "present").length;
  const current = enrollments.find((item) => item.status === "active");
  const latestProgress = progress[0];
  return plain({ enrollments, attendance, progress, payments, currentEnrollment: current, latestProgress, summary: { attendanceRate: attendance.length ? Math.round((present / attendance.length) * 100) : 0, progress: latestProgress?.overallProgress || 0, skillLevel: latestProgress?.skillLevel || "Beginner", totalSessions: attendance.length, presentSessions: present }, configured: true });
}

export async function getCoachDashboard(coachId) {
  if (!process.env.MONGODB_URI) return { enrollments: [], summary: { assigned: 0, attendanceRate: 0, progress: 0 }, configured: false };
  await connectDB();
  const [enrollments, attendance, progress] = await Promise.all([
    Enrollment.find({ coach: coachId, status: "active" }).sort({ createdAt: -1 }).limit(100).populate("student", "name email image").populate("sport", "name").populate("membershipPlan", "name endDate").lean(),
    Attendance.find({ coach: coachId }).sort({ date: -1 }).limit(500).lean(),
    Progress.find({ coach: coachId }).sort({ createdAt: -1 }).limit(500).lean(),
  ]);
  const present = attendance.filter((item) => item.status === "present").length;
  const latestByStudent = new Map();
  for (const item of progress) if (!latestByStudent.has(String(item.student))) latestByStudent.set(String(item.student), item);
  const latestProgress = [...latestByStudent.values()];
  return plain({ enrollments, attendance, progress: latestProgress, summary: { assigned: enrollments.length, attendanceRate: attendance.length ? Math.round(present / attendance.length * 100) : 0, progress: latestProgress.length ? Math.round(latestProgress.reduce((sum, item) => sum + item.overallProgress, 0) / latestProgress.length) : 0, todaysAttendance: attendance.filter((item) => new Date(item.date).toDateString() === new Date().toDateString()).length }, configured: true });
}

export async function getAdminDashboard() {
  if (!process.env.MONGODB_URI) return { stats: [], revenue: [], sports: [], attendance: [], progress: [], configured: false };
  await connectDB();
  const attendanceStart = new Date();
  attendanceStart.setDate(attendanceStart.getDate() - 30);
  const [students, coaches, enrollments, active, successfulPayments, attendanceCount, attendance, progress, revenue, sportCounts, attendanceTrends, progressDistribution] = await Promise.all([
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "coach" }),
    Enrollment.countDocuments({}),
    Enrollment.countDocuments({ status: "active" }),
    Payment.aggregate([{ $match: { status: "successful" } }, { $group: { _id: null, amount: { $sum: "$amount" }, count: { $sum: 1 } } }]),
    Attendance.countDocuments({ date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }),
    Attendance.find({}).sort({ date: -1 }).limit(150).lean(),
    Progress.find({}).sort({ createdAt: -1 }).limit(100).lean(),
    Payment.aggregate([{ $match: { status: "successful" } }, { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, amount: { $sum: "$amount" } } }, { $sort: { _id: 1 } }, { $limit: 8 }]),
    Enrollment.aggregate([{ $group: { _id: "$sport", count: { $sum: 1 } } }, { $lookup: { from: "sports", localField: "_id", foreignField: "_id", as: "sport" } }, { $unwind: { path: "$sport", preserveNullAndEmptyArrays: true } }, { $project: { name: { $ifNull: ["$sport.name", "Other"] }, count: 1 } }]),
    Attendance.aggregate([{ $match: { date: { $gte: attendanceStart } } }, { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } }, absent: { $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] } } } }, { $sort: { _id: 1 } }, { $limit: 14 }]),
    Progress.aggregate([{ $sort: { createdAt: -1 } }, { $group: { _id: "$student", level: { $first: "$skillLevel" }, score: { $first: "$overallProgress" } } }, { $group: { _id: "$level", students: { $sum: 1 }, average: { $avg: "$score" } } }, { $project: { level: "$_id", students: 1, average: { $round: ["$average", 0] } } }, { $sort: { level: 1 } }]),
  ]);
  const present = attendance.filter((item) => item.status === "present").length;
  const avgProgress = progress.length ? Math.round(progress.reduce((sum, row) => sum + row.overallProgress, 0) / progress.length) : 0;
  return plain({
    stats: [
      { label: "Total students", value: students, note: "Registered athletes" },
      { label: "Total coaches", value: coaches, note: "Academy team" },
      { label: "Total enrollments", value: enrollments, note: "All programmes" },
      { label: "Active memberships", value: active, note: "Currently training" },
      { label: "Total revenue", value: successfulPayments[0]?.amount || 0, note: `${successfulPayments[0]?.count || 0} verified payments`, currency: true },
      { label: "Today's attendance", value: attendanceCount, note: "Sessions recorded today" },
      { label: "Average attendance", value: attendance.length ? `${Math.round(present / attendance.length * 100)}%` : "0%", note: "Recent sessions" },
      { label: "Average student progress", value: `${avgProgress}%`, note: "Latest coach reviews" },
    ],
    revenue: revenue.map((row) => ({ month: row._id, amount: row.amount })),
    sports: sportCounts,
    attendance: attendanceTrends.map((row) => ({ date: row._id, present: row.present, absent: row.absent })),
    progress: progress.slice(0, 12).map((row) => ({ level: row.skillLevel, score: row.overallProgress })),
    progressDistribution,
    configured: true,
  });
}

export async function getAdminRecords(resource, search = "") {
  await connectDB();
  const term = String(search || "").trim();
  const rx = term ? new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") : null;
  if (resource === "students") {
    const users = await User.find({ role: "student", ...(rx ? { $or: [{ name: rx }, { email: rx }] } : {}) }).sort({ createdAt: -1 }).limit(200).lean();
    const enrollments = await Enrollment.find({ student: { $in: users.map((user) => user._id) }, status: "active" }).sort({ createdAt: -1 }).populate("sport", "name").populate("membershipPlan", "name").populate("coach", "name").lean();
    const current = new Map();
    for (const enrollment of enrollments) if (!current.has(String(enrollment.student))) current.set(String(enrollment.student), enrollment);
    return plain(users.map((user) => ({ ...user, enrollment: current.get(String(user._id)) || null })));
  }
  if (resource === "coaches") return plain(await Coach.find({}).sort({ createdAt: -1 }).populate("user", "name email phone isActive").populate("sports", "name").lean());
  if (resource === "sports") return plain(await Sport.find({}).sort({ name: 1 }).lean());
  if (resource === "membership") return plain(await MembershipPlan.find({}).populate("sport", "name").sort({ price: 1 }).lean());
  if (resource === "enrollments") return plain(await Enrollment.find({}).sort({ createdAt: -1 }).limit(200).populate("student", "name email").populate("coach", "name").populate("sport", "name").populate("membershipPlan", "name price").lean());
  if (resource === "attendance") return plain(await Attendance.find({}).sort({ date: -1 }).limit(200).populate("student", "name").populate("coach", "name").populate("sport", "name").lean());
  if (resource === "progress") return plain(await Progress.find({}).sort({ createdAt: -1 }).limit(200).populate("student", "name").populate("coach", "name").populate("sport", "name").lean());
  if (resource === "payments") return plain(await Payment.find({}).sort({ createdAt: -1 }).limit(200).populate("student", "name email").populate("membershipPlan", "name").lean());
  if (resource === "users") return plain(await User.find({ ...(rx ? { $or: [{ name: rx }, { email: rx }] } : {}) }).sort({ createdAt: -1 }).limit(200).lean());
  return [];
}

export async function getCoachEnrollments(coachId, search = "") {
  await connectDB();
  const term = String(search || "").trim();
  const rx = term ? new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") : null;
  const enrollments = await Enrollment.find({ coach: coachId, status: "active", ...(rx ? { student: { $in: await User.find({ role: "student", $or: [{ name: rx }, { email: rx }] }).distinct("_id") } } : {}) }).sort({ createdAt: -1 }).populate("student", "name email image studentId").populate("sport", "name").populate("membershipPlan", "name duration").lean();
  const ids = enrollments.map((item) => item._id);
  const studentIds = enrollments.map((item) => item.student?._id).filter(Boolean);
  const [attendance, progress] = await Promise.all([
    Attendance.aggregate([{ $match: { enrollment: { $in: ids } } }, { $group: { _id: "$enrollment", sessions: { $sum: 1 }, present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } } } }]),
    Progress.find({ student: { $in: studentIds }, coach: coachId }).sort({ createdAt: -1 }).lean(),
  ]);
  const attendanceByEnrollment = new Map(attendance.map((item) => [String(item._id), item]));
  const progressByStudent = new Map();
  for (const item of progress) if (!progressByStudent.has(String(item.student))) progressByStudent.set(String(item.student), item);
  return plain(enrollments.map((enrollment) => {
    const counts = attendanceByEnrollment.get(String(enrollment._id));
    return { ...enrollment, attendanceRate: counts?.sessions ? Math.round(counts.present / counts.sessions * 100) : 0, latestProgress: progressByStudent.get(String(enrollment.student?._id)) || null };
  }));
}
