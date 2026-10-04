import { sportsCatalog, coachesCatalog, planCatalog } from "@/data/catalog";

async function getModelData(modelName, query, fallback) {
  if (!process.env.MONGODB_URI) return fallback;
  try {
    const [{ connectDB }, models] = await Promise.all([
      import("@/lib/mongodb"),
      import("@/models"),
    ]);
    await connectDB();
    const model = models[modelName];
    if (!model) return fallback;
    const result = await model.find(query).lean();
    return result.length ? JSON.parse(JSON.stringify(result)) : fallback;
  } catch (error) {
    console.error(`Could not load public ${modelName} data:`, error.message);
    return fallback;
  }
}

export async function getSports() {
  return getModelData("Sport", { isActive: true }, sportsCatalog);
}

export async function getCoaches() {
  if (!process.env.MONGODB_URI) return coachesCatalog;
  try {
    const [{ connectDB }, { Coach }] = await Promise.all([import("@/lib/mongodb"), import("@/models")]);
    await connectDB();
    const result = await Coach.find({ isActive: true }).populate("user", "name image email").populate("sports", "name slug").lean();
    return JSON.parse(JSON.stringify(result.map((coach) => ({
      ...coach,
      userId: coach.user?._id,
      image: coach.user?.image || coach.image || "",
      name: coach.user?.name || "Sportivo coach",
      initials: (coach.user?.name || "SC").split(" ").map((word) => word[0]).slice(0, 2).join(""),
      sport: coach.sports?.map((sport) => sport.name).join(" · ") || coach.specialization,
    }))));
  } catch (error) {
    console.error("Could not load public Coach data:", error.message);
    return coachesCatalog;
  }
}

export async function getMembershipPlans() {
  if (!process.env.MONGODB_URI) return planCatalog;
  try {
    const [{ connectDB }, { MembershipPlan }] = await Promise.all([import("@/lib/mongodb"), import("@/models")]);
    await connectDB();
    const result = await MembershipPlan.find({ isActive: true }).populate("sport", "name slug").lean();
    if (!result.length) return planCatalog;
    return JSON.parse(JSON.stringify(result.map((plan) => ({ ...plan, durationLabel: `${plan.duration} ${plan.duration === 1 ? "month" : "months"}` }))));
  } catch (error) {
    console.error("Could not load public MembershipPlan data:", error.message);
    return planCatalog;
  }
}

export async function getSportBySlug(slug) {
  const all = await getSports();
  return all.find((item) => item.slug === slug || String(item._id) === slug) || null;
}

export async function getCoachBySlug(slug) {
  const all = await getCoaches();
  return all.find((item) => item.slug === slug || String(item._id) === slug) || null;
}
