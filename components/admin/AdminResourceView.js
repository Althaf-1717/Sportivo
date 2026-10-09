"use client";

import { useMemo, useState, useRef } from "react";
import { Camera, Check, Edit3, Eye, EyeOff, Plus, Search, ShieldCheck, Trash2, X } from "lucide-react";
import PageIntro from "@/components/dashboard/PageIntro";
import SportIcon from "@/components/ui/SportIcon";

const COACH_ROLE_OPTIONS = [
  "Head Coach",
  "Head Girl",
  "Assistant Coach - Men",
  "Assistant Coach - Women",
];

const SUGGESTED_SPORTS = ["Cricket", "Football", "Basketball"];

const resourceConfig = {
  sports: {
    endpoint: "/api/sports",
    singular: "sport",
    columns: ["name", "description", "isActive"],
    fields: [
      { key: "name", label: "Sport name", required: true },
      { key: "description", label: "Short description", type: "textarea" },
      { key: "detail", label: "Programme details", type: "textarea" },
      { key: "image", label: "Photo URL" },
      { key: "icon", label: "Emoji icon" },
      { key: "focus", label: "Training focus (comma-separated)" },
    ],
  },
  coaches: {
    endpoint: "/api/coaches",
    singular: "coach",
    buttonLabel: "Add Coach Access",
    columns: ["name", "email", "phone", "specialization", "sports", "isActive"],
    fields: [
      { key: "name", label: "Full name", required: true },
      { key: "phone", label: "Phone number", type: "tel", required: true },
      { key: "email", label: "Email address", type: "email", required: true },
      { key: "password", label: "Temporary password (set by admin, 8+ chars)", type: "password", required: true },
      {
        key: "specialization",
        label: "Specialization / Role",
        type: "select-role",
        required: true,
        options: COACH_ROLE_OPTIONS,
      },
      { key: "experience", label: "Years of experience", type: "number" },
      {
        key: "sports",
        label: "Assigned Sports",
        type: "sports-select",
        required: true,
      },
      { key: "bio", label: "Coach bio / qualifications", type: "textarea" },
    ],
  },
  membership: {
    endpoint: "/api/membership",
    singular: "membership plan",
    columns: ["name", "sport", "duration", "price", "isActive"],
    fields: [
      { key: "name", label: "Plan name", required: true },
      { key: "sport", label: "Sport", type: "select", required: true },
      { key: "duration", label: "Duration in months", type: "number", required: true },
      { key: "price", label: "Price in rupees", type: "number", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "features", label: "Features (comma-separated)" },
    ],
  },
};

function toForm(resource, row) {
  if (!row) return {};
  if (resource === "coaches") {
    return {
      name: row.user?.name || row.name || "",
      email: row.user?.email || row.email || "",
      phone: row.user?.phone || row.phone || "",
      image: row.user?.image || row.image || "",
      specialization: row.specialization || COACH_ROLE_OPTIONS[0],
      experience: row.experience ?? 0,
      bio: row.bio || "",
      sports: (row.sports || []).map((sport) => sport.name || sport).join(", ") || SUGGESTED_SPORTS[0],
    };
  }
  if (resource === "membership") {
    return {
      name: row.name || "",
      sport: row.sport?.slug || row.sport?.name?.toLowerCase() || row.sport || "",
      duration: row.duration || 1,
      price: row.price || 0,
      description: row.description || "",
      features: (row.features || []).join(", "),
    };
  }
  return {
    name: row.name || "",
    description: row.description || "",
    detail: row.detail || "",
    image: row.image || "",
    icon: row.icon || "",
    focus: (row.focus || []).join(", "),
  };
}

function formatCell(resource, key, row) {
  if (key === "isActive") return row.isActive === false ? <span className="status-muted">Inactive</span> : <span className="status-good">Active</span>;
  if (key === "sports") return (row.sports || []).map((sport) => sport.name || sport).join(", ") || "—";
  if (key === "sport") return row.sport?.name || row.sport || "—";
  if (key === "experience") return `${row.experience || 0} yrs`;
  if (key === "duration") return `${row.duration} mo`;
  if (key === "price") return `₹${Number(row.price || 0).toLocaleString("en-IN")}`;
  if (key === "name" && resource === "coaches") {
    const coachImg = row.user?.image || row.image;
    const coachName = row.user?.name || row.name || "—";
    const initials = coachName.split(" ").map((w) => w[0]).slice(0, 2).join("");
    return (
      <div className="flex items-center gap-3">
        {coachImg ? (
          <img src={coachImg} alt={coachName} className="h-9 w-9 rounded-full object-cover border border-slate-200 shadow-sm shrink-0" />
        ) : (
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-soft text-blue text-xs font-bold shadow-inner">
            {initials}
          </div>
        )}
        <span className="font-semibold text-navy">{coachName}</span>
      </div>
    );
  }
  if (key === "email" && resource === "coaches") return <span className="text-slate-600 font-mono text-[11px]">{row.user?.email || row.email || "—"}</span>;
  if (key === "phone" && resource === "coaches") return <span className="text-slate-600">{row.user?.phone || row.phone || "—"}</span>;
  if (key === "specialization" && resource === "coaches") {
    return (
      <span className="inline-flex items-center rounded-full bg-blue/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue">
        {row.specialization || "Coach"}
      </span>
    );
  }
  if (key === "description") return <span className="line-clamp-2 max-w-[300px]">{row.description || "—"}</span>;
  return row[key] || "—";
}

export default function AdminResourceView({ resource, initialRows, sports = [], title, description }) {
  const config = resourceConfig[resource];
  const [rows, setRows] = useState(initialRows || []);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({});
  const [showCoachPassword, setShowCoachPassword] = useState(false);
  const fileInputRef = useRef(null);

  const filtered = useMemo(() => rows.filter((row) => JSON.stringify(row).toLowerCase().includes(search.toLowerCase())), [rows, search]);

  function openForm(row = null) {
    setEditing(row);
    setForm(toForm(resource, row));
    setMessage("");
    setFormOpen(true);
  }

  function setValue(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image smaller than 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setValue("image", event.target.result);
    };
    reader.readAsDataURL(file);
  }

  function toggleSportTag(sportName) {
    const current = String(form.sports || "").split(",").map((s) => s.trim()).filter(Boolean);
    let updated;
    if (current.includes(sportName)) {
      updated = current.filter((s) => s !== sportName);
    } else {
      updated = [...current, sportName];
    }
    setValue("sports", updated.join(", "));
  }

  function bodyForSave() {
    const output = { ...form };
    if (resource === "coaches") {
      output.sports = String(output.sports || "").split(",").map((value) => value.trim()).filter(Boolean);
      if (output.experience !== "") output.experience = Number(output.experience);
      if (!output.password) delete output.password;
    } else if (resource === "membership") {
      output.duration = Number(output.duration);
      output.price = Number(output.price);
      output.features = String(output.features || "").split(",").map((value) => value.trim()).filter(Boolean);
    } else {
      output.focus = String(output.focus || "").split(",").map((value) => value.trim()).filter(Boolean);
    }
    return output;
  }

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const url = editing ? `${config.endpoint}/${editing._id}` : config.endpoint;
    try {
      const response = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyForSave()),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || `Could not save ${config.singular}.`);
      const saved = result.sport || result.plan || result.coach;
      if (editing) setRows((current) => current.map((row) => (row._id === editing._id ? saved : row)));
      else setRows((current) => [saved, ...current]);
      setFormOpen(false);
      setMessage(
        resource === "coaches"
          ? editing
            ? "Coach access details updated."
            : `Coach access granted for ${saved?.user?.name || "the coach"}. They can now sign in using ${saved?.user?.email || "their email"} and the temporary password.`
          : `${config.singular[0].toUpperCase()}${config.singular.slice(1)} saved.`
      );
    } catch (error) {
      setMessage(error.message || "Could not save this record.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleStatus(row) {
    const id = row._id;
    const reactivate = row.isActive === false;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`${config.endpoint}/${id}`, {
        method: reactivate ? "PUT" : "DELETE",
        headers: reactivate ? { "Content-Type": "application/json" } : {},
        body: reactivate ? JSON.stringify({ isActive: true }) : undefined,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || `Could not update status.`);
      setRows((current) =>
        current.map((item) =>
          item._id === id
            ? { ...item, isActive: reactivate, ...(resource === "coaches" ? { user: { ...item.user, isActive: reactivate } } : {}) }
            : item
        )
      );
      setMessage(reactivate ? "Coach access reactivated. The coach can now log in." : "Coach access deactivated. Login is now blocked.");
    } catch (error) {
      setMessage(error.message || "Could not update this record.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageIntro
        eyebrow="Academy management"
        title={title}
        description={description}
        action={
          <button onClick={() => openForm()} className="btn-primary">
            <Plus size={14} /> {config.buttonLabel || `Add ${config.singular}`}
          </button>
        }
      />

      <div className="surface-card overflow-hidden">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-[11px] font-bold text-navy">
              {rows.length} {config.singular}
              {rows.length === 1 ? "" : "s"}
            </p>
            <p className="mt-1 text-[9px] text-slate-400">Coaches provisioned here are authorized to log into the Coach Workspace.</p>
          </div>
          <label className="relative block w-full sm:max-w-[260px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="form-control !py-2 !pl-9 !text-[11px]"
              placeholder={`Search ${config.singular}s`}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        </div>

        {message && !formOpen && <p role="status" className="mx-4 mt-4 rounded-lg bg-blue-soft px-3 py-2 text-[10px] text-blue">{message}</p>}

        <div className="table-wrap border-0 rounded-none">
          <table className="data-table min-w-[680px]">
            <thead>
              <tr>
                {config.columns.map((key) => (
                  <th key={key} className="capitalize">
                    {key === "isActive" ? "Status" : key}
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row._id}>
                  {config.columns.map((key) => (
                    <td key={key}>{formatCell(resource, key, row)}</td>
                  ))}
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openForm(row)}
                        title={`Edit ${config.singular}`}
                        aria-label={`Edit ${config.singular}`}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-blue hover:text-blue transition"
                      >
                        <Edit3 size={13} />
                      </button>
                      {row.isActive === false ? (
                        <button
                          disabled={busy}
                          onClick={() => toggleStatus(row)}
                          title="Reactivate access"
                          aria-label="Reactivate access"
                          className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-600 transition"
                        >
                          <Check size={13} />
                        </button>
                      ) : (
                        <button
                          disabled={busy}
                          onClick={() => toggleStatus(row)}
                          title="Deactivate access"
                          aria-label="Deactivate access"
                          className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-red-200 hover:text-red-600 transition"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filtered.length && <div className="py-10 text-center text-xs text-slate-400">No {config.singular}s found.</div>}
      </div>

      {/* MODAL DIALOG */}
      {formOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-navy/40 p-4 backdrop-blur-xs animate-fadeIn"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setFormOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="resource-title"
            className="max-h-[90vh] w-full max-w-[620px] overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[.14em] text-blue">
                  {editing ? "Coach Account Management" : "Coach Provisioning"}
                </p>
                <h2 id="resource-title" className="mt-1 text-base font-bold text-navy">
                  {editing ? `Edit ${config.singular} Access & Profile` : config.buttonLabel || `New ${config.singular}`}
                </h2>
              </div>
              <button
                aria-label="Close dialog"
                onClick={() => setFormOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 transition"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={save} className="grid gap-4 p-5 sm:grid-cols-2">
              {/* Optional Profile Image Picker (Only for coaches) */}
              {resource === "coaches" && (
                <div className="sm:col-span-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-navy block">Profile Image (Optional)</span>
                      <span className="text-[10px] text-slate-500">
                        Upload coach photo to display in coach profiles, directory, and student assignment.
                      </span>
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-navy shadow-sm hover:border-blue hover:text-blue transition"
                    >
                      <Camera size={14} className="text-orange" />
                      {form.image ? "Change Photo" : "Upload Photo"}
                    </button>
                  </div>

                  {form.image && (
                    <div className="mt-3 flex items-center gap-3 border-t border-slate-200/80 pt-3">
                      <img
                        src={form.image}
                        alt="Coach profile preview"
                        className="h-14 w-14 rounded-2xl object-cover border border-slate-300 shadow-sm"
                      />
                      <div className="flex-1">
                        <p className="text-[11px] font-semibold text-navy">Photo Selected</p>
                        <p className="text-[10px] text-emerald-600 font-medium">Ready to save with profile</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setValue("image", "")}
                        className="text-xs text-red-500 hover:underline font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              )}

              {config.fields.map((field) => {
                const isEmail = field.key === "email";
                const isPassword = field.key === "password";
                const isReadOnlyEmail = editing && resource === "coaches" && isEmail;
                const isRequired = isPassword ? !editing : field.required && !isReadOnlyEmail;
                const label = isPassword && editing ? "Reset Temporary Password (leave blank to keep current)" : field.label;

                // 1. Textarea field (e.g. Bio)
                if (field.type === "textarea") {
                  return (
                    <label key={field.key} className="sm:col-span-2">
                      <span className="form-label">{label}</span>
                      <textarea
                        className="form-control min-h-24 resize-y"
                        required={isRequired}
                        maxLength={2000}
                        placeholder="Detail coaching philosophy, achievements, or training focus..."
                        value={form[field.key] || ""}
                        onChange={(event) => setValue(field.key, event.target.value)}
                      />
                    </label>
                  );
                }

                // 2. Specialization / Role Dropdown (Head Coach, Head Girl, Assistant Coach - Men, Assistant Coach - Women)
                if (field.type === "select-role") {
                  return (
                    <label key={field.key}>
                      <span className="form-label">{label}</span>
                      <select
                        className="form-control font-medium"
                        required={isRequired}
                        value={form[field.key] || COACH_ROLE_OPTIONS[0]}
                        onChange={(event) => setValue(field.key, event.target.value)}
                      >
                        {COACH_ROLE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </label>
                  );
                }

                // 3. Assigned Sports with interactive tag suggestions
                if (field.type === "sports-select") {
                  const currentSelected = String(form.sports || "")
                    .split(",")
                    .map((s) => s.trim().toLowerCase())
                    .filter(Boolean);

                  return (
                    <div key={field.key} className="sm:col-span-2 rounded-xl border border-slate-200 bg-paper/50 p-3">
                      <span className="form-label mb-1.5 block">Assigned Sports (Select or type)</span>
                      
                      {/* Clickable Quick Sport Suggestion Pills */}
                      <div className="flex flex-wrap gap-2 mb-2.5">
                        {SUGGESTED_SPORTS.map((sportName) => {
                          const isPicked = currentSelected.includes(sportName.toLowerCase());
                          return (
                            <button
                              key={sportName}
                              type="button"
                              onClick={() => toggleSportTag(sportName)}
                              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition border ${
                                isPicked
                                  ? "border-blue bg-blue text-white shadow-xs"
                                  : "border-slate-200 bg-white text-navy hover:bg-slate-100"
                              }`}
                            >
                              <SportIcon sport={sportName} className="h-4 w-4" floating={false} />
                              <span>{sportName}</span>
                              {isPicked && <Check size={12} strokeWidth={3} />}
                            </button>
                          );
                        })}
                      </div>

                      <input
                        className="form-control !py-2 !text-xs font-medium"
                        type="text"
                        required={isRequired}
                        placeholder="e.g. Cricket, Football, Basketball"
                        value={form.sports || ""}
                        onChange={(event) => setValue("sports", event.target.value)}
                      />
                      <span className="mt-1 block text-[9px] text-slate-400">
                        Click tags above to toggle or type sports separated by commas.
                      </span>
                    </div>
                  );
                }

                // 4. Standard Select (e.g. for Membership Plan sport)
                if (field.type === "select") {
                  return (
                    <label key={field.key}>
                      <span className="form-label">{label}</span>
                      <select
                        className="form-control"
                        required={isRequired}
                        value={form[field.key] || ""}
                        onChange={(event) => setValue(field.key, event.target.value)}
                      >
                        <option value="">Choose a sport</option>
                        {sports.map((sport) => (
                          <option key={sport._id || sport.slug} value={sport.slug || sport.name.toLowerCase()}>
                            {sport.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  );
                }

                // 5. Password Field with eye toggle
                if (isPassword) {
                  return (
                    <label key={field.key}>
                      <span className="form-label">{label}</span>
                      <div className="relative">
                        <input
                          className="form-control !pr-11"
                          type={showCoachPassword ? "text" : "password"}
                          required={isRequired}
                          minLength={8}
                          placeholder={
                            editing ? "Leave blank to keep existing password" : "At least 8 characters"
                          }
                          value={form[field.key] ?? ""}
                          onChange={(event) => setValue(field.key, event.target.value)}
                        />
                        <button
                          type="button"
                          className="input-eye-btn"
                          onClick={() => setShowCoachPassword(!showCoachPassword)}
                          aria-label={showCoachPassword ? "Hide password" : "Show password"}
                        >
                          {showCoachPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </label>
                  );
                }

                // 6. Default Input Fields (name, phone, email, experience)
                return (
                  <label key={field.key}>
                    <span className="form-label">{label}</span>
                    <input
                      className={`form-control ${isReadOnlyEmail ? "bg-slate-100 text-slate-500 cursor-not-allowed" : ""}`}
                      type={field.type || "text"}
                      disabled={isReadOnlyEmail}
                      readOnly={isReadOnlyEmail}
                      min={field.type === "number" ? 0 : undefined}
                      required={isRequired}
                      placeholder={field.key === "phone" ? "+91 98765 43210" : ""}
                      value={form[field.key] ?? ""}
                      onChange={(event) => setValue(field.key, event.target.value)}
                    />
                    {isReadOnlyEmail && (
                      <span className="mt-1 block text-[9px] text-slate-400">
                        Email cannot be changed after coach access is created.
                      </span>
                    )}
                  </label>
                );
              })}

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 sm:col-span-2">
                <button className="btn-secondary" type="button" onClick={() => setFormOpen(false)}>
                  Cancel
                </button>
                <button disabled={busy} className="btn-primary disabled:opacity-60" type="submit">
                  {busy ? "Saving…" : editing ? "Update Coach Access" : "Grant Coach Access"}{" "}
                  <ShieldCheck size={14} />
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
