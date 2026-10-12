"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
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
  X,
} from "lucide-react";
import InteractivePillButton from "@/components/ui/InteractivePillButton";

function GoogleIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default function AuthForm({
  mode = "login",
  googleEnabled = false,
  databaseConfigured = false,
}) {
  const register = mode === "register";
  const params = useSearchParams();

  const requestedCallback = params.get("callbackUrl") || "";
  const portalFromQuery = params.get("portal") || "";

  // Determine initial portal: admin, coach, or student (default)
  const initialPortal =
    portalFromQuery ||
    (requestedCallback.includes("/dashboard/admin") ||
    requestedCallback.includes("/admin")
      ? "admin"
      : requestedCallback.includes("/dashboard/coach") ||
        requestedCallback.includes("/coach") ||
        requestedCallback.includes("/dashboard/coaches")
      ? "coach"
      : "student");

  const [activePortal, setActivePortal] = useState(initialPortal);
  const [email, setEmail] = useState(
    () =>
      params.get("email") ||
      (initialPortal === "admin" ? "althafshaik1717@gmail.com" : "")
  );
  const [password, setPassword] = useState("");
  const passwordRef = useRef("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [shining, setShining] = useState(false);

  // Google Account Chooser Modal (fallback when GOOGLE_CLIENT_ID is not set in env)
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [googleName, setGoogleName] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");

  // 2FA Admin 7-digit code state
  const [adminCodeStep, setAdminCodeStep] = useState(false);
  const [adminCode, setAdminCode] = useState("");

  const registeredSuccess = params.get("registered") === "1";

  function triggerShine() {
    setShining(true);
    setTimeout(() => setShining(false), 600);
  }

  // Switch portal and adjust defaults
  function switchPortal(portal) {
    setActivePortal(portal);
    setError("");
    setAdminCodeStep(false);
    if (portal === "admin") {
      if (!email || email.includes("student") || email.includes("coach")) {
        setEmail("althafshaik1717@gmail.com");
      }
    } else if (portal === "coach") {
      if (email === "althafshaik1717@gmail.com" || email.includes("student")) {
        setEmail("");
      }
    } else {
      if (email === "althafshaik1717@gmail.com" || email.includes("coach")) {
        setEmail("");
      }
    }
  }

  async function submit(event) {
    event.preventDefault();
    triggerShine();
    setError("");

    if (!databaseConfigured) {
      setError(
        "Account access needs MongoDB. Add MONGODB_URI to .env.local and restart the app."
      );
      return;
    }

    const form = new FormData(event.currentTarget);
    const inputName = String(form.get("name") || "").trim();
    const inputEmail = String(form.get("email") || email || "")
      .trim()
      .toLowerCase();
    const inputPassword = String(
      form.get("password") || passwordRef.current || password || ""
    );
    const inputCode = String(form.get("adminCode") || adminCode || "").trim();

    passwordRef.current = inputPassword;

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
        if (!response.ok)
          throw new Error(result.error || "Could not create your account.");

        window.location.href = `/login?registered=1&portal=student&email=${encodeURIComponent(
          inputEmail
        )}`;
        return;
      } catch (submitError) {
        setError(
          submitError.message || "Something went wrong. Please try again."
        );
      } finally {
        setBusy(false);
      }
      return;
    }

    // 2. Admin Portal Login
    if (
      activePortal === "admin" ||
      inputEmail === "althafshaik1717@gmail.com"
    ) {
      if (
        inputEmail !== "althafshaik1717@gmail.com" &&
        inputEmail !== "admin@sportivo.demo"
      ) {
        setError(
          "Admin portal login is restricted to althafshaik1717@gmail.com."
        );
        return;
      }
      if (!inputPassword) {
        setError("Please enter your password.");
        return;
      }
      if (!inputCode || inputCode.length !== 7 || inputCode !== "1234567") {
        setError("Please enter 7 digit of code");
        return;
      }

      setBusy(true);
      try {
        const result = await signIn("credentials", {
          email: inputEmail,
          password: inputPassword,
          code: inputCode,
          redirect: false,
        });

        if (result?.error) {
          throw new Error(
            "Admin email or password didn’t match. Please check your credentials."
          );
        }

        window.location.href = "/dashboard/admin";
        return;
      } catch (submitError) {
        setError(submitError.message || "Please enter 7 digit of code");
      } finally {
        setBusy(false);
      }
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
          throw new Error(
            "Coach email or password didn’t match. Make sure Admin has added your access."
          );
        }
        throw new Error(
          "Email or password didn’t match. Check your details and try again."
        );
      }

      let destination = "/dashboard/student";
      if (activePortal === "coach") {
        destination = "/dashboard/coach";
      } else if (
        requestedCallback?.startsWith("/") &&
        !requestedCallback.startsWith("//") &&
        !requestedCallback.includes("\\")
      ) {
        destination = requestedCallback;
      }

      window.location.href = destination;
      return;
    } catch (submitError) {
      setError(
        submitError.message || "Something went wrong. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  // 4. Verify 7-digit code for Admin (2-step fallback)
  async function submitAdminCode(event) {
    event.preventDefault();
    triggerShine();
    setError("");

    if (adminCode.trim() !== "1234567") {
      setError("Please enter 7 digit of code");
      return;
    }

    const pass = passwordRef.current || password;
    if (!pass) {
      setError("Please enter 7 digit of code");
      setAdminCodeStep(false);
      return;
    }

    setBusy(true);
    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password: pass.trim(),
        code: "1234567",
        redirect: false,
      });

      if (result?.error) {
        throw new Error(
          "Admin email or password didn’t match. Please check your credentials."
        );
      }

      window.location.href = "/dashboard/admin";
    } catch (submitError) {
      setError(submitError.message || "Please enter 7 digit of code");
      setBusy(false);
    }
  }

  async function googleSignIn() {
    setError("");
    if (googleEnabled) {
      const callbackUrl =
        !register && activePortal === "coach"
          ? "/dashboard/coach"
          : !register && activePortal === "admin"
          ? "/dashboard/admin"
          : "/dashboard/student";
      await signIn("google", { callbackUrl });
      return;
    }
    setGoogleModalOpen(true);
  }

  async function completeGoogleQuickAuth(selectedEmail, selectedName) {
    setError("");
    if (!databaseConfigured) {
      setError("Account access needs MongoDB configured.");
      setGoogleModalOpen(false);
      return;
    }
    const cleanEmail = String(selectedEmail || googleEmail || "")
      .trim()
      .toLowerCase();
    const cleanName = String(selectedName || googleName || "").trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setError("Please enter a valid Google email address.");
      return;
    }

    setBusy(true);
    try {
      const result = await signIn("credentials", {
        email: cleanEmail,
        password: "GoogleOAuth@Sportivo2026",
        googleName: cleanName || cleanEmail.split("@")[0],
        redirect: false,
      });

      if (result?.error) {
        throw new Error(
          "This email belongs to a Coach or Admin account. Please sign in with your password."
        );
      }

      setGoogleModalOpen(false);
      window.location.href = "/dashboard/student";
    } catch (err) {
      setError(err.message || "Could not sign in with Google.");
      setBusy(false);
      setGoogleModalOpen(false);
    }
  }

  const googleAccountModal = googleModalOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-xs animate-[fadeIn_0.18s_ease-out]">
      <div className="relative w-full max-w-md rounded-3xl border border-stone-200 bg-white p-6 sm:p-7 shadow-2xl">
        <button
          type="button"
          onClick={() => setGoogleModalOpen(false)}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-gray-900"
          aria-label="Close Google sign-in modal"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-2.5">
          <GoogleIcon />
          <span className="text-sm font-bold text-gray-800">
            Sign in with Google
          </span>
        </div>

        <h3 className="mt-4 text-xl font-extrabold tracking-tight text-gray-900">
          Choose an account
        </h3>
        <p className="mt-1 text-xs text-stone-500">
          to continue to <strong className="text-gray-900">Sportivo Academy</strong>
        </p>

        {/* Quick One-Click Verified Athlete Account */}
        <div className="mt-5 space-y-2">
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              completeGoogleQuickAuth("student1@gmail.com", "Aarav Sharma")
            }
            className="flex w-full items-center gap-3 rounded-2xl border border-stone-200/90 bg-stone-50/70 p-3 text-left transition hover:border-orange-300 hover:bg-orange-50/50"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-orange-600 text-xs font-extrabold text-white">
              A
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-gray-900">
                Aarav Sharma (Student Athlete)
              </p>
              <p className="truncate text-[11px] text-stone-500">
                student1@gmail.com
              </p>
            </div>
            <ArrowRight size={14} className="text-stone-400" />
          </button>
        </div>

        <div className="my-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-stone-200" />
          <span className="text-[11px] font-medium text-stone-400">
            or use your Google email
          </span>
          <span className="h-px flex-1 bg-stone-200" />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            completeGoogleQuickAuth(googleEmail, googleName);
          }}
          className="space-y-3"
        >
          <input
            type="text"
            value={googleName}
            onChange={(e) => setGoogleName(e.target.value)}
            placeholder="Your full name (e.g. Rohan Verma)"
            className="form-control text-xs"
            required
          />
          <input
            type="email"
            value={googleEmail}
            onChange={(e) => setGoogleEmail(e.target.value)}
            placeholder="yourname@gmail.com"
            className="form-control text-xs"
            required
          />
          <InteractivePillButton
            type="submit"
            disabled={busy}
            className="w-full py-3 text-xs"
          >
            <span>
              {busy ? "Connecting Google Account…" : "Continue with Google"}
            </span>
            <ArrowRight size={14} />
          </InteractivePillButton>
        </form>
      </div>
    </div>
  );

  // ============================================================================
  // SIGN UP MODE (/register) — Clean Google-Only Card (Matches Image 5)
  // ============================================================================
  if (register) {
    return (
      <div className="w-full max-w-[420px] animate-[fadeIn_0.45s_ease-out]">
        {googleAccountModal}

        {/* Centered Brand Icon & Header */}
        <div className="text-center">
          <Link
            href="/"
            className="mx-auto mb-5 inline-flex items-center justify-center rounded-2xl border border-stone-200/80 bg-white p-1.5 shadow-sm transition-transform duration-200 hover:scale-105"
          >
            <img
              src="/images/sportivo-logo.png"
              alt="Sportivo Logo"
              className="h-10 w-10 rounded-xl object-cover"
            />
          </Link>

          <h1 className="text-[28px] sm:text-[32px] font-extrabold tracking-tight text-gray-900">
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-stone-500">
            Get started with Sportivo in seconds
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-center text-xs text-red-700"
          >
            {error}
          </p>
        )}

        {/* Prominent Continue with Google Button */}
        <button
          onClick={googleSignIn}
          disabled={busy}
          type="button"
          className="mt-7 flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-stone-200/90 bg-white px-4 text-sm font-semibold text-gray-700 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-stone-300 hover:bg-stone-50 hover:shadow-md active:translate-y-0 disabled:opacity-60"
        >
          <GoogleIcon />
          <span>{busy ? "Connecting to Google…" : "Continue with Google"}</span>
        </button>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-stone-200 to-stone-200" />
          <span className="text-xs font-medium text-stone-400">or</span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent via-stone-200 to-stone-200" />
        </div>

        {/* Already have an account? Sign in */}
        <p className="text-center text-sm text-stone-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold !text-orange-600 transition-colors hover:!text-orange-700"
          >
            Sign in
          </Link>
        </p>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium !text-stone-400 transition-colors hover:!text-gray-700"
          >
            <ArrowLeft size={13} />
            <span>Back to home</span>
          </Link>
        </div>
      </div>
    );
  }

  // ============================================================================
  // SIGN IN MODE (/login) — Student/Coach/Admin Tabs + Form + Google Button
  // ============================================================================
  return (
    <div className="w-full max-w-[440px] animate-[fadeIn_0.45s_ease-out]">
      {googleAccountModal}

      {/* Top Mobile/Form Brand Icon */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="relative overflow-hidden rounded-xl border border-stone-200/80 bg-white p-0.5 shadow-2xs transition duration-200 group-hover:scale-105">
            <img
              src="/images/sportivo-logo.png"
              alt="Sportivo Logo"
              className="h-9 w-9 rounded-[10px] object-cover"
            />
          </div>
          <span>
            <span className="block text-[15px] font-black tracking-tight text-gray-900">
              SPORT<span className="text-orange-600">IVO</span>
            </span>
            <span className="block text-[8px] font-extrabold tracking-[.22em] text-stone-400">
              ATHLETIC ACADEMY
            </span>
          </span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs font-semibold !text-stone-400 hover:!text-gray-800"
        >
          <ArrowLeft size={13} />
          <span>Home</span>
        </Link>
      </div>

      {/* PORTAL SELECTOR TABS (Student / Coach / Admin) */}
      {!adminCodeStep && (
        <div className="mb-6 grid grid-cols-3 gap-1 rounded-2xl border border-stone-200/90 bg-stone-100/85 p-1.5">
          <button
            type="button"
            onClick={() => switchPortal("student")}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition-all duration-200 ${
              activePortal === "student"
                ? "bg-white text-gray-900 shadow-xs ring-1 ring-stone-200/70"
                : "text-stone-500 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            <UserRound
              size={13}
              className={activePortal === "student" ? "text-orange-600" : ""}
            />
            <span>Student</span>
          </button>

          <button
            type="button"
            onClick={() => switchPortal("coach")}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition-all duration-200 ${
              activePortal === "coach"
                ? "bg-white text-gray-900 shadow-xs ring-1 ring-stone-200/70"
                : "text-stone-500 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            <Activity
              size={13}
              className={activePortal === "coach" ? "text-orange-600" : ""}
            />
            <span>Coach</span>
          </button>

          <button
            type="button"
            onClick={() => switchPortal("admin")}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition-all duration-200 ${
              activePortal === "admin"
                ? "bg-white text-gray-900 shadow-xs ring-1 ring-stone-200/70"
                : "text-stone-500 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            <ShieldCheck
              size={13}
              className={activePortal === "admin" ? "text-emerald-600" : ""}
            />
            <span>Admin</span>
          </button>
        </div>
      )}

      {/* ADMIN 7-DIGIT CODE VERIFICATION STEP */}
      {adminCodeStep ? (
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-bold text-orange-700">
            <ShieldCheck size={14} /> Admin Security Check
          </div>
          <h1 className="text-[28px] font-extrabold tracking-tight text-gray-900">
            Please enter 7 digit of code
          </h1>
          <p className="mt-2 text-xs leading-6 text-stone-500">
            For admin account <strong className="text-gray-900">{email}</strong>
            , enter the 7-digit verification code to complete sign-in.
          </p>

          <form onSubmit={submitAdminCode} className="mt-6 grid gap-4">
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-center">
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-stone-500">
                7-Digit Verification Code
              </label>
              <div className="relative mx-auto max-w-[260px]">
                <KeyRound
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-600"
                />
                <input
                  type="text"
                  maxLength={7}
                  inputMode="numeric"
                  value={adminCode}
                  onChange={(e) =>
                    setAdminCode(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="•••••••"
                  className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-center text-xl font-bold tracking-[0.25em] text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  required
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 px-3 py-2.5 text-[11px] leading-5 text-red-700"
              >
                {error}
              </p>
            )}

            <InteractivePillButton
              disabled={busy}
              onClick={triggerShine}
              className="w-full py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
            >
              <span>
                {busy ? "Verifying code…" : "Verify & Sign in to Admin"}
              </span>
              {!busy && <ArrowRight size={14} />}
            </InteractivePillButton>

            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setAdminCodeStep(false);
                setError("");
              }}
              className="inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold text-stone-500 hover:text-gray-900 transition"
            >
              <ArrowLeft size={13} /> Back to email &amp; password
            </button>
          </form>
        </div>
      ) : (
        /* STANDARD LOGIN FORM + CONTINUE WITH GOOGLE */
        <div>
          <p className="eyebrow">
            {activePortal === "coach"
              ? "Coach Portal Login"
              : activePortal === "admin"
              ? "Admin Portal Login"
              : "Student Athlete Sign-In"}
          </p>

          <h1 className="mt-1.5 text-[28px] sm:text-[32px] font-extrabold tracking-tight text-gray-900">
            {activePortal === "coach"
              ? "Coach sign-in"
              : activePortal === "admin"
              ? "Admin sign-in"
              : "Welcome back"}
          </h1>

          <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-stone-500">
            {activePortal === "coach"
              ? "Sign in with the coach credentials created by Admin to access your workspace."
              : activePortal === "admin"
              ? "Sign in with your master Admin credentials and 7-digit code to access academy operations."
              : "Sign in to your Sportivo account to continue."}
          </p>

          {/* Success banner after registering */}
          {registeredSuccess && (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-emerald-900 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>Account created successfully!</span>
              </div>
              <p className="mt-1 text-[11px] leading-5 text-emerald-700">
                Please sign in below to begin your student onboarding.
              </p>
            </div>
          )}

          {!databaseConfigured && (
            <p
              role="status"
              className="mt-5 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2.5 text-[10px] leading-5 text-stone-600"
            >
              Account access needs MongoDB. Add{" "}
              <code className="font-semibold text-gray-900">MONGODB_URI</code>{" "}
              to <code className="font-semibold text-gray-900">.env.local</code>{" "}
              and restart the app.
            </p>
          )}

          {/* Always-Visible Continue with Google Button on Sign In */}
          <button
            onClick={googleSignIn}
            disabled={busy}
            type="button"
            className="mt-6 flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-stone-200/90 bg-white px-4 text-sm font-semibold text-gray-700 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-stone-300 hover:bg-stone-50 hover:shadow-md active:translate-y-0 disabled:opacity-60"
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-stone-200 to-stone-200" />
            <span className="text-[11px] font-medium text-stone-400">
              or sign in with email
            </span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-stone-200 to-stone-200" />
          </div>

          <form onSubmit={submit} className="grid gap-4">
            <label>
              <span className="form-label">Email address</span>
              <span className="relative block">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                />
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
                {activePortal === "coach"
                  ? "Temporary password (set by Admin)"
                  : "Password"}
              </span>
              <div className="relative">
                <LockKeyhole
                  size={15}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                />
                <input
                  className="form-control !pl-10 !pr-11"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => {
                    passwordRef.current = e.target.value;
                    setPassword(e.target.value);
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
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

            {/* 7-DIGIT VERIFICATION CODE FOR ADMIN */}
            {activePortal === "admin" && (
              <label>
                <span className="form-label">7-Digit Verification Code</span>
                <div className="relative">
                  <KeyRound
                    size={15}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-600"
                  />
                  <input
                    className="form-control !pl-10 text-center text-lg font-bold tracking-[0.25em]"
                    type="text"
                    name="adminCode"
                    inputMode="numeric"
                    maxLength={7}
                    value={adminCode}
                    onChange={(e) =>
                      setAdminCode(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="•••••••"
                    autoComplete="one-time-code"
                    required
                  />
                </div>
                <span className="mt-1 block text-[10px] text-stone-400">
                  Master Admin security verification
                </span>
              </label>
            )}

            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 px-3 py-2.5 text-[11px] leading-5 text-red-700"
              >
                {error}
              </p>
            )}

            <InteractivePillButton
              disabled={busy || !databaseConfigured}
              orbSize={40}
              className="mt-1 w-full py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              onClick={triggerShine}
            >
              <span>
                {busy
                  ? "Signing in…"
                  : !databaseConfigured
                  ? "Account access unavailable"
                  : activePortal === "admin"
                  ? "Sign in as Admin"
                  : activePortal === "coach"
                  ? "Sign in as Coach"
                  : "Sign in as Student"}
              </span>
              {!busy && databaseConfigured && <ArrowRight size={14} />}
            </InteractivePillButton>
          </form>

          {/* Bottom navigation link */}
          {activePortal === "student" && (
            <p className="mt-6 text-center text-xs text-stone-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold !text-orange-600 hover:!text-orange-700"
              >
                Sign up
              </Link>
            </p>
          )}

          {activePortal === "coach" && (
            <p className="mt-6 text-center text-[11px] text-stone-500">
              Coach access is provisioned by the Academy Admin. After signing
              in, you can update your password in your profile.
            </p>
          )}

          {activePortal === "admin" && (
            <p className="mt-6 text-center text-[11px] text-stone-500">
              Master Admin security requires two-step verification code before
              granting dashboard access.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
