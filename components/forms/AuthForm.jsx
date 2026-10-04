"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

export default function AuthForm({ mode = "login", googleEnabled = false, databaseConfigured = false }) {
  const register = mode === "register";
  const router = useRouter();
  const params = useSearchParams();

  const requestedCallback = params.get("callbackUrl") || "";
  const portalFromQuery = params.get("portal") || "";

  // Determine initial portal: admin, coach, or student (default)
  const initialPortal = portalFromQuery || (
    requestedCallback.includes("/dashboard/admin") || requestedCallback.includes("/admin")
      ? "admin"
      : requestedCallback.includes("/dashboard/coach") || requestedCallback.includes("/coach") || requestedCallback.includes("/dashboard/coaches")
      ? "coach"
      : "student"
  );

  const [activePortal, setActivePortal] = useState(initialPortal);
  const [email, setEmail] = useState(() => params.get("email") || (initialPortal === "admin" ? "althafshaik1717@gmail.com" : ""));
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // 2FA Admin 7-digit code state
  const [adminCodeStep, setAdminCodeStep] = useState(false);
  const [adminCode, setAdminCode] = useState("");

  const registeredSuccess = params.get("registered") === "1";

  // Switch portal and adjust defaults
  function switchPortal(portal) {
    setActivePortal(portal);
    setError("");
    setAdminCodeStep(false);
    if (portal === "admin") {
      if (!email || email.includes("student") || email.includes("coach")) {
        setEmail("althafshaik1717@gmail.com");
      }
    }
  }

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (!databaseConfigured) {
      setError("Account access needs MongoDB. Add MONGODB_URI to .env.local and restart the app.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const inputName = String(form.get("name") || "").trim();
    const inputEmail = String(form.get("email") || email || "").trim().toLowerCase();
    const inputPassword = String(form.get("password") || password || "");

    // 1. Student Registration Mode
    if (register) {
      setBusy(true);
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: inputName,
            email: inputEmail,
            password: inputPassword,
            role: "student",
          }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Could not create your account.");

        router.push(`/login?registered=1&portal=student&email=${encodeURIComponent(inputEmail)}`);
        return;
      } catch (submitError) {
        setError(submitError.message || "Something went wrong. Please try again.");
      } finally {
        setBusy(false);
      }
      return;
    }

    // 2. Admin Check: if portal is admin OR email is althafshaik1717@gmail.com
    if (activePortal === "admin" || inputEmail === "althafshaik1717@gmail.com") {
      if (inputEmail !== "althafshaik1717@gmail.com") {
        setError("Admin portal login is restricted to althafshaik1717@gmail.com.");
        return;
      }
      setEmail(inputEmail);
      setPassword(inputPassword);
      setAdminCodeStep(true);
      return;
    }

    // 3. Regular Login: Coach or Student
    setBusy(true);
    try {
      const result = await signIn("credentials", {
        email: inputEmail,
        password: inputPassword,
        redirect: false,
      });

      if (result?.error) {
        if (activePortal === "coach") {
          throw new Error("Coach email or password didn’t match. Make sure Admin has added your access.");
        }
        throw new Error("Email or password didn’t match. Check your details and try again.");
      }

      // Determine clean redirect destination
      let destination = "/dashboard";
      if (activePortal === "coach") {
        destination = "/dashboard/coach";
      } else if (requestedCallback?.startsWith("/") && !requestedCallback.startsWith("//") && !requestedCallback.includes("\\")) {
        destination = requestedCallback;
      } else {
        destination = "/dashboard/student";
      }

      router.push(destination);
      router.refresh();
    } catch (submitError) {
      setError(submitError.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  // 4. Verify 7-digit code for Admin
  async function submitAdminCode(event) {
    event.preventDefault();
    setError("");

    if (adminCode.trim() !== "1234567") {
      setError("Please enter 7 digit of code (the code is 1234567).");
      return;
    }

    setBusy(true);
    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        code: "1234567",
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Admin email or password didn’t match. Please check your credentials.");
      }

      router.push("/dashboard/admin");
      router.refresh();
    } catch (submitError) {
      setError(submitError.message || "Sign in failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function googleSignIn() {
    setError("");
    const callbackUrl = activePortal === "coach" ? "/dashboard/coach" : activePortal === "admin" ? "/dashboard/admin" : "/dashboard/student";
    await signIn("google", { callbackUrl });
  }

  return (
    <div className="w-full max-w-[440px]">
      <Link href="/" className="mb-6 inline-flex items-center gap-2.5">
        <img src="/images/sportivo-logo.png" alt="Sportivo Logo" className="h-10 w-10 rounded-xl object-cover shadow-xs" />
        <span>
          <span className="block text-[15px] font-black tracking-[-.04em] text-navy">SPORT<span className="text-orange">IVO</span></span>
          <span className="block text-[8px] font-bold tracking-[.2em] text-slate-400">SPORTS ACADEMY</span>
        </span>
      </Link>

      {/* PORTAL SELECTOR TABS (for login mode) */}
      {!register && !adminCodeStep && (
        <div className="mb-6 grid grid-cols-3 gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => switchPortal("student")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-bold transition ${
              activePortal === "student" ? "bg-white text-navy shadow-xs" : "text-slate-500 hover:text-navy"
            }`}
          >
            <UserRound size={13} className={activePortal === "student" ? "text-blue" : ""} />
            <span>Student</span>
          </button>

          <button
            type="button"
            onClick={() => switchPortal("coach")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-bold transition ${
              activePortal === "coach" ? "bg-white text-navy shadow-xs" : "text-slate-500 hover:text-navy"
            }`}
          >
            <Activity size={13} className={activePortal === "coach" ? "text-orange" : ""} />
            <span>Coach</span>
          </button>

          <button
            type="button"
            onClick={() => switchPortal("admin")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-bold transition ${
              activePortal === "admin" ? "bg-white text-navy shadow-xs" : "text-slate-500 hover:text-navy"
            }`}
          >
            <ShieldCheck size={13} className={activePortal === "admin" ? "text-emerald-600" : ""} />
            <span>Admin</span>
          </button>
        </div>
      )}

      {/* ADMIN 7-DIGIT CODE VERIFICATION STEP */}
      {adminCodeStep ? (
        <div className="animate-fadeIn">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange/20 bg-orange/10 px-3 py-1 text-[11px] font-bold text-orange">
            <ShieldCheck size={14} /> Admin Security Check
          </div>
          <h1 className="text-[28px] font-bold tracking-[-.04em] text-navy">
            Please enter 7 digit of code
          </h1>
          <p className="mt-2 text-xs leading-6 text-slate-500">
            For admin account <strong className="text-navy">{email}</strong>, enter the 7-digit verification code to complete sign-in.
          </p>

          <form onSubmit={submitAdminCode} className="mt-6 grid gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                7-Digit Verification Code
              </label>
              <div className="relative mx-auto max-w-[260px]">
                <KeyRound size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange" />
                <input
                  type="text"
                  maxLength={7}
                  inputMode="numeric"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="1234567"
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-center text-xl font-bold tracking-[0.25em] text-navy focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                  required
                  autoFocus
                />
              </div>
              <p className="mt-2 text-[10px] text-slate-400">
                Code is: <strong className="text-navy font-mono">1234567</strong>
              </p>
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-red-50 px-3 py-2.5 text-[11px] leading-5 text-red-700">
                {error}
              </p>
            )}

            <button
              disabled={busy}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
            >
              {busy ? "Verifying code…" : "Verify & Sign in to Admin"} {!busy && <ArrowRight size={14} />}
            </button>

            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setAdminCodeStep(false);
                setError("");
              }}
              className="inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-navy transition"
            >
              <ArrowLeft size={13} /> Back to email & password
            </button>
          </form>
        </div>
      ) : (
        /* STANDARD LOGIN / REGISTRATION FORM */
        <div>
          <p className="eyebrow">
            {register
              ? "Create Student Account"
              : activePortal === "coach"
              ? "Coach Portal Login"
              : activePortal === "admin"
              ? "Admin Portal Login"
              : "Student Athlete Sign-In"}
          </p>

          <h1 className="mt-2 text-[30px] font-bold tracking-[-.05em] text-navy">
            {register
              ? "Sign Up."
              : activePortal === "coach"
              ? "Coach sign-in."
              : activePortal === "admin"
              ? "Admin sign-in."
              : "Good to see you again."}
          </h1>

          <p className="mt-2 text-xs leading-6 text-slate-500">
            {register
              ? "Create your student account with your name, email, and password."
              : activePortal === "coach"
              ? "Sign in with the coach credentials created by Admin to access your workspace."
              : activePortal === "admin"
              ? "Sign in with your master Admin credentials to manage operations, coaches, sports, and finances."
              : "Sign in to check your training, progress, and next session."}
          </p>

          {/* Success banner after registering */}
          {!register && registeredSuccess && (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-emerald-900 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>Account created successfully!</span>
              </div>
              <p className="mt-1 text-[11px] leading-5 text-emerald-700">
                Please sign in with your email and password to begin your student onboarding.
              </p>
            </div>
          )}

          {!databaseConfigured && (
            <p role="status" className="mt-5 rounded-lg border border-orange/20 bg-orange/5 px-3 py-2.5 text-[10px] leading-5 text-slate-600">
              Account access needs MongoDB. Add <code className="font-semibold text-navy">MONGODB_URI</code> to <code className="font-semibold text-navy">.env.local</code> and restart the app.
            </p>
          )}

          {googleEnabled && activePortal === "student" && (
            <button onClick={googleSignIn} type="button" className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-navy transition hover:bg-slate-50">
              <span className="grid h-5 w-5 place-items-center rounded-full border border-slate-200 text-[10px] font-bold text-blue">G</span> Continue with Google
            </button>
          )}

          {googleEnabled && activePortal === "student" && (
            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-[10px] text-slate-400">or use email</span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>
          )}

          <form onSubmit={submit} className="grid gap-4 mt-5">
            {register && (
              <label>
                <span className="form-label">Full name</span>
                <span className="relative block">
                  <UserRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input className="form-control !pl-10" name="name" placeholder="Enter your full name" autoComplete="name" required minLength={2} maxLength={100} />
                </span>
              </label>
            )}

            <label>
              <span className="form-label">Email address</span>
              <span className="relative block">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="form-control !pl-10"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    activePortal === "admin"
                      ? "althafshaik1717@gmail.com"
                      : activePortal === "coach"
                      ? "coach@example.com"
                      : "student@example.com"
                  }
                  autoComplete="email"
                  required
                />
              </span>
            </label>

            <label>
              <span className="form-label">
                {activePortal === "coach" ? "Temporary password (set by Admin)" : "Password"}
              </span>
              <div className="relative">
                <LockKeyhole size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="form-control !pl-10 !pr-11"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={register ? "At least 8 characters" : "Enter your password"}
                  autoComplete={register ? "new-password" : "current-password"}
                  minLength={register ? 8 : undefined}
                  maxLength={72}
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="input-eye-btn"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            {error && (
              <p role="alert" className="rounded-lg bg-red-50 px-3 py-2.5 text-[11px] leading-5 text-red-700">
                {error}
              </p>
            )}

            <button
              disabled={busy || !databaseConfigured}
              className="btn-primary mt-1 w-full disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
            >
              {busy
                ? (register ? "Creating account…" : "Signing in…")
                : !databaseConfigured
                ? "Account access unavailable"
                : register
                ? "Sign Up"
                : activePortal === "admin"
                ? "Continue to Admin Verification"
                : activePortal === "coach"
                ? "Sign in as Coach"
                : "Sign in as Student"}
              {!busy && databaseConfigured && <ArrowRight size={14} />}
            </button>
          </form>

          {/* Bottom navigation link */}
          {activePortal === "student" && (
            <p className="mt-6 text-center text-[11px] text-slate-500">
              {register ? "Already have a student account?" : "New to Sportivo?"}{" "}
              <Link
                href={register ? "/login?portal=student" : "/register"}
                className="font-bold text-blue hover:underline"
              >
                {register ? "Sign in as Student" : "Create Student Account"}
              </Link>
            </p>
          )}

          {activePortal === "coach" && (
            <p className="mt-6 text-center text-[11px] text-slate-500">
              Coach access is provisioned by the Academy Admin. After signing in, you can update your password in your profile.
            </p>
          )}

          {activePortal === "admin" && (
            <p className="mt-6 text-center text-[11px] text-slate-500">
              Master Admin security requires two-step verification code before granting dashboard access.
            </p>
          )}

          <p className="mt-6 text-center text-[9px] leading-5 text-slate-400">
            By continuing, you agree to use Sportivo Academy responsibly.
          </p>
        </div>
      )}
    </div>
  );
}
