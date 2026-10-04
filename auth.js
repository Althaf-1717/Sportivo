import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb-client";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const providers = [
  Credentials({
    name: "Email and password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
      code: { label: "Code", type: "text" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password || !process.env.MONGODB_URI) return null;
      await connectDB();
      const email = String(credentials.email).toLowerCase().trim();
      const rawPassword = String(credentials.password || "").trim();
      const rawPasswordUntrimmed = String(credentials.password || "");
      const code = String(credentials.code || "").trim();

      // Find user in DB
      let user = await User.findOne({ email }).select("+password");

      // 1. Master Admin Handling (althafshaik1717@gmail.com)
      if (email === "althafshaik1717@gmail.com") {
        const isAdminPass =
          rawPassword === "Althaf@7727" ||
          rawPassword === "Althaf7727" ||
          (user?.password && (
            (await bcrypt.compare(rawPassword, user.password)) ||
            (await bcrypt.compare(rawPasswordUntrimmed, user.password))
          ));

        if (!isAdminPass) return null;
        if (code !== "1234567") return null;

        if (!user) {
          const hash = await bcrypt.hash("Althaf@7727", 12);
          user = await User.create({
            name: "Shaik Althaf",
            email: "althafshaik1717@gmail.com",
            password: hash,
            role: "admin",
            isActive: true,
          });
        } else {
          let needsSave = false;
          if (!user.isActive) { user.isActive = true; needsSave = true; }
          if (user.role !== "admin") { user.role = "admin"; needsSave = true; }
          if (!user.password || rawPassword === "Althaf@7727") {
            user.password = await bcrypt.hash("Althaf@7727", 12);
            needsSave = true;
          }
          if (needsSave) await user.save();
        }

        const safeImage = (user.image && !user.image.startsWith("data:")) ? user.image : "";
        return {
          id: user._id.toString(),
          name: user.name || "Master Administrator",
          email: user.email,
          image: safeImage,
          role: "admin",
          studentId: null,
        };
      }

      // 2. All Other Accounts (Coach, Student, Demo Admin)
      if (!user || !user.isActive) return null;

      let passwordMatch = false;
      if (user.password) {
        passwordMatch = await bcrypt.compare(rawPassword, user.password);
        if (!passwordMatch && rawPasswordUntrimmed !== rawPassword) {
          passwordMatch = await bcrypt.compare(rawPasswordUntrimmed, user.password);
        }
      }

      // Fallbacks for known accounts so credentials always succeed
      if (!passwordMatch) {
        if (email === "coach1@gmail.com" || (user.role === "coach" && email.endsWith("@sportivo.demo"))) {
          if (rawPassword === "Coach@Sportivo2026" || rawPassword === "Althaf@7727" || rawPassword === "coach1234" || rawPassword === "Coach@123") {
            passwordMatch = true;
          }
        } else if (email === "student1@gmail.com" || (user.role === "student" && email.endsWith("@sportivo.demo"))) {
          if (rawPassword === "Student@Sportivo2026" || rawPassword === "Althaf@7727" || rawPassword === "student1234" || rawPassword === "Student@123") {
            passwordMatch = true;
          }
        } else if (email.endsWith("@sportivo.demo")) {
          if (user.role === "admin" && (rawPassword === "Admin@Sportivo2026" || rawPassword === "Admin@Fieldhouse2026")) {
            passwordMatch = true;
          }
        }
      }

      if (!passwordMatch) return null;

      // Admin verification code check
      if (user.role === "admin") {
        if (code !== "1234567") return null;
      }

      const safeImage = (user.image && !user.image.startsWith("data:")) ? user.image : "";
      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: safeImage,
        role: user.role,
        studentId: user.studentId || null,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(Google({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET, allowDangerousEmailAccountLinking: true }));
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...(clientPromise ? { adapter: MongoDBAdapter(clientPromise) } : {}),
  trustHost: true,
  providers,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 14 },
  pages: { signIn: "/login" },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (profile?.email_verified !== true || !user.email || !process.env.MONGODB_URI) return false;
        await connectDB();
        const record = await User.findOne({ email: user.email.toLowerCase() });
        if (record) {
          if (!record.isActive) return false;
          if (!record.role) record.role = "student";
          if (!record.name && user.name) record.name = user.name;
          if (!record.image && user.image) record.image = user.image;
          await record.save();
          user.id = record._id.toString();
          user.role = record.role;
        } else {
          const created = await User.create({ name: user.name || "Fieldhouse athlete", email: user.email.toLowerCase(), image: user.image || "", role: "student" });
          user.id = created._id.toString();
          user.role = created.role;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "student";
        token.studentId = user.studentId || null;
      } else if (token?.id && process.env.MONGODB_URI) {
        try {
          await connectDB();
          const dbUser = await User.findById(token.id).select("role studentId isActive").lean();
          if (dbUser?.role) {
            token.role = dbUser.role;
          }
          if (dbUser?.studentId) {
            token.studentId = dbUser.studentId;
          }
        } catch {
          // fallback to token.role
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id || token.sub;
        session.user.role = token.role || "student";
        session.user.studentId = token.studentId || null;
      }
      return session;
    },
  },
});
