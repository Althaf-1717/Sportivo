import bcrypt from "bcryptjs";

// Global fallback user store across serverless function invocations
if (!globalThis.fallbackUsersMap) {
  globalThis.fallbackUsersMap = new Map();
}

export function getFallbackUsers() {
  return globalThis.fallbackUsersMap;
}

export function findFallbackUser(email) {
  if (!email) return null;
  return globalThis.fallbackUsersMap.get(String(email).toLowerCase().trim()) || null;
}

export async function saveFallbackUser({ name, email, password, role = "student", studentId }) {
  const normalizedEmail = String(email).toLowerCase().trim();
  let assignedStudentId = studentId;
  if (!assignedStudentId && role === "student") {
    let maxId = 10000;
    for (const u of globalThis.fallbackUsersMap.values()) {
      if (u.studentId && Number(u.studentId) > maxId) {
        maxId = Number(u.studentId);
      }
    }
    assignedStudentId = maxId + 1;
  }

  const hashedPassword = password ? await bcrypt.hash(password, 10) : "";
  const user = {
    _id: "usr_" + Math.random().toString(36).substring(2, 10),
    name: name || (email.split("@")[0].replace(/[._-]/g, " ")),
    email: normalizedEmail,
    password: hashedPassword,
    role: role || "student",
    studentId: assignedStudentId || null,
    isActive: true,
  };

  globalThis.fallbackUsersMap.set(normalizedEmail, user);
  return user;
}
