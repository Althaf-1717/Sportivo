import { Suspense } from "react";
import { redirect } from "next/navigation";
import AuthForm from "@/components/forms/AuthForm";
import AuthAnimatedPanel from "@/components/auth/AuthAnimatedPanel";
import { currentUser } from "@/lib/server-auth";

export const metadata = {
  title: "Admin Sign In | Sportivo Athletic Academy",
  robots: { index: false },
};

export default async function AdminLoginPage() {
  const user = await currentUser();
  if (user) {
    if (user.role === "admin") redirect("/dashboard/admin");
    if (user.role === "coach") redirect("/dashboard/coach");
    redirect("/dashboard/student");
  }

  const databaseConfigured = Boolean(process.env.MONGODB_URI);

  return (
    <main className="flex min-h-screen bg-white">
      <AuthAnimatedPanel mode="login" portal="admin" />
      <section className="relative flex flex-1 flex-col items-center justify-center px-6 py-10 sm:px-12">
        <Suspense
          fallback={
            <div className="h-[520px] w-full max-w-[440px] animate-pulse rounded-3xl bg-stone-100" />
          }
        >
          <AuthForm
            mode="login"
            portal="admin"
            databaseConfigured={databaseConfigured}
          />
        </Suspense>
      </section>
    </main>
  );
}
