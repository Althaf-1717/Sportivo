"use client";

import { useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import PageIntro from "@/components/dashboard/PageIntro";
import EmptyState from "@/components/dashboard/EmptyState";
import { dateLabel, money } from "@/lib/utils";

const formatters = {
  enrollments: { headers: ["Student", "Sport", "Coach", "Membership", "Period", "Status"], cells: (row) => [row.student?.name, row.sport?.name, row.coach?.name, row.membershipPlan?.name, `${dateLabel(row.startDate)} – ${dateLabel(row.endDate)}`, row.status] },
  attendance: { headers: ["Student", "Sport", "Date", "Status", "Coach", "Remarks"], cells: (row) => [row.student?.name, row.sport?.name, dateLabel(row.date), row.status, row.coach?.name, row.remarks || "—"] },
  progress: { headers: ["Student", "Sport", "Level", "Fitness", "Technical", "Performance", "Overall", "Date"], cells: (row) => [row.student?.name, row.sport?.name, row.skillLevel, `${row.fitnessScore}%`, `${row.technicalScore}%`, `${row.performanceScore}%`, `${row.overallProgress}%`, dateLabel(row.createdAt)] },
  payments: { headers: ["Student", "Membership", "Amount", "Payment ID", "Date", "Status"], cells: (row) => [row.student?.name, row.membershipPlan?.name, money(row.amount), row.razorpayPaymentId || row.razorpayOrderId, dateLabel(row.createdAt), row.status] },
};

export default function AdminRecordsTable({ kind, rows, title, description }) {
  const [dataRows, setDataRows] = useState(rows || []);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [busy, setBusy] = useState("");
  const formatter = formatters[kind];
  const canDelete = kind === "attendance" || kind === "progress";
  const statuses = [...new Set(dataRows.map((row) => row.status).filter(Boolean))];
  const filtered = useMemo(() => dataRows.filter((row) => JSON.stringify(row).toLowerCase().includes(search.toLowerCase()) && (status === "all" || row.status === status)), [dataRows, search, status]);

  async function deleteRecord(id) {
    if (!confirm("Are you sure you want to delete this record?")) return;
    setBusy(id);
    try {
      const endpoint = kind === "attendance" ? `/api/attendance/${id}` : `/api/progress/${id}`;
      const response = await fetch(endpoint, { method: "DELETE" });
      if (!response.ok) throw new Error("Could not delete record.");
      setDataRows((current) => current.filter((row) => row._id !== id));
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy("");
    }
  }

  return <div><PageIntro eyebrow="Academy records" title={title} description={description} /><div className="surface-card overflow-hidden"><div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center"><p className="mr-auto text-[11px] font-bold text-navy">Showing {filtered.length} of {dataRows.length} record{dataRows.length === 1 ? "" : "s"}</p>{statuses.length > 1 && <select aria-label="Filter by status" className="form-control !w-full !py-2 !text-[11px] sm:!w-[150px]" value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option>{statuses.map((value) => <option key={value} value={value}>{value[0].toUpperCase() + value.slice(1)}</option>)}</select>}<label className="relative block w-full sm:max-w-[260px]"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input className="form-control !py-2 !pl-9 !text-[11px]" placeholder="Search records" value={search} onChange={(event) => setSearch(event.target.value)} /></label></div>{filtered.length ? <div className="table-wrap border-0 rounded-none"><table className="data-table"><thead><tr>{formatter.headers.map((header) => <th key={header}>{header}</th>)}{canDelete && <th>Action</th>}</tr></thead><tbody>{filtered.map((row) => <tr key={row._id}>{formatter.cells(row).map((cell, index) => <td key={formatter.headers[index]}>{formatter.headers[index] === "Status" ? <span className={cell === "active" || cell === "successful" || cell === "present" ? "status-good" : "status-muted"}>{cell}</span> : cell}</td>)}{canDelete && <td><button disabled={busy === row._id} onClick={() => deleteRecord(row._id)} title="Delete record" className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-1.5 text-[10px] font-semibold text-slate-400 hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"><Trash2 size={13} /></button></td>}</tr>)}</tbody></table></div> : <div className="p-4"><EmptyState title="No matching records." description="Try a different search or status filter, or check back when there’s more activity." /></div>}</div></div>;
}
