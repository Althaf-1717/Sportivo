import { Suspense } from "react";
import { redirect } from "next/navigation";
import AuthForm from "@/components/forms/AuthForm";
import AuthAnimatedPanel from "@/components/auth/AuthAnimatedPanel";
import { currentUser } from "@/lib/server-auth";

export const metadata = {
  title: "Student Sign In | Sportivo Athletic Academy",
  robots: { index: false },
};

export default async function LoginPage({ searchParams }) {
  const resolvedParams = searchParams ? await searchParams : {};

  // Redirect coach or admin attempts from old queries or callbacks to their dedicated URLs
  if (resolvedParams?.portal === "coach" || resolvedParams?.callbackUrl?.includes("/coach")) {
    redirect("/coach");
  }
  if (resolvedParams?.portal === "admin" || resolvedParams?.callbackUrl?.includes("/admin")) {
    redirect("/admin");
  }

  // If already authenticated, redirect to appropriate role dashboard
  const user = await currentUser();
  if (user) {
    if (user.role === "admin") redirect("/dashboard/admin");
    if (user.role === "coach") redirect("/dashboard/coach");
    redirect("/dashboard/student");
  }

  const databaseConfigured = Boolean(process.env.MONGODB_URI);
  const googleEnabled = Boolean(
    databaseConfigured &&
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET
  );

  return (
    <main className="flex min-h-screen bg-white">
      <AuthAnimatedPanel mode="login" portal="student" />
      <section className="relative flex flex-1 flex-col items-center justify-center px-6 py-10 sm:px-12">
        <Suspense
          fallback={
            <div className="h-[520px] w-full max-w-[440px] animate-pulse rounded-3xl bg-stone-100" />
          }
        >
          <AuthForm
            mode="login"
            portal="student"
            databaseConfigured={databaseConfigured}
            googleEnabled={googleEnabled}
          />
        </Suspense>
      </section>
    </main>
  );
}
