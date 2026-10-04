"use client";

import { useState, useMemo } from "react";
import {
  CalendarCheck2,
  CheckCircle2,
  Send,
  Users,
} from "lucide-react";
import { dateLabel } from "@/lib/utils";
import EmptyState from "@/components/dashboard/EmptyState";

function getTodayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getCurrentTimeString() {
  const d = new Date();
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
}

export default function AttendanceWorkspace({ enrollments = [], initialAttendance = [] }) {
  // Session details (as shown in Image 2)
  const [date, setDate] = useState(getTodayString);
  const [time, setTime] = useState(getCurrentTimeString);
  const [work, setWork] = useState("Technique drills, footwork conditioning, and match simulations");
  const [isSessionConfirmed, setIsSessionConfirmed] = useState(true);

  // Student toggle attendance state: map enrollmentId -> { status: "present" | "absent", remarks: string }
  const [studentStates, setStudentStates] = useState(() => {
    const map = {};
    for (const e of enrollments) {
      map[String(e._id)] = {
        status: "present",
        remarks: "Good effort and focus in training session.",
      };
    }
    return map;
  });

  const [records, setRecords] = useState(initialAttendance || []);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Toggle student attendance status between ON (present) and OFF (absent)
  function toggleAttendance(enrollmentId) {
    setStudentStates((prev) => {
      const current = prev[enrollmentId] || { status: "present", remarks: "" };
      const nextStatus = current.status === "present" ? "absent" : "present";
      return {
        ...prev,
        [enrollmentId]: {
          ...current,
          status: nextStatus,
        },
      };
    });
  }

  function handleRemarksChange(enrollmentId, remarksText) {
    setStudentStates((prev) => {
      const current = prev[enrollmentId] || { status: "present", remarks: "" };
      return {
        ...prev,
        [enrollmentId]: {
          ...current,
          remarks: remarksText,
        },
      };
    });
  }

  // Handle Submit: records attendance for all enrolled students of this coach
  async function submitAttendance(event) {
    if (event) event.preventDefault();
    if (!enrollments.length) return;

    setBusy(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        date: new Date(`${date}T00:00:00.000Z`).toISOString(),
        time: time.trim(),
        work: work.trim(),
        records: enrollments.map((e) => {
          const state = studentStates[String(e._id)] || { status: "present", remarks: "" };
          return {
            enrollmentId: String(e._id),
            status: state.status,
            remarks: state.remarks.trim(),
          };
        }),
      };

      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not record attendance.");

      // Refresh records list
      if (Array.isArray(data.attendance)) {
        setRecords((current) => [...data.attendance, ...current]);
      }

      setMessage(`Attendance successfully recorded for ${payload.records.length} student${payload.records.length > 1 ? "s" : ""}!`);
    } catch (err) {
      setError(err.message || "Failed to submit attendance.");
    } finally {
      setBusy(false);
    }
  }

  const presentCount = useMemo(() => {
    return enrollments.filter((e) => studentStates[String(e._id)]?.status === "present").length;
  }, [enrollments, studentStates]);

  const absentCount = enrollments.length - presentCount;

  return (
    <div className="space-y-6">
      {/* Title & Top Session Controls (Image 2 - Coach Attendance for student) */}
      <section className="surface-card overflow-hidden p-6 sm:p-7 border border-slate-200 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy text-orange shadow-sm">
              <CalendarCheck2 size={18} />
            </span>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-navy sm:text-xl">
                Coach Attendance for student
              </h2>
              <p className="text-xs text-slate-500">
                Mark attendance for students who selected you as their coach.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-800">
              Present: {presentCount}
            </span>
            <span className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-700">
              Absent: {absentCount}
            </span>
          </div>
        </div>

        {/* Date, Time, Work inputs and OK button (Image 2) */}
        <div className="mt-5 rounded-2xl bg-paper/60 p-4 sm:p-5 border border-slate-200/80">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12 items-end">
            {/* Date input */}
            <div className="lg:col-span-3">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Date:
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-control bg-white font-semibold text-navy text-xs"
                required
              />
            </div>

            {/* Time input */}
            <div className="lg:col-span-3">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Time:
              </label>
              <input
                type="text"
                value={time}
                placeholder="e.g. 06:30 PM"
                onChange={(e) => setTime(e.target.value)}
                className="form-control bg-white font-semibold text-navy text-xs"
                required
              />
            </div>

            {/* Work input (manually text by coach) */}
            <div className="lg:col-span-5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Work: <span className="text-[10px] lowercase font-normal text-slate-400">(today&apos;s training drills)</span>
              </label>
              <input
                type="text"
                value={work}
                placeholder="e.g. Batting stance, net bowling, agility sprints"
                onChange={(e) => setWork(e.target.value)}
                className="form-control bg-white text-navy text-xs"
                required
              />
            </div>

            {/* OK button */}
            <div className="lg:col-span-1">
              <button
                type="button"
                onClick={() => setIsSessionConfirmed(true)}
                className="btn-primary w-full !text-xs !py-2.5 font-bold"
              >
                OK
              </button>
            </div>
          </div>
        </div>

        {/* Feedback Messages */}
        {message && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-800">
            {error}
          </div>
        )}

        {/* STUDENT ROSTER TABLE (Image 2) */}
        {isSessionConfirmed && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-navy flex items-center gap-2">
                <Users size={16} className="text-blue" />
                <span>Assigned Athletes ({enrollments.length})</span>
              </h3>
              <span className="text-[11px] text-slate-400">
                Only athletes who selected you as coach appear here
              </span>
            </div>

            {enrollments.length === 0 ? (
              <EmptyState
                title="No students assigned yet."
                description="When new students choose you as their coach during registration, they will appear in this roster."
              />
            ) : (
              <div className="table-wrap rounded-2xl border border-slate-200 overflow-hidden">
                <table className="data-table">
                  <thead className="bg-paper text-slate-600">
                    <tr>
                      <th className="w-16 text-center">S:NO</th>
                      <th className="w-36">Student ID</th>
                      <th>Student Name</th>
                      <th>Sport</th>
                      <th className="text-center w-48">Mark attendance</th>
                      <th>Coach Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {enrollments.map((row, index) => {
                      const eId = String(row._id);
                      const currentStatus = studentStates[eId]?.status || "present";
                      const currentRemarks = studentStates[eId]?.remarks || "";
                      const isPresent = currentStatus === "present";
                      const studentIdDisplay = row.student?.studentId ? `${row.student.studentId}` : `${10001 + index}`;

                      return (
                        <tr key={eId} className="hover:bg-slate-50/80 transition-colors">
                          {/* S:NO */}
                          <td className="text-center font-bold text-slate-400 text-xs">
                            {index + 1}
                          </td>

                          {/* Student ID */}
                          <td>
                            <span className="font-mono text-xs font-bold text-blue bg-blue-soft/60 px-2.5 py-1 rounded-lg inline-block">
                              {studentIdDisplay}
                            </span>
                          </td>

                          {/* Student Name */}
                          <td>
                            <div className="flex items-center gap-2.5">
                              <span className="grid h-7 w-7 place-items-center rounded-full bg-navy text-[10px] font-bold text-white">
                                {row.student?.name?.[0] || "S"}
                              </span>
                              <div>
                                <span className="block font-bold text-navy text-xs">
                                  {row.student?.name || "Student"}
                                </span>
                                <span className="block text-[10px] text-slate-400">
                                  {row.student?.email}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Sport */}
                          <td>
                            <span className="text-xs font-medium text-slate-600">
                              {row.sport?.name || "Sport"}
                            </span>
                          </td>

                          {/* Mark attendance (Interactive Toggle Switch - ON/Green, OFF/Red as in Image 2) */}
                          <td className="text-center">
                            <button
                              type="button"
                              onClick={() => toggleAttendance(eId)}
                              aria-label={`Mark ${row.student?.name} ${isPresent ? "absent" : "present"}`}
                              className={`group inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all shadow-sm ${
                                isPresent
                                  ? "bg-emerald-600 text-white hover:bg-emerald-700 ring-2 ring-emerald-200"
                                  : "bg-rose-600 text-white hover:bg-rose-700 ring-2 ring-rose-200"
                              }`}
                            >
                              <span
                                className={`h-2.5 w-2.5 rounded-full ${
                                  isPresent ? "bg-white animate-pulse" : "bg-white/80"
                                }`}
                              />
                              <span>{isPresent ? "ON (Present)" : "OFF (Absent)"}</span>
                            </button>
                          </td>

                          {/* Remarks */}
                          <td>
                            <input
                              type="text"
                              value={currentRemarks}
                              onChange={(e) => handleRemarksChange(eId, e.target.value)}
                              placeholder="Session notes / feedback"
                              className="form-control !py-1 !text-xs bg-white"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Submit button at bottom right (Image 2) */}
            {enrollments.length > 0 && (
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-500">
                  Clicking Submit updates the students&apos; attendance history and percentage rate immediately.
                </p>
                <button
                  type="button"
                  disabled={busy}
                  onClick={submitAttendance}
                  className="btn-primary !py-2.5 !px-6 shadow-md"
                >
                  <Send size={15} />
                  <span>{busy ? "Submitting…" : "Submit"}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* RECENT ATTENDANCE SESSIONS LOG */}
      <section className="surface-card p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-navy">Recently Recorded Sessions</h3>
            <p className="text-xs text-slate-500">Log of sessions marked with student attendance, drills, and remarks.</p>
          </div>
          <span className="rounded-lg bg-blue-soft px-2.5 py-1 text-[11px] font-bold text-blue">
            {records.length} records
          </span>
        </div>

        {records.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Work / Drills</th>
                  <th>Time</th>
                  <th>Student</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {records.slice(0, 15).map((row) => (
                  <tr key={row._id}>
                    <td className="font-semibold text-navy text-xs">{dateLabel(row.date)}</td>
                    <td className="max-w-xs text-xs text-slate-700 truncate">{row.work || "Training session"}</td>
                    <td className="text-xs text-slate-500">{row.time || "—"}</td>
                    <td>
                      <span className="font-bold text-navy text-xs">{row.student?.name || "Athlete"}</span>
                    </td>
                    <td>
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                          row.status === "present"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="text-xs text-slate-500 max-w-xs truncate">{row.remarks || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-4 text-center">No attendance sessions recorded yet.</p>
        )}
      </section>
    </div>
  );
}
