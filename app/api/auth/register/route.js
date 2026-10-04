import bcrypt from "bcryptjs";
import { z } from "zod";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const registration = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(72),
  role: z.enum(["student", "coach", "admin"]).optional(),
}).strict();

export async function POST(request) {
  let input;
  try { input = registration.parse(await request.json()); }
  catch (error) { return NextResponse.json({ error: error.issues?.[0]?.message || "Please check the form fields." }, { status: 400 }); }
  try {
    await connectDB();
    const email = input.email.toLowerCase();
    if (await User.exists({ email })) return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    const password = await bcrypt.hash(input.password, 12);
    const role = input.role || "student";
    let studentId = undefined;
    if (role === "student") {
      const lastStudent = await User.findOne({ studentId: { $exists: true, $ne: null } })
        .sort({ studentId: -1 })
        .select("studentId")
        .lean();
      studentId = lastStudent?.studentId ? Math.max(Number(lastStudent.studentId) + 1, 10001) : 10001;
    }
    const user = await User.create({ name: input.name, email, password, role, ...(studentId ? { studentId } : {}) });
    if (role === "coach") {
      const { default: Coach } = await import("@/models/Coach.js");
      const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "coach";
      await Coach.create({ user: user._id, slug: `${slug}-${user._id.toString().slice(-4)}`, specialization: "Academy Coach", experience: 1, isActive: true });
    }
    return NextResponse.json({ user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role, studentId: user.studentId } }, { status: 201 });
  } catch (error) {
    console.error("Registration failed:", error.message);
    const message = error.message.includes("MongoDB is not configured") ? "Account creation needs MongoDB. Add MONGODB_URI to your .env file and restart the app." : "We couldn’t create your account right now. Please try again.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
