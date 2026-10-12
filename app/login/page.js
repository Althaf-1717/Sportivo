import { Suspense } from "react";
import AuthForm from "@/components/forms/AuthForm";
import AuthAnimatedPanel from "@/components/auth/AuthAnimatedPanel";

export const metadata = { title: "Sign in", robots: { index: false } };

export default function LoginPage() {
  const databaseConfigured = Boolean(process.env.MONGODB_URI);
  const googleEnabled = Boolean(
    databaseConfigured &&
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET
  );
  return (
    <main className="flex min-h-screen bg-white">
      <AuthAnimatedPanel mode="login" />
      <section className="relative flex flex-1 flex-col items-center justify-center px-6 py-10 sm:px-12">
        <Suspense
          fallback={
            <div className="h-[520px] w-full max-w-[440px] animate-pulse rounded-3xl bg-stone-100" />
          }
        >
          <AuthForm
            mode="login"
            databaseConfigured={databaseConfigured}
            googleEnabled={googleEnabled}
          />
        </Suspense>
      </section>
    </main>
  );
}
