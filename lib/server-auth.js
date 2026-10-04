import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function currentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  if (!process.env.MONGODB_URI) return session.user;
  await connectDB();
  let account = await User.findById(session.user.id).select("name email image role studentId isActive");
  if (!account || !account.isActive) return null;
  if (account.role === "student" && !account.studentId) {
    const lastStudent = await User.findOne({ studentId: { $exists: true, $ne: null } })
      .sort({ studentId: -1 })
      .select("studentId")
      .lean();
    account.studentId = lastStudent?.studentId ? Math.max(Number(lastStudent.studentId) + 1, 10001) : 10001;
    await account.save();
  }
  return safeUser(account);
}

export async function requireRole(roles) {
  const user = await currentUser();
  if (!user) redirect("/login?reason=account-unavailable");
  if (!roles.includes(user.role)) {
    const target = roles.includes("coach") ? "/dashboard/coach" : roles.includes("admin") ? "/dashboard/admin" : "/dashboard/student";
    redirect(`/login?callbackUrl=${encodeURIComponent(target)}`);
  }
  return user;
}

export function safeUser(user) {
  if (!user) return null;
  return {
    id: String(user._id || user.id),
    name: user.name,
    email: user.email,
    image: user.image || "",
    role: user.role,
    studentId: user.studentId || null,
  };
}
