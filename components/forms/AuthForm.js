"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import {
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
  portal = "student",
  googleEnabled = false,
  databaseConfigured = false,
}) {
  const register = mode === "register";
  const params = useSearchParams();

  const requestedCallback = params.get("callbackUrl") || "";
  const registeredSuccess = params.get("registered") === "1";

  // Dedicated portal for this form instance: "student" | "coach" | "admin"
  const activePortal = portal || "student";

  const [name, setName] = useState("");
  const [email, setEmail] = useState(() => {
    const fromQuery = params.get("email");
    if (fromQuery) return fromQuery;
    if (!register && activePortal === "admin") {
      return "althafshaik1717@gmail.com";
    }
    return "";
  });
  const [password, setPassword] = useState("");
  const passwordRef = useRef("");
  const [showPassword, setShowPassword] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  // Saved/detected Google profile in browser for direct 1-click skip on sign-up
  const [savedGoogleUser, setSavedGoogleUser] = useState({
    name: "Shaik Althaf",
    email: "althafshaik1717@gmail.com",
  });
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [customGoogleName, setCustomGoogleName] = useState("");
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");

  useEffect(() => {
    try {
      const storedEmail = window.localStorage.getItem("sportivo_user_email");
      const storedName = window.localStorage.getItem("sportivo_user_name");
      if (storedEmail && storedEmail.includes("@")) {
        setSavedGoogleUser({
          name:
            storedName ||
            (storedEmail.toLowerCase() === "althafshaik1717@gmail.com"
              ? "Shaik Althaf"
              : storedEmail.split("@")[0]),
          email: storedEmail.toLowerCase(),
        });
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (!databaseConfigured) {
      setError(
        "Account access needs MongoDB. Add MONGODB_URI to .env.local and restart the app."
      );
      return;
    }

    const form = new FormData(event.currentTarget);
    const inputName = String(form.get("name") || name || "").trim();
    const inputEmail = String(form.get("email") || email || "")
      .trim()
      .toLowerCase();
    const inputPassword = String(
      form.get("password") || passwordRef.current || password || ""
    );
    const inputCode = String(form.get("adminCode") || adminCode || "").trim();

    passwordRef.current = inputPassword;

    try {
      if (inputEmail) {
        window.localStorage.setItem("sportivo_user_email", inputEmail);
      }
      if (inputName) {
        window.localStorage.setItem("sportivo_user_name", inputName);
      }
    } catch {}

    // 1. Student Registration Mode (/register)
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

        // Sign in immediately after registration so the athlete enters the portal directly
        const signInResult = await signIn("credentials", {
          email: inputEmail,
          password: inputPassword,
          portal: "student",
          redirect: false,
        });

        if (!signInResult?.error) {
          window.location.href = "/dashboard/student";
          return;
        }

        window.location.href = `/login?registered=1&email=${encodeURIComponent(
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

    // 2. Admin Portal Login (/admin)
    if (activePortal === "admin") {
      if (
        inputEmail !== "althafshaik1717@gmail.com" &&
        inputEmail !== "admin@sportivo.demo"
      ) {
        setError(
          "Admin portal login is restricted to verified administrators."
        );
        return;
      }
      if (!inputPassword) {
        setError("Please enter your admin password.");
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
          portal: "admin",
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

    // 3. Coach Portal Login (/coach)
    if (activePortal === "coach") {
      if (!inputEmail || !inputPassword) {
        setError("Please enter your coach email and password.");
        return;
      }

      setBusy(true);
      try {
        const result = await signIn("credentials", {
          email: inputEmail,
          password: inputPassword,
          portal: "coach",
          redirect: false,
        });

        if (result?.error) {
          throw new Error(
            "Coach email or password didn’t match. Make sure Admin has added your access."
          );
        }

        window.location.href = "/dashboard/coach";
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

    // 4. Student Portal Login (/login)
    setBusy(true);
    try {
      const result = await signIn("credentials", {
        email: inputEmail,
        password: inputPassword,
        portal: "student",
        redirect: false,
      });

      if (result?.error) {
        throw new Error(
          "Email or password didn’t match. Check your details and try again."
        );
      }

      let destination = "/dashboard/student";
      if (
        requestedCallback?.startsWith("/") &&
        !requestedCallback.startsWith("//") &&
        !requestedCallback.includes("\\") &&
        !requestedCallback.includes("/coach") &&
        !requestedCallback.includes("/admin")
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

  // Direct 1-Click Google Skip & Sign-Up Handler (Only for /register)
  async function completeGoogleDirectAuth(targetEmail, targetName) {
    setError("");
    if (!databaseConfigured) {
      setError("Account access needs MongoDB configured.");
      return;
    }

    if (googleEnabled && !targetEmail) {
      await signIn("google", { callbackUrl: "/dashboard/student" });
      return;
    }

    const chosenEmail = String(
      targetEmail ||
        (email && email.includes("@") ? email : savedGoogleUser.email) ||
        "althafshaik1717@gmail.com"
    )
      .trim()
      .toLowerCase();

    const chosenName = String(
      targetName ||
        name ||
        (chosenEmail === "althafshaik1717@gmail.com"
          ? "Shaik Althaf"
          : savedGoogleUser.name) ||
        chosenEmail.split("@")[0]
    ).trim();

    setGoogleBusy(true);
    try {
      try {
        window.localStorage.setItem("sportivo_user_email", chosenEmail);
        window.localStorage.setItem("sportivo_user_name", chosenName);
      } catch {}

      const result = await signIn("credentials", {
        email: chosenEmail,
        password: "GoogleOAuth@Sportivo2026",
        googleName: chosenName,
        portal: "student",
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Could not sign in with Google. Please try again.");
      }

      setGoogleModalOpen(false);
      window.location.href = "/dashboard/student";
    } catch (err) {
      setError(err.message || "Could not sign in with Google.");
      setGoogleBusy(false);
    }
  }

  const googleAccountModal = googleModalOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-xs">
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
            Sign up with Google
          </span>
        </div>

        <h3 className="mt-4 text-xl font-extrabold tracking-tight text-gray-900">
          Choose your Google account
        </h3>
        <p className="mt-1 text-xs text-stone-500">
          to continue directly to{" "}
          <strong className="text-gray-900">Sportivo Academy</strong>
        </p>

        {/* Primary Saved Google Account: Shaik Althaf (althafshaik1717@gmail.com) */}
        <div className="mt-5 space-y-2">
          <button
            type="button"
            disabled={googleBusy}
            onClick={() =>
              completeGoogleDirectAuth(
                "althafshaik1717@gmail.com",
                "Shaik Althaf"
              )
            }
            className="flex w-full items-center gap-3 rounded-2xl border border-orange-200 bg-orange-50/60 p-3 text-left transition hover:border-orange-400 hover:bg-orange-50"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-orange-600 text-xs font-extrabold text-white">
              S
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-gray-900">
                Shaik Althaf
              </p>
              <p className="truncate text-[11px] text-stone-600">
                althafshaik1717@gmail.com
              </p>
            </div>
            <ArrowRight size={14} className="text-orange-600" />
          </button>
        </div>

        <div className="my-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-stone-200" />
          <span className="text-[11px] font-medium text-stone-400">
            or enter another Gmail
          </span>
          <span className="h-px flex-1 bg-stone-200" />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            completeGoogleDirectAuth(customGoogleEmail, customGoogleName);
          }}
          className="space-y-3"
        >
          <input
            type="text"
            value={customGoogleName}
            onChange={(e) => setCustomGoogleName(e.target.value)}
            placeholder="Your full name"
            autoComplete="name"
            className="form-control text-xs"
            required
          />
          <input
            type="email"
            value={customGoogleEmail}
            onChange={(e) => setCustomGoogleEmail(e.target.value)}
            placeholder="yourname@gmail.com"
            autoComplete="email"
            className="form-control text-xs"
            required
          />
          <InteractivePillButton
            type="submit"
            disabled={googleBusy}
            className="w-full py-3 text-xs"
          >
            <span>
              {googleBusy ? "Signing in with Google…" : "Continue with Google"}
            </span>
            <ArrowRight size={14} />
          </InteractivePillButton>
        </form>
      </div>
    </div>
  );

  // ============================================================================
  // SIGN UP MODE (/register) — Full Name, Email, Password + Skip with Google
  // ============================================================================
  if (register) {
    const activeGoogleEmail =
      email && email.includes("@") ? email : savedGoogleUser.email;
    const activeGoogleName =
      name ||
      (activeGoogleEmail === "althafshaik1717@gmail.com"
        ? "Shaik Althaf"
        : savedGoogleUser.name);

    return (
      <div className="w-full max-w-[440px] animate-[fadeIn_0.45s_ease-out]">
        {googleAccountModal}

        {/* Top Brand Icon & Home Link */}
        <div className="mb-5 flex items-center justify-between">
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

        <p className="eyebrow">Create Student Account</p>
        <h1 className="mt-1 text-[28px] sm:text-[32px] font-extrabold tracking-tight text-gray-900">
          Create your account
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-stone-500">
          Enter your name, email, and password — or skip and continue directly
          with your Google account.
        </p>

        {/* Direct 1-Click Continue with Google Button */}
        <div className="mt-5">
          <button
            onClick={() =>
              completeGoogleDirectAuth(activeGoogleEmail, activeGoogleName)
            }
            disabled={googleBusy || busy}
            type="button"
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-stone-200/90 bg-white px-4 text-sm font-semibold text-gray-800 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50/40 hover:shadow-md active:translate-y-0 disabled:opacity-60"
          >
            <GoogleIcon />
            <span>
              {googleBusy
                ? `Continuing as ${activeGoogleEmail}…`
                : "Continue with Google"}
            </span>
          </button>
          <div className="mt-1.5 flex items-center justify-between px-1 text-[11px] text-stone-500">
            <span>
              Signed in as{" "}
              <strong className="text-gray-800">{activeGoogleEmail}</strong>
            </span>
            <button
              type="button"
              onClick={() => setGoogleModalOpen(true)}
              className="font-semibold text-orange-600 hover:underline"
            >
              Change account
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-stone-200 to-stone-200" />
          <span className="text-[11px] font-medium text-stone-400">
            or sign up with email
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent via-stone-200 to-stone-200" />
        </div>

        {/* Name, Email, Password Sign Up Form */}
        <form onSubmit={submit} className="grid gap-3.5">
          <label>
            <span className="form-label">Full name</span>
            <span className="relative block">
              <UserRound
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
              />
              <input
                className="form-control !pl-10"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
              />
            </span>
          </label>

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
                placeholder="althafshaik1717@gmail.com"
                autoComplete="email"
                required
              />
            </span>
          </label>

          <label>
            <span className="form-label">Password</span>
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
                placeholder="At least 8 characters"
                autoComplete="new-password"
                minLength={8}
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
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-3 py-2.5 text-[11px] leading-5 text-red-700"
            >
              {error}
            </p>
          )}

          <InteractivePillButton
            disabled={busy || googleBusy || !databaseConfigured}
            orbSize={40}
            className="mt-1 w-full py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
          >
            <span>{busy ? "Creating account…" : "Sign Up"}</span>
            {!busy && databaseConfigured && <ArrowRight size={14} />}
          </InteractivePillButton>
        </form>

        {/* Already have an account? Sign in */}
        <p className="mt-5 text-center text-xs text-stone-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold !text-orange-600 transition-colors hover:!text-orange-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  // ============================================================================
  // DEDICATED SIGN IN MODE:
  // - /login: Student ONLY (No coach or admin tabs)
  // - /coach: Coach ONLY (No student or admin tabs)
  // - /admin: Admin ONLY (No student or coach tabs)
  // ============================================================================
  return (
    <div className="w-full max-w-[440px] animate-[fadeIn_0.45s_ease-out]">
      {/* Top Brand Icon & Home Link */}
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

      {/* PORTAL SPECIFIC HEADERS */}
      <div>
        <p className="eyebrow">
          {activePortal === "coach"
            ? "Coach Portal"
            : activePortal === "admin"
            ? "Admin Portal"
            : "Student Portal"}
        </p>

        <h1 className="mt-1.5 text-[28px] sm:text-[32px] font-extrabold tracking-tight text-gray-900">
          {activePortal === "coach"
            ? "Coach Sign-In"
            : activePortal === "admin"
            ? "Admin Sign-In"
            : "Student Sign-In"}
        </h1>

        <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-stone-500">
          {activePortal === "coach"
            ? "Sign in with your coach credentials to manage sessions, attendance, and athlete evaluations."
            : activePortal === "admin"
            ? "Sign in with your master administrator credentials and 7-digit code to access academy operations."
            : "Sign in with your email and password to track training sessions, skill reports, and schedules."}
        </p>

        {/* Success banner after registering */}
        {registeredSuccess && (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-emerald-900 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <span>Account created successfully!</span>
            </div>
            <p className="mt-1 text-[11px] leading-5 text-emerald-700">
              Please sign in below to access your student portal.
            </p>
          </div>
        )}

        {!databaseConfigured && (
          <p
            role="status"
            className="mt-5 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2.5 text-[10px] leading-5 text-stone-600"
          >
            Account access needs MongoDB. Add{" "}
            <code className="font-semibold text-gray-900">MONGODB_URI</code> to{" "}
            <code className="font-semibold text-gray-900">.env.local</code> and
            restart the app.
          </p>
        )}

        <form onSubmit={submit} className="mt-6 grid gap-4">
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
                ? "Coach password"
                : activePortal === "admin"
                ? "Admin password"
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

          {/* 7-DIGIT VERIFICATION CODE (ADMIN PORTAL ONLY) */}
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
                Master Admin security verification (e.g. 1234567)
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

        {/* BOTTOM LINKS TAILORED PER DEDICATED PORTAL */}
        {activePortal === "student" && (
          <p className="mt-6 text-center text-xs text-stone-600">
            Don&apos;t have a student account?{" "}
            <Link
              href="/register"
              className="font-semibold !text-orange-600 hover:!text-orange-700"
            >
              Sign up
            </Link>
          </p>
        )}

        {activePortal === "coach" && (
          <div className="mt-6 space-y-2 text-center text-xs text-stone-500">
            <p>Coach credentials are provisioned by the Academy Admin.</p>
            <p>
              Are you a student?{" "}
              <Link
                href="/login"
                className="font-semibold text-orange-600 hover:text-orange-700"
              >
                Sign in to Student Portal
              </Link>
            </p>
          </div>
        )}

        {activePortal === "admin" && (
          <div className="mt-6 space-y-2 text-center text-xs text-stone-500">
            <p>
              Master Admin portal requires authorized administrative
              credentials.
            </p>
            <p>
              Are you a student?{" "}
              <Link
                href="/login"
                className="font-semibold text-orange-600 hover:text-orange-700"
              >
                Sign in to Student Portal
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
