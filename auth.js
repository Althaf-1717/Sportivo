import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { findFallbackUser, saveFallbackUser } from "@/lib/fallback-users";

const providers = [
  Credentials({
    name: "Email and password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
      code: { label: "Code", type: "text" },
      googleName: { label: "Google Name", type: "text" },
      portal: { label: "Portal", type: "text" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;
      
      const email = String(credentials.email).toLowerCase().trim();
      const rawPassword = String(credentials.password || "").trim();
      const rawPasswordUntrimmed = String(credentials.password || "");
      const code = String(credentials.code || "").trim();
      const googleName = String(credentials.googleName || "").trim();
      const portal = String(credentials.portal || "student").trim().toLowerCase();

      let user = null;
      let dbConnected = false;

      // Safely attempt to find user in MongoDB
      try {
        if (process.env.MONGODB_URI) {
          await connectDB();
          dbConnected = true;
          user = await User.findOne({ email }).select("+password");
        }
      } catch (dbErr) {
        console.warn("MongoDB unavailable in authorize:", dbErr.message);
      }

      // If user not in MongoDB, check in-memory fallback store
      if (!user) {
        user = findFallbackUser(email);
      }

      // 1. Google Quick Student Sign-Up / Sign-In
      if (rawPassword === "GoogleOAuth@Sportivo2026") {
        const derivedName =
          googleName ||
          (email === "althafshaik1717@gmail.com" ? "Shaik Althaf" : "") ||
          email
            .split("@")[0]
            .replace(/[._-]+/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()) ||
          "Sportivo Athlete";

        if (dbConnected && User) {
          try {
            if (!user) {
              const lastStudent = await User.findOne({ studentId: { $exists: true, $ne: null } })
                .sort({ studentId: -1 })
                .select("studentId")
                .lean();
              const studentId = lastStudent?.studentId ? Math.max(Number(lastStudent.studentId) + 1, 10001) : 10001;
              const hash = await bcrypt.hash("GoogleOAuth@Sportivo2026", 12);
              user = await User.create({
                name: derivedName,
                email,
                password: hash,
                role: "student",
                studentId,
                isActive: true,
              });
            } else {
              let needsSave = false;
              if (!user.isActive) { user.isActive = true; needsSave = true; }
              if (googleName && (!user.name || user.name === "Master Administrator")) {
                user.name = googleName;
                needsSave = true;
              }
              if (!user.studentId) {
                const lastStudent = await User.findOne({ studentId: { $exists: true, $ne: null } })
                  .sort({ studentId: -1 })
                  .select("studentId")
                  .lean();
                user.studentId = lastStudent?.studentId ? Math.max(Number(lastStudent.studentId) + 1, 10001) : 10001;
                needsSave = true;
              }
              if (needsSave && typeof user.save === "function") await user.save();
            }
          } catch (err) {
            console.warn("Could not save Google quick user in DB:", err.message);
          }
        }

        const safeId = user?._id?.toString() || "google_" + Date.now();
        const safeName = user?.name || derivedName;
        const safeStudentId = user?.studentId || 10001;

        return {
          id: safeId,
          name: safeName,
          email,
          image: "",
          role: "student",
          studentId: safeStudentId,
        };
      }

      // 2. Master Admin / Personal Email Handling (althafshaik1717@gmail.com)
      if (email === "althafshaik1717@gmail.com") {
        const isAdminPass =
          rawPassword === "Althaf@7727" ||
          rawPassword === "Althaf7727" ||
          (user?.password && (
            (await bcrypt.compare(rawPassword, user.password)) ||
            (await bcrypt.compare(rawPasswordUntrimmed, user.password))
          ));

        if (!isAdminPass) return null;

        // If signing in via Coach portal, althafshaik1717@gmail.com is not a coach
        if (portal === "coach") return null;

        // If signing in via Admin portal (or 7-digit code provided), authenticate into Master Admin Portal
        if (portal === "admin" || code === "1234567") {
          if (code !== "1234567") return null;
          
          if (dbConnected && User && (!user || typeof user.save === "function")) {
            try {
              if (!user) {
                const hash = await bcrypt.hash("Althaf@7727", 12);
                user = await User.create({
                  name: "Shaik Althaf",
                  email: "althafshaik1717@gmail.com",
                  password: hash,
                  role: "admin",
                  isActive: true,
                });
              } else if (typeof user.save === "function") {
                let needsSave = false;
                if (!user.isActive) { user.isActive = true; needsSave = true; }
                if (user.role !== "admin") { user.role = "admin"; needsSave = true; }
                if (needsSave) await user.save();
              }
            } catch (err) {
              console.warn("DB save skipped for admin:", err.message);
            }
          }

          return {
            id: user?._id?.toString() || "admin_althaf_1717",
            name: user?.name || "Shaik Althaf",
            email: "althafshaik1717@gmail.com",
            image: "",
            role: "admin",
            studentId: null,
          };
        }

        // If signing in via Student portal (/login)
        return {
          id: user?._id?.toString() || "student_althaf_1717",
          name: user?.name || "Shaik Althaf",
          email: "althafshaik1717@gmail.com",
          image: "",
          role: "student",
          studentId: user?.studentId || 10001,
        };
      }

      // 3. Fallback / Seed Accounts (Coach, Student, Demo Admin)
      let passwordMatch = false;

      if (user?.password) {
        passwordMatch = await bcrypt.compare(rawPassword, user.password);
        if (!passwordMatch && rawPasswordUntrimmed !== rawPassword) {
          passwordMatch = await bcrypt.compare(rawPasswordUntrimmed, user.password);
        }
      }

      // Master fallbacks for demo & standard credentials
      if (!passwordMatch) {
        if (email === "coach1@gmail.com" || email === "coach@sportivo.demo" || (user?.role === "coach")) {
          if (
            rawPassword === "Coach@Sportivo2026" ||
            rawPassword === "Althaf@7727" ||
            rawPassword === "coach1234" ||
            rawPassword === "Coach@123"
          ) {
            passwordMatch = true;
            if (!user) {
              user = {
                _id: "coach_seed_1",
                name: "Coach Arjun Menon",
                email,
                role: "coach",
                isActive: true,
              };
            }
          }
        } else if (email === "student1@gmail.com" || email === "student@sportivo.demo" || (user?.role === "student")) {
          if (
            rawPassword === "Student@Sportivo2026" ||
            rawPassword === "Althaf@7727" ||
            rawPassword === "student1234" ||
            rawPassword === "Student@123"
          ) {
            passwordMatch = true;
            if (!user) {
              user = {
                _id: "student_seed_1",
                name: "Student Athlete",
                email,
                role: "student",
                studentId: 10001,
                isActive: true,
              };
            }
          }
        } else if (email === "admin@sportivo.demo") {
          if (rawPassword === "Admin@Sportivo2026" || rawPassword === "Althaf@7727") {
            passwordMatch = true;
            if (!user) {
              user = {
                _id: "admin_seed_1",
                name: "Academy Director",
                email,
                role: "admin",
                isActive: true,
              };
            }
          }
        }
      }

      if (!passwordMatch || !user || user.isActive === false) return null;

      // Enforce portal-specific role checks:
      if (portal === "admin") {
        if (user.role !== "admin" || code !== "1234567") return null;
      } else if (portal === "coach") {
        if (user.role !== "coach") return null;
      } else if (portal === "student") {
        if (user.role !== "student") return null;
      }

      const safeId = user._id ? user._id.toString() : "user_" + Date.now();
      const safeImage = (user.image && !user.image.startsWith("data:")) ? user.image : "";

      return {
        id: safeId,
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
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
      allowDangerousEmailAccountLinking: true,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 14 },
  pages: { signIn: "/login" },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        const email = user.email.toLowerCase().trim();
        user.role = "student";
        user.studentId = 10001;

        if (process.env.MONGODB_URI) {
          try {
            await connectDB();
            let record = await User.findOne({ email });
            if (record) {
              if (!record.isActive) return false;
              let needsSave = false;
              if (!record.role) {
                record.role = "student";
                needsSave = true;
              }
              if (record.role === "student" && !record.studentId) {
                const lastStudent = await User.findOne({ studentId: { $exists: true, $ne: null } })
                  .sort({ studentId: -1 })
                  .select("studentId")
                  .lean();
                record.studentId = lastStudent?.studentId ? Math.max(Number(lastStudent.studentId) + 1, 10001) : 10001;
                needsSave = true;
              }
              if (user.image && !record.image) {
                record.image = user.image;
                needsSave = true;
              }
              if (needsSave) await record.save();
              user.id = record._id.toString();
              user.role = record.role;
              user.studentId = record.studentId || null;
            } else {
              const lastStudent = await User.findOne({ studentId: { $exists: true, $ne: null } })
                .sort({ studentId: -1 })
                .select("studentId")
                .lean();
              const studentId = lastStudent?.studentId ? Math.max(Number(lastStudent.studentId) + 1, 10001) : 10001;
              const created = await User.create({
                name: user.name || email.split("@")[0],
                email,
                image: user.image || "",
                role: "student",
                studentId,
                isActive: true,
              });
              user.id = created._id.toString();
              user.role = created.role;
              user.studentId = created.studentId;
            }
          } catch (err) {
            console.warn("Could not sync Google user to MongoDB in signIn callback:", err.message);
          }
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "student";
        token.studentId = user.studentId || null;
      } else if (!token?.role && token?.id && process.env.MONGODB_URI) {
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
          // fallback
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
