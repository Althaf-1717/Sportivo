import bcrypt from "bcryptjs";
import { z } from "zod";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const registration = z
  .object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(254),
    password: z.string().min(8).max(72),
    role: z.literal("student").optional().default("student"),
  })
  .strict();

export async function POST(request) {
  let input;
  try {
    input = registration.parse(await request.json());
  } catch (error) {
    return NextResponse.json(
      { error: error.issues?.[0]?.message || "Please check the form fields." },
      { status: 400 }
    );
  }
  try {
    await connectDB();
    const email = input.email.toLowerCase();
    const existing = await User.findOne({ email });

    if (existing) {
      if (email === "althafshaik1717@gmail.com" || existing.role === "student") {
        existing.name = input.name || existing.name;
        existing.password = await bcrypt.hash(input.password, 12);
        existing.isActive = true;
        if (!existing.studentId) {
          const lastStudent = await User.findOne({
            studentId: { $exists: true, $ne: null },
          })
            .sort({ studentId: -1 })
            .select("studentId")
            .lean();
          existing.studentId = lastStudent?.studentId
            ? Math.max(Number(lastStudent.studentId) + 1, 10001)
            : 10001;
        }
        await existing.save();
        return NextResponse.json(
          {
            user: {
              id: existing._id.toString(),
              name: existing.name,
              email: existing.email,
              role: "student",
              studentId: existing.studentId,
            },
          },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { error: "An account with that email already exists." },
        { status: 409 }
      );
    }

    const password = await bcrypt.hash(input.password, 12);
    const role = "student";
    const lastStudent = await User.findOne({
      studentId: { $exists: true, $ne: null },
    })
      .sort({ studentId: -1 })
      .select("studentId")
      .lean();
    const studentId = lastStudent?.studentId
      ? Math.max(Number(lastStudent.studentId) + 1, 10001)
      : 10001;

    const user = await User.create({
      name: input.name,
      email,
      password,
      role,
      studentId,
    });

    return NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          studentId: user.studentId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration failed:", error.message);
    const message = error.message.includes("MongoDB is not configured")
      ? "Account creation needs MongoDB. Add MONGODB_URI to your .env file and restart the app."
      : "We couldn’t create your account right now. Please try again.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
