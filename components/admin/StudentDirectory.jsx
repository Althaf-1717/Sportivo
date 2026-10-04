"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Trash2, UserRound, UserRoundX } from "lucide-react";
import PageIntro from "@/components/dashboard/PageIntro";
import { dateLabel } from "@/lib/utils";

export default function StudentDirectory({ initialStudents }) {
  const [students, setStudents] = useState(initialStudents || []);
  const [search, setSearch] = useState("");
  const [sport, setSport] = useState("all");
  const [membership, setMembership] = useState("all");
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const sports = [...new Set(students.map((student) => student.enrollment?.sport?.name).filter(Boolean))];
  const memberships = [...new Set(students.map((student) => student.enrollment?.membershipPlan?.name).filter(Boolean))];
  const filtered = useMemo(() => students.filter((student) => `${student.name} ${student.email}`.toLowerCase().includes(search.toLowerCase()) && (sport === "all" || student.enrollment?.sport?.name === sport) && (membership === "all" || student.enrollment?.membershipPlan?.name === membership)), [students, search, sport, membership]);

  async function toggleAccount(student) {
    setBusy(student._id); setMessage("");
    try {
      const response = await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: student._id, isActive: !student.isActive }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not update this account.");
      setStudents((current) => current.map((item) => item._id === student._id ? { ...item, isActive: result.user.isActive } : item));
      setMessage(`${student.name}’s account is ${result.user.isActive ? "active" : "disabled"}.`);
    } catch (error) { setMessage(error.message); }
    finally { setBusy(""); }
  }

  async function removeStudent(student) {
    if (!confirm(`Are you sure you want to remove ${student.name}'s account?`)) return;
    setBusy(student._id); setMessage("");
    try {
      const response = await fetch(`/api/admin/users?id=${student._id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not delete account.");
      setStudents((current) => current.filter((item) => item._id !== student._id));
      setMessage(`${student.name}’s account was removed.`);
    } catch (error) { setMessage(error.message); }
    finally { setBusy(""); }
  }

  return <div><PageIntro eyebrow="Academy management" title="Students" description="Find students, review their current programme, and manage account access." /><div className="surface-card overflow-hidden"><div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center"><p className="mr-auto text-[11px] font-bold text-navy">{filtered.length} of {students.length} students</p><label className="relative block w-full md:max-w-[240px]"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input className="form-control !py-2 !pl-9 !text-[11px]" placeholder="Search name or email" value={search} onChange={(event) => setSearch(event.target.value)} /></label><select className="form-control !w-full !py-2 !text-[11px] md:!w-[150px]" value={sport} onChange={(event) => setSport(event.target.value)}><option value="all">All sports</option>{sports.map((name) => <option key={name}>{name}</option>)}</select><select className="form-control !w-full !py-2 !text-[11px] md:!w-[170px]" value={membership} onChange={(event) => setMembership(event.target.value)}><option value="all">All memberships</option>{memberships.map((name) => <option key={name}>{name}</option>)}</select></div>{message && <p role="status" className="mx-4 mt-3 rounded-lg bg-blue-soft px-3 py-2 text-[10px] text-blue">{message}</p>}{filtered.length ? <div className="table-wrap border-0 rounded-none"><table className="data-table"><thead><tr><th>Student</th><th>Sport</th><th>Membership</th><th>Coach</th><th>Joined</th><th>Account</th><th>Actions</th></tr></thead><tbody>{filtered.map((student) => <tr key={student._id}><td><Link href={`/students/${student._id}`} className="font-semibold text-navy hover:text-blue">{student.name}</Link><span className="mt-1 block text-[10px] text-slate-400">{student.email}</span></td><td>{student.enrollment?.sport?.name || "—"}</td><td>{student.enrollment?.membershipPlan?.name || "Not enrolled"}</td><td>{student.enrollment?.coach?.name || "—"}</td><td>{dateLabel(student.createdAt)}</td><td><span className={student.isActive ? "status-good" : "status-muted"}>{student.isActive ? "Active" : "Disabled"}</span></td><td><div className="flex items-center gap-1.5"><button disabled={busy === student._id} onClick={() => toggleAccount(student)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 hover:border-blue hover:text-blue disabled:opacity-50"><UserRoundX size={13} /> {student.isActive ? "Disable" : "Enable"}</button><button disabled={busy === student._id} onClick={() => removeStudent(student)} title="Delete account" className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-1.5 text-[10px] font-semibold text-slate-400 hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"><Trash2 size={13} /></button></div></td></tr>)}</tbody></table></div> : <div className="p-4"><div className="py-12 text-center"><span className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-blue-soft text-blue"><UserRound size={17} /></span><p className="mt-3 text-xs font-semibold text-navy">No students found.</p><p className="mt-1 text-[10px] text-slate-500">Try changing your search or programme filters.</p></div></div>}</div></div>;
}
