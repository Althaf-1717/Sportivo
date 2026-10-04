"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Eye, EyeOff, Lock, Save, ShieldCheck, UserCheck } from "lucide-react";

const blank = {
  name: "",
  email: "",
  role: "coach",
  phone: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  specialization: "",
  bio: "",
  sports: [],
};

export default function ProfileForm({ role = "coach" }) {
  const [form, setForm] = useState(blank);
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/profile")
      .then((res) => res.json().then((data) => ({ res, data })))
      .then(({ res, data }) => {
        if (!active) return;
        if (!res.ok) throw new Error(data.error || "Could not load profile.");
        const user = data.user;
        const coach = data.coach;
        setForm({
          studentId: user.studentId || null,
          name: user.name || "",
          email: user.email || "",
          role: user.role || role,
          phone: user.phone || "",
          dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().slice(0, 10) : "",
          gender: user.gender || "",
          address: user.address || "",
          specialization: coach?.specialization || "",
          bio: coach?.bio || "",
          sports: coach?.sports || [],
        });
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setBusy(false);
      });
    return () => {
      active = false;
    };
  }, [role]);

  function change(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    // Validate password change if attempted
    if (newPassword) {
      if (newPassword.length < 8) {
        setError("New password must be at least 8 characters long.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("New password and confirm password do not match.");
        return;
      }
      if (!currentPassword) {
        setError("Please enter your current temporary password to set a new password.");
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        dateOfBirth: form.dateOfBirth || undefined,
        gender: form.gender || undefined,
        address: form.address,
        specialization: form.specialization,
        bio: form.bio,
        ...(newPassword ? { currentPassword, newPassword } : {}),
      };

      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save your profile.");

      setMessage(data.message || "Your profile has been updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  if (busy) {
    return <div className="surface-card animate-pulse p-8 text-xs text-slate-400">Loading your profile…</div>;
  }

  const isCoach = form.role === "coach";

  return (
    <form onSubmit={save} className="surface-card grid gap-6 p-5 sm:p-7">
      <div>
        <div className="flex items-center gap-2">
          <UserCheck size={18} className="text-blue" />
          <h2 className="text-sm font-bold text-navy">Account Details</h2>
        </div>
        <p className="mt-1 text-[11px] text-slate-400">
          Your profile information is shared with the academy. Changes to your name or phone will automatically sync with the academy administration portal.
        </p>
      </div>

      {role === "student" && form.studentId && (
        <div className="mb-4 rounded-xl border border-blue/20 bg-blue-soft/50 p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Academy Identity</span>
            <p className="text-sm font-extrabold text-navy">Student ID: #{form.studentId}</p>
          </div>
          <span className="rounded-lg bg-blue px-3 py-1 text-xs font-bold text-white shadow-sm">
            Active Athlete
          </span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className="form-label">Full Name</span>
          <input
            className="form-control"
            value={form.name}
            required
            minLength={2}
            maxLength={100}
            onChange={(e) => change("name", e.target.value)}
          />
        </label>

        <label>
          <span className="form-label flex items-center justify-between">
            <span>Email Address</span>
            <span className="text-[9px] font-semibold text-orange flex items-center gap-1">
              <Lock size={10} /> Locked by Admin
            </span>
          </span>
          <input
            className="form-control bg-slate-100 text-slate-500 cursor-not-allowed"
            value={form.email}
            disabled
            readOnly
          />
          <span className="mt-1 block text-[9px] text-slate-400">
            Email cannot be changed by the coach. Contact an Academy Admin if you need to update your email.
          </span>
        </label>

        <label>
          <span className="form-label">Phone Number</span>
          <input
            className="form-control"
            type="tel"
            autoComplete="tel"
            maxLength={30}
            placeholder="+91 98765 43210"
            value={form.phone}
            onChange={(e) => change("phone", e.target.value)}
          />
        </label>

        {isCoach && (
          <label>
            <span className="form-label">Specialization / Role</span>
            <input
              className="form-control"
              placeholder="e.g. Head Coach, Batting Specialist"
              value={form.specialization}
              onChange={(e) => change("specialization", e.target.value)}
            />
          </label>
        )}

        {isCoach && form.sports?.length > 0 && (
          <div className="sm:col-span-2">
            <span className="form-label">Assigned Academy Sports</span>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {form.sports.map((sport) => (
                <span key={sport._id || sport.slug || sport} className="pill font-semibold">
                  {sport.name || sport}
                </span>
              ))}
            </div>
          </div>
        )}

        {isCoach && (
          <label className="sm:col-span-2">
            <span className="form-label">Coach Bio & Background</span>
            <textarea
              className="form-control min-h-24 resize-y"
              maxLength={2000}
              placeholder="Share coaching achievements, certifications, or training philosophy..."
              value={form.bio}
              onChange={(e) => change("bio", e.target.value)}
            />
          </label>
        )}

        {!isCoach && (
          <>
            <label>
              <span className="form-label">Date of Birth</span>
              <input
                className="form-control"
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => change("dateOfBirth", e.target.value)}
              />
            </label>

            <label>
              <span className="form-label">Gender</span>
              <select
                className="form-control"
                value={form.gender}
                onChange={(e) => change("gender", e.target.value)}
              >
                <option value="">Prefer not to say</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="non-binary">Non-binary</option>
              </select>
            </label>

            <label className="sm:col-span-2">
              <span className="form-label">Address</span>
              <textarea
                className="form-control min-h-20 resize-y"
                maxLength={500}
                value={form.address}
                onChange={(e) => change("address", e.target.value)}
              />
            </label>
          </>
        )}
      </div>

      {/* Password Change Section */}
      <div className="border-t border-slate-100 pt-5">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-orange" />
          <h3 className="text-sm font-bold text-navy">Change Password</h3>
        </div>
        <p className="mt-1 text-[11px] text-slate-400">
          You can update the temporary password set by the admin to your own private password.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <label>
            <span className="form-label">Current / Temporary Password</span>
            <div className="relative">
              <input
                className="form-control !pr-11"
                type={showCurrent ? "text" : "password"}
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                type="button"
                className="input-eye-btn"
                onClick={() => setShowCurrent(!showCurrent)}
                aria-label={showCurrent ? "Hide current password" : "Show current password"}
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <label>
            <span className="form-label">New Password</span>
            <div className="relative">
              <input
                className="form-control !pr-11"
                type={showNew ? "text" : "password"}
                minLength={8}
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="input-eye-btn"
                onClick={() => setShowNew(!showNew)}
                aria-label={showNew ? "Hide new password" : "Show new password"}
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <label>
            <span className="form-label">Confirm New Password</span>
            <div className="relative">
              <input
                className="form-control !pr-11"
                type={showConfirm ? "text" : "password"}
                minLength={8}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="input-eye-btn"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4">
        {error && (
          <p role="alert" className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-[11px] text-red-700">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="mb-3 flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-[11px] text-emerald-700">
            <CheckCircle2 size={13} className="shrink-0 text-emerald-600" />
            <span>{message}</span>
          </p>
        )}
        <button disabled={saving} className="btn-primary disabled:opacity-60" type="submit">
          {saving ? "Saving changes…" : "Save Profile & Password"} <Save size={14} />
        </button>
      </div>
    </form>
  );
}
