import { Suspense } from "react";
import AuthForm from "@/components/forms/AuthForm";
import AuthAnimatedPanel from "@/components/auth/AuthAnimatedPanel";

export const metadata = { title: "Join the academy", robots: { index: false } };

export default function RegisterPage() {
  const databaseConfigured = Boolean(process.env.MONGODB_URI);
  const googleEnabled = Boolean(
    databaseConfigured &&
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET
  );
  return (
    <main className="flex min-h-screen bg-white">
      <AuthAnimatedPanel mode="register" />
      <section className="relative flex flex-1 flex-col items-center justify-center px-6 py-10 sm:px-12">
        <Suspense
          fallback={
            <div className="h-[420px] w-full max-w-[420px] animate-pulse rounded-3xl bg-stone-100" />
          }
        >
          <AuthForm
            mode="register"
            databaseConfigured={databaseConfigured}
            googleEnabled={googleEnabled}
          />
        </Suspense>
      </section>
    </main>
  );
}
