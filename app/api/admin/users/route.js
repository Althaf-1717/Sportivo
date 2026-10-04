import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiUser, jsonError, requireApiRole, isObjectId } from "@/lib/api-utils";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request) {
  const user = await getApiUser();
  const denied = requireApiRole(user, ["admin"]);
  if (denied) return denied;
  await connectDB();
  const search = new URL(request.url).searchParams.get("search")?.trim();
  const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const query = search ? { $or: [{ name: new RegExp(escape(search), "i") }, { email: new RegExp(escape(search), "i") }] } : {};
  const users = await User.find(query).select("name email role phone isActive createdAt").sort({ createdAt: -1 }).limit(250).lean();
  return NextResponse.json({ users: JSON.parse(JSON.stringify(users)) });
}

export async function PATCH(request) {
  const user = await getApiUser();
  const denied = requireApiRole(user, ["admin"]);
  if (denied) return denied;
  const schema = z.object({ id: z.string().refine(isObjectId), isActive: z.boolean() });
  let input;
  try { input = schema.parse(await request.json()); }
  catch (error) { return jsonError(error.issues?.[0]?.message || "Invalid account update."); }
  if (input.id === user.id && !input.isActive) return jsonError("You cannot deactivate your own admin account.", 400);
  await connectDB();
  const updated = await User.findByIdAndUpdate(input.id, { isActive: input.isActive }, { new: true }).select("name email role isActive").lean();
  return updated ? NextResponse.json({ user: JSON.parse(JSON.stringify(updated)) }) : jsonError("Account not found.", 404);
}

export async function DELETE(request) {
  const user = await getApiUser();
  const denied = requireApiRole(user, ["admin"]);
  if (denied) return denied;
  const id = new URL(request.url).searchParams.get("id");
  if (!id || !isObjectId(id)) return jsonError("Valid account ID is required.", 400);
  if (id === user.id) return jsonError("You cannot delete your own admin account.", 400);
  await connectDB();
  const deleted = await User.findByIdAndDelete(id);
  return deleted ? NextResponse.json({ success: true, message: "User account removed." }) : jsonError("Account not found.", 404);
}
