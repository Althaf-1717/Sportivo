import bcrypt from "bcryptjs";
import { deterministicStudentId } from "@/lib/student-state-cookie";
if (!globalThis.fallbackUsersMap) {
  globalThis.fallbackUsersMap = new Map();
}
if (!globalThis.fallbackEnrollmentsMap) {
  globalThis.fallbackEnrollmentsMap = new Map();
}
export function getFallbackUsers() {
  return globalThis.fallbackUsersMap;
}
export function findFallbackUser(email) {
  if (!email) return null;
  return globalThis.fallbackUsersMap.get(String(email).toLowerCase().trim()) || null;
}
export async function saveFallbackUser({
  name,
  email,
  password,
  role = "student",
  studentId
}) {
  const normalizedEmail = String(email).toLowerCase().trim();
  const assignedStudentId = studentId || (role === "student" ? deterministicStudentId(normalizedEmail) : null);
  const hashedPassword = password ? await bcrypt.hash(password, 10) : "";
  const user = {
    _id: "usr_" + Buffer.from(normalizedEmail).toString("base64url").slice(0, 12),
    name: name || email.split("@")[0].replace(/[._-]/g, " "),
    email: normalizedEmail,
    password: hashedPassword,
    role: role || "student",
    studentId: assignedStudentId || null,
    isActive: true
  };
  globalThis.fallbackUsersMap.set(normalizedEmail, user);
  return user;
}
export function saveFallbackEnrollment(studentId, {
  plan,
  sport,
  coach,
  amount
}) {
  if (!studentId) return null;
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + (plan?.duration || 3));
  const enrollment = {
    _id: "enr_" + Math.random().toString(36).substring(2, 10),
    student: studentId,
    sport: {
      _id: "spt_cricket",
      name: sport?.name || "Cricket",
      slug: sport?.slug || "cricket"
    },
    coach: {
      _id: "cch_arjun",
      name: coach?.name || coach?.user?.name || "Coach Arjun Menon",
      image: coach?.image || "/images/coaches/coach-1.jpg",
      specialization: coach?.specialization || "Batting & Fielding Specialist"
    },
    membershipPlan: {
      _id: "pln_standard",
      name: plan?.name || "Standard",
      price: amount || plan?.price || 3999,
      duration: plan?.duration || 3
    },
    status: "active",
    paymentStatus: "successful",
    startDate,
    endDate,
    createdAt: new Date()
  };
  globalThis.fallbackEnrollmentsMap.set(String(studentId), enrollment);
  return enrollment;
}
export function getFallbackEnrollment(studentId) {
  if (!studentId) return null;
  return globalThis.fallbackEnrollmentsMap.get(String(studentId)) || null;
}
