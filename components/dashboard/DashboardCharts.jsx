"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const COLORS = ["#155EEF", "#FF7A00", "#58A880", "#9AAAC2"];

export function ProgressTrendChart({ data = [] }) {
  const rows = data.length ? data : [{ label: "No data", progress: 0 }];
  return <div className="h-[225px] w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}><CartesianGrid stroke="#edf0f5" vertical={false} /><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#8490a3" }} /><YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#8490a3" }} /><Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e6eaf0", fontSize: 11 }} /><Area type="monotone" dataKey="progress" stroke="#155EEF" strokeWidth={2.5} fill="#EAF2FF" activeDot={{ r: 4, fill: "#FF7A00" }} /></AreaChart></ResponsiveContainer></div>;
}

export function ProgressDistributionChart({ data = [] }) {
  const levels = ["Beginner", "Intermediate", "Advanced", "Professional"];
  const counts = new Map(data.map((row) => [row.level, row.students]));
  const rows = levels.map((level) => ({ level, students: counts.get(level) || 0 }));
  return <div className="h-[225px] w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}><CartesianGrid stroke="#edf0f5" vertical={false} /><XAxis dataKey="level" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#8490a3" }} /><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#8490a3" }} /><Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e6eaf0", fontSize: 11 }} /><Bar dataKey="students" name="Students" fill="#155EEF" radius={[5, 5, 0, 0]} maxBarSize={38} /></BarChart></ResponsiveContainer></div>;
}

export function RevenueChart({ data = [] }) {
  const rows = data.length ? data.map((row) => ({ ...row, month: row.month.slice(5) })) : [{ month: "—", amount: 0 }];
  return <div className="h-[240px] w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={rows} margin={{ top: 8, right: 4, bottom: 0, left: -18 }}><CartesianGrid stroke="#edf0f5" vertical={false} /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#8490a3" }} /><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#8490a3" }} /><Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e6eaf0", fontSize: 11 }} formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Revenue"]} /><Bar dataKey="amount" fill="#155EEF" radius={[5, 5, 0, 0]} maxBarSize={34} /></BarChart></ResponsiveContainer></div>;
}

export function SportMixChart({ data = [] }) {
  const rows = data.length ? data : [{ name: "No enrollments", count: 1 }];
  return <div className="flex h-[220px] items-center"><div className="h-full w-1/2"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={rows} dataKey="count" nameKey="name" innerRadius={53} outerRadius={80} paddingAngle={3} stroke="none">{rows.map((row, index) => <Cell key={row.name} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e6eaf0", fontSize: 11 }} /></PieChart></ResponsiveContainer></div><div className="grid gap-3">{rows.slice(0, 4).map((row, index) => <div key={row.name} className="flex items-center gap-2 text-[10px] text-slate-600"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />{row.name}<b className="ml-1 text-navy">{row.count}</b></div>)}</div></div>;
}

export function AttendanceBars({ data = [] }) {
  const rows = data.length ? data.slice(-10).map((row) => ({ ...row, day: new Date(row.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) })) : [{ day: "—", present: 0, absent: 0 }];
  return <div className="h-[220px] w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={rows} margin={{ top: 8, right: 4, bottom: 0, left: -18 }}><CartesianGrid stroke="#edf0f5" vertical={false} /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#8490a3" }} /><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#8490a3" }} /><Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e6eaf0", fontSize: 11 }} /><Bar dataKey="present" stackId="a" fill="#58A880" radius={[0, 0, 4, 4]} /><Bar dataKey="absent" stackId="a" fill="#FF7A00" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>;
}
