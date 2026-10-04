import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();
import bcrypt from "bcryptjs";
import { connectDB } from "../lib/mongodb.js";
import { sportsCatalog, coachesCatalog, planCatalog } from "../data/catalog.js";
import { Attendance, Coach, Enrollment, MembershipPlan, Notification, Payment, Progress, Sport, User } from "../models/index.js";

const DEMO_PASSWORDS = {
  student: process.env.DEMO_STUDENT_PASSWORD || "Student@Sportivo2026",
  coach: process.env.DEMO_COACH_PASSWORD || "Coach@Sportivo2026",
  admin: process.env.DEMO_ADMIN_PASSWORD || "Admin@Sportivo2026",
};

async function upsertDemoUser({ name, email, role, password, phone = "", studentId }) {
  const passwordHash = await bcrypt.hash(password, 12);
  const setFields = { name, email, role, phone, password: passwordHash, isActive: true };
  if (studentId) setFields.studentId = studentId;
  return User.findOneAndUpdate({ email }, { $set: setFields }, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true });
}

async function seed() {
  if (process.env.NODE_ENV === "production") throw new Error("The demo seed script is disabled in production.");
  await connectDB();
  const sportsBySlug = new Map();
  for (const item of sportsCatalog) {
    const sport = await Sport.findOneAndUpdate({ slug: item.slug }, { $set: { ...item, isActive: true } }, { new: true, upsert: true, runValidators: true });
    sportsBySlug.set(item.slug, sport);
  }

  const coachesBySlug = new Map();
  for (const coachInfo of coachesCatalog) {
    const sport = sportsBySlug.get(coachInfo.sport.toLowerCase());
    const account = await upsertDemoUser({ name: coachInfo.name, email: `${coachInfo.slug}@sportivo.demo`, role: "coach", password: DEMO_PASSWORDS.coach });
    const coach = await Coach.findOneAndUpdate({ user: account._id }, { $set: { slug: coachInfo.slug, bio: coachInfo.bio, experience: Number.parseInt(coachInfo.experience, 10) || 0, specialization: coachInfo.role, certifications: ["Sportivo coaching programme"], sports: sport ? [sport._id] : [], isActive: true } }, { new: true, upsert: true, runValidators: true });
    coachesBySlug.set(coachInfo.slug, { account, coach });
  }

  const plansByNameSport = new Map();
  for (const sport of sportsCatalog) {
    const sportRecord = sportsBySlug.get(sport.slug);
    for (const planInfo of planCatalog) {
      const slug = `${planInfo.slug}-${sport.slug}`;
      const plan = await MembershipPlan.findOneAndUpdate({ slug }, { $set: { name: planInfo.name, slug, sport: sportRecord._id, duration: planInfo.duration, price: planInfo.price, description: planInfo.description, features: planInfo.features, isActive: true } }, { new: true, upsert: true, runValidators: true });
      plansByNameSport.set(`${planInfo.slug}-${sport.slug}`, plan);
    }
  }

  const admin = await upsertDemoUser({ name: "Sportivo Administrator", email: "admin@sportivo.demo", role: "admin", password: DEMO_PASSWORDS.admin });
  const student = await upsertDemoUser({ name: "Aarav Patel", email: "student@sportivo.demo", role: "student", password: DEMO_PASSWORDS.student, phone: "+91 98765 43210", studentId: 10001 });
  const cricket = sportsBySlug.get("cricket");
  const standard = plansByNameSport.get("standard-cricket");
  const coachAccount = coachesBySlug.get("arjun-menon").account;

  // These local seed records make the development dashboards easy to demonstrate.
  // They are synthetic training data, not a real Razorpay payment.
  const payment = await Payment.findOneAndUpdate({ razorpayOrderId: "order_demo_sportivo_001" }, { $set: { student: student._id, membershipPlan: standard._id, sport: cricket._id, coach: coachAccount._id, razorpayPaymentId: "pay_demo_sportivo_001", razorpaySignature: "local-seed-record-not-a-live-signature", amount: standard.price, currency: "INR", status: "successful" } }, { new: true, upsert: true, runValidators: true });
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 28);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + standard.duration);
  const enrollment = await Enrollment.findOneAndUpdate({ payment: payment._id }, { $set: { student: student._id, sport: cricket._id, coach: coachAccount._id, membershipPlan: standard._id, payment: payment._id, startDate, endDate, status: "active", paymentStatus: "successful" } }, { new: true, upsert: true, runValidators: true });
  payment.enrollment = enrollment._id;
  await payment.save();

  for (const [index, daysAgo] of [1, 4, 8, 12, 17, 22, 26].entries()) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setUTCHours(0, 0, 0, 0);
    await Attendance.findOneAndUpdate({ student: student._id, enrollment: enrollment._id, date }, { $set: { student: student._id, enrollment: enrollment._id, coach: coachAccount._id, sport: cricket._id, date, status: index === 3 ? "absent" : "present", remarks: index === 3 ? "Rest day. Pick up where you left off next session." : "Good focus and consistent effort." } }, { upsert: true, new: true, runValidators: true });
  }

  const reviews = [
    { daysAgo: 25, skillLevel: "Beginner", fitnessScore: 48, technicalScore: 44, performanceScore: 46, remarks: "A strong start. Keep building the batting stance and balance.", trainingNotes: "Development demo review 1" },
    { daysAgo: 14, skillLevel: "Beginner", fitnessScore: 56, technicalScore: 54, performanceScore: 57, remarks: "More confidence in footwork and a good response to feedback.", trainingNotes: "Development demo review 2" },
    { daysAgo: 3, skillLevel: "Intermediate", fitnessScore: 65, technicalScore: 63, performanceScore: 68, remarks: "The timing is coming along. Next focus: keep shape through the shot.", trainingNotes: "Development demo review 3" },
  ];
  for (const item of reviews) {
    if (await Progress.exists({ student: student._id, trainingNotes: item.trainingNotes })) continue;
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - item.daysAgo);
    await Progress.create({ student: student._id, enrollment: enrollment._id, coach: coachAccount._id, sport: cricket._id, skillLevel: item.skillLevel, fitnessScore: item.fitnessScore, technicalScore: item.technicalScore, performanceScore: item.performanceScore, overallProgress: Math.round((item.fitnessScore + item.technicalScore + item.performanceScore) / 3), remarks: item.remarks, trainingNotes: item.trainingNotes, createdAt, updatedAt: createdAt });
  }

  for (const [title, message, type] of [["Welcome to Sportivo", "Your Standard membership is active. See you at training.", "enrollment"], ["Payment successful", "Your local development membership record is ready.", "payment"]]) {
    await Notification.updateOne({ user: student._id, title }, { $setOnInsert: { user: student._id, title, message, type } }, { upsert: true });
  }

  console.log("Sportivo demo data is ready.");
  console.log(`Admin: ${admin.email}`);
  console.log(`Student: ${student.email}`);
  console.log(`Coaches: ${coachesCatalog.map((item) => `${item.name} (${item.slug}@sportivo.demo)`).join(", ")}`);
  console.log("Use the development-only passwords documented in README.md.");
}

seed().then(() => process.exit(0)).catch((error) => { console.error("Could not seed the Sportivo database:", error.message); process.exit(1); });
