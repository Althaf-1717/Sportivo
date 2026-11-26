import crypto from "node:crypto";
import { cookies } from "next/headers";
const STATE_COOKIE = "sportivo_student_state";
const USERS_COOKIE = "sportivo_fallback_users";
function getSecret() {
  return process.env.AUTH_SECRET || "sportivo-fallback-secret-key-2026";
}
function signPayload(data) {
  const json = JSON.stringify(data);
  const b64 = Buffer.from(json, "utf8").toString("base64url");
  const sig = crypto.createHmac("sha256", getSecret()).update(b64).digest("hex");
  return `${b64}.${sig}`;
}
function verifyPayload(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return null;
  const expected = crypto.createHmac("sha256", getSecret()).update(b64).digest("hex");
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    return JSON.parse(Buffer.from(b64, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}
export function deterministicStudentId(email) {
  const normalized = String(email || "").toLowerCase().trim();
  if (!normalized) return 10001;
  if (normalized === "student1@gmail.com") return 10001;
  const hash = crypto.createHash("sha256").update(normalized).digest();
  const num = hash.readUInt32BE(0);
  return 10002 + num % 89998;
}
export async function readStudentStateMap() {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(STATE_COOKIE)?.value;
    const parsed = verifyPayload(raw);
    if (parsed && typeof parsed === "object" && parsed.records) {
      return parsed.records;
    }
  } catch {}
  return {};
}
export async function getStudentStateFromCookie(email) {
  if (!email) return null;
  const records = await readStudentStateMap();
  return records[String(email).toLowerCase().trim()] || null;
}
export async function buildStudentStateCookieHeader(email, entry) {
  const records = await readStudentStateMap();
  const key = String(email).toLowerCase().trim();
  const existing = records[key] || {};
  records[key] = {
    ...existing,
    ...entry
  };
  return {
    name: STATE_COOKIE,
    value: signPayload({
      records
    }),
    options: {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      secure: process.env.NODE_ENV === "production"
    }
  };
}
export async function readFallbackUsersCookie() {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(USERS_COOKIE)?.value;
    const parsed = verifyPayload(raw);
    if (parsed && typeof parsed === "object" && parsed.users) {
      return parsed.users;
    }
  } catch {}
  return {};
}
export async function buildFallbackUsersCookie(userRecord) {
  const users = await readFallbackUsersCookie();
  const key = String(userRecord.email).toLowerCase().trim();
  users[key] = {
    _id: userRecord._id,
    name: userRecord.name,
    email: key,
    password: userRecord.password,
    role: userRecord.role || "student",
    studentId: userRecord.studentId,
    isActive: true
  };
  return {
    name: USERS_COOKIE,
    value: signPayload({
      users
    }),
    options: {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      secure: process.env.NODE_ENV === "production"
    }
  };
}
