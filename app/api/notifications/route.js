import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiUser, jsonError } from "@/lib/api-utils";
import { connectDB } from "@/lib/mongodb";
import Notification from "@/models/Notification";

export async function GET() {
  const user = await getApiUser();
  if (!user) return jsonError("Sign in to view notifications.", 401);
  await connectDB();
  const notifications = await Notification.find({ user: user.id }).sort({ createdAt: -1 }).limit(30).lean();
  return NextResponse.json({ notifications: JSON.parse(JSON.stringify(notifications)) });
}

export async function PATCH(request) {
  const user = await getApiUser();
  if (!user) return jsonError("Sign in to update notifications.", 401);
  let input;
  try { input = z.object({ id: z.string().optional(), markAll: z.boolean().optional() }).parse(await request.json()); }
  catch { return jsonError("Invalid notification update."); }
  await connectDB();
  const filter = { user: user.id, readAt: null, ...(input.id ? { _id: input.id } : {}) };
  if (input.markAll) await Notification.updateMany(filter, { readAt: new Date() });
  else if (input.id) await Notification.findOneAndUpdate(filter, { readAt: new Date() });
  else return jsonError("Choose a notification to mark as read.");
  return NextResponse.json({ message: "Notification updated." });
}
