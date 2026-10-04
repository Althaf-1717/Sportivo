import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function getApiUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user;
}

export function jsonError(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function requireApiRole(user, roles) {
  if (!user) return jsonError("Sign in to continue.", 401);
  if (!roles.includes(user.role)) return jsonError("You do not have permission to do that.", 403);
  return null;
}

export function isObjectId(value) {
  return /^[a-f\d]{24}$/i.test(String(value));
}

export async function readJson(request) {
  try { return await request.json(); } catch { return null; }
}
