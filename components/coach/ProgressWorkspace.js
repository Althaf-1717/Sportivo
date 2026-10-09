"use client";
import { useState } from "react";
import { Activity, Save } from "lucide-react";
import { dateLabel } from "@/lib/utils";
import EmptyState from "@/components/dashboard/EmptyState";

const scoreFields = [["fitnessScore", "Fitness"], ["technicalScore", "Technical"], ["performanceScore", "Performance"]];
export default function ProgressWorkspace({ enrollments, initialProgress }) {
  const [enrollmentId, setEnrollmentId] = useState("");
  const [skillLevel, setSkillLevel] = useState("Beginner");
  const [scores, setScores] = useState({ fitnessScore: 50, technicalScore: 50, performanceScore: 50 });
  const [customOverall, setCustomOverall] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [trainingNotes, setTrainingNotes] = useState("");
  const [records, setRecords] = useState(initialProgress || []);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const calculatedOverall = Math.round((scores.fitnessScore + scores.technicalScore + scores.performanceScore) / 3);
  const overall = customOverall !== null ? customOverall : calculatedOverall;

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollmentId, skillLevel, ...scores, overallProgress: overall, remarks, trainingNotes }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save this review.");
      const selected = enrollments.find((row) => row._id === enrollmentId);
      setRecords((current) => [{ ...data.progress, student: selected?.student, sport: selected?.sport }, ...current]);
      setMessage("Progress review saved. The student can now see the update.");
      setRemarks("");
      setTrainingNotes("");
      setCustomOverall(null);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[.8fr_1.2fr]">
      <section className="surface-card p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange/10 text-orange"><Activity size={17} /></span>
          <div>
            <h3 className="text-sm font-bold text-navy">Add a progress review</h3>
            <p className="mt-1 text-[10px] text-slate-500">Scores are 0–100. Update skills, scores, and overall progress.</p>
          </div>
        </div>
        <form onSubmit={submit} className="mt-5 grid gap-4">
          <label>
            <span className="form-label">Student</span>
            <select className="form-control" value={enrollmentId} required onChange={(event) => setEnrollmentId(event.target.value)}>
              <option value="">Choose an active student</option>
              {enrollments.map((row) => <option key={row._id} value={row._id}>{row.student?.name} · {row.sport?.name}</option>)}
            </select>
          </label>
          <label>
            <span className="form-label">Skill level</span>
            <select className="form-control" value={skillLevel} onChange={(event) => setSkillLevel(event.target.value)}>
              {["Beginner", "Intermediate", "Advanced", "Professional"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <div className="grid gap-3 sm:grid-cols-3">
            {scoreFields.map(([key, label]) => (
              <label key={key}>
                <span className="form-label">{label} score</span>
                <input className="form-control" type="number" min="0" max="100" value={scores[key]} onChange={(event) => setScores((current) => ({ ...current, [key]: Number(event.target.value) }))} required />
              </label>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-[1fr_auto] items-end rounded-xl bg-blue-soft p-3">
            <label className="block flex-1">
              <span className="form-label text-[10px]">Overall progress percentage (0–100%)</span>
              <input className="form-control bg-white" type="number" min="0" max="100" value={overall} onChange={(e) => setCustomOverall(Number(e.target.value))} required />
            </label>
            <button type="button" onClick={() => setCustomOverall(null)} className="h-[38px] px-3 rounded-lg border border-blue/20 bg-white text-[10px] font-semibold text-blue hover:bg-blue-soft transition">
              Reset to avg ({calculatedOverall}%)
            </button>
          </div>
          <label>
            <span className="form-label">Coach remarks</span>
            <textarea className="form-control min-h-20 resize-y" maxLength={1000} value={remarks} onChange={(event) => setRemarks(event.target.value)} placeholder="Note a clear win or next focus" />
          </label>
          <label>
            <span className="form-label">Training notes</span>
            <textarea className="form-control min-h-20 resize-y" maxLength={2000} value={trainingNotes} onChange={(event) => setTrainingNotes(event.target.value)} placeholder="Optional practice notes" />
          </label>
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-[10px] text-red-700">{error}</p>}
          {message && <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-[10px] text-emerald-700">{message}</p>}
          <button disabled={!enrollments.length || busy} className="btn-primary disabled:opacity-50" type="submit">
            {busy ? "Saving…" : "Save progress review"} <Save size={14} />
          </button>
        </form>
      </section>
      <section className="surface-card p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-navy">Recent reviews</h3>
            <p className="mt-1 text-[10px] text-slate-500">Latest student progress updates.</p>
          </div>
          <span className="pill">{records.length} reviews</span>
        </div>
        {records.length ? (
          <div className="mt-4 grid gap-3">
            {records.slice(0, 8).map((row) => (
              <article key={row._id} className="rounded-xl border border-slate-100 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-navy">{row.student?.name || "Student"}</p>
                    <p className="mt-1 text-[9px] text-slate-500">{row.sport?.name || "Training"} · {dateLabel(row.createdAt)}</p>
                  </div>
                  <span className="status-good">{row.overallProgress}% · {row.skillLevel}</span>
                </div>
                <p className="mt-3 text-[10px] leading-5 text-slate-600">{row.remarks || "No remarks added."}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-4"><EmptyState title="No reviews added yet." description="A progress note will show here once you save the first student review." /></div>
        )}
      </section>
    </div>
  );
}
