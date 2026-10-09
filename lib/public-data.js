import { sportsCatalog, coachesCatalog, planCatalog } from "@/data/catalog";

const memCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60s in-memory cache

function getCached(key) {
  const item = memCache.get(key);
  if (item && Date.now() - item.time < CACHE_TTL_MS) {
    return item.data;
  }
  return null;
}

function setCached(key, data) {
  memCache.set(key, { data, time: Date.now() });
}

function withTimeout(promise, ms = 2000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("DB Timeout")), ms)),
  ]);
}

async function getModelData(modelName, query, fallback) {
  const cached = getCached(modelName);
  if (cached) return cached;

  if (!process.env.MONGODB_URI) return fallback;
  try {
    const data = await withTimeout(
      (async () => {
        const [{ connectDB }, models] = await Promise.all([
          import("@/lib/mongodb"),
          import("@/models"),
        ]);
        await connectDB();
        const model = models[modelName];
        if (!model) return fallback;
        const result = await model.find(query).lean();
        return result.length ? JSON.parse(JSON.stringify(result)) : fallback;
      })(),
      2500
    );
    setCached(modelName, data);
    return data;
  } catch (error) {
    console.error(`Could not load public ${modelName} data:`, error.message);
    return fallback;
  }
}

export async function getSports() {
  return getModelData("Sport", { isActive: true }, sportsCatalog);
}

export async function getCoaches() {
  const cached = getCached("Coaches");
  if (cached) return cached;

  if (!process.env.MONGODB_URI) return coachesCatalog;
  try {
    const data = await withTimeout(
      (async () => {
        const [{ connectDB }, { Coach }] = await Promise.all([
          import("@/lib/mongodb"),
          import("@/models"),
        ]);
        await connectDB();
        const result = await Coach.find({ isActive: true })
          .populate("user", "name image email")
          .populate("sports", "name slug")
          .lean();
        if (!result.length) return coachesCatalog;
        return JSON.parse(
          JSON.stringify(
            result.map((coach) => ({
              ...coach,
              userId: coach.user?._id,
              image: coach.user?.image || coach.image || "",
              name: coach.user?.name || "Sportivo coach",
              initials: (coach.user?.name || "SC")
                .split(" ")
                .map((word) => word[0])
                .slice(0, 2)
                .join(""),
              sport: coach.sports?.map((sport) => sport.name).join(" · ") || coach.specialization,
            }))
          )
        );
      })(),
      2500
    );
    setCached("Coaches", data);
    return data;
  } catch (error) {
    console.error("Could not load public Coach data:", error.message);
    return coachesCatalog;
  }
}

export async function getMembershipPlans() {
  const cached = getCached("Plans");
  if (cached) return cached;

  if (!process.env.MONGODB_URI) return planCatalog;
  try {
    const data = await withTimeout(
      (async () => {
        const [{ connectDB }, { MembershipPlan }] = await Promise.all([
          import("@/lib/mongodb"),
          import("@/models"),
        ]);
        await connectDB();
        const result = await MembershipPlan.find({ isActive: true })
          .populate("sport", "name slug")
          .lean();
        if (!result.length) return planCatalog;
        return JSON.parse(
          JSON.stringify(
            result.map((plan) => ({
              ...plan,
              durationLabel: `${plan.duration} ${plan.duration === 1 ? "month" : "months"}`,
            }))
          )
        );
      })(),
      2500
    );
    setCached("Plans", data);
    return data;
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
