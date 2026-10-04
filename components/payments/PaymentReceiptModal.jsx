"use client";

import { useState } from "react";
import { Download, FileText, Printer, X, CheckCircle, ShieldCheck } from "lucide-react";
import { money, dateLabel } from "@/lib/utils";

export default function PaymentReceiptModal({ payment, user }) {
  const [open, setOpen] = useState(false);

  const receiptNumber = `FH-REC-${String(payment._id || "").slice(-6).toUpperCase()}`;
  const planName = payment.membershipPlan?.name || "Academy Membership";
  const duration = payment.membershipPlan?.duration || 1;
  const classes = duration === 1 ? 30 : duration === 3 ? 90 : 180;
  const sportName = payment.sport?.name || "Academy Sports";
  const coachName = payment.coach?.name ? `Coach ${payment.coach.name}` : "Assigned Academy Coach";
  const txId = payment.razorpayPaymentId || payment.razorpayOrderId || "N/A";
  const studentId = user?.studentId ? `#${user.studentId}` : "#10001";
  const formattedDate = dateLabel(payment.createdAt, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  function handlePrint() {
    window.print();
  }

  function handleDownloadTxt() {
    const textContent = `
==================================================
           SPORTIVO SPORTS ACADEMY
          OFFICIAL MEMBERSHIP FEE RECEIPT
==================================================
Receipt No:      ${receiptNumber}
Date:            ${formattedDate}
Transaction ID:  ${txId}
Status:          COMPLETED & VERIFIED
--------------------------------------------------
STUDENT DETAILS
Name:            ${user?.name || "Athlete"}
Student ID:      ${studentId}
Email:           ${user?.email || "N/A"}
--------------------------------------------------
PROGRAM SELECTIONS
Membership Plan: ${planName} (${duration} Month${duration > 1 ? "s" : ""} / ${classes} Classes)
Chosen Sport:    ${sportName}
Assigned Coach:  ${coachName}
--------------------------------------------------
PAYMENT SUMMARY
Payment Gateway: Razorpay UPI / Online
Amount Paid:     INR ${payment.amount}
Payment Status:  SUCCESSFUL
==================================================
Thank you for training with Sportivo Academy!
Keep pushing your limits.
==================================================
    `.trim();

    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Sportivo-Receipt-${receiptNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-navy shadow-sm transition hover:border-blue hover:bg-blue-soft hover:text-blue"
      >
        <Download size={13} className="text-blue" />
        <span>Download Receipt</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-paper px-6 py-4">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-blue" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-navy">
                  Payment Receipt
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-200 hover:text-navy"
              >
                <X size={16} />
              </button>
            </div>

            {/* Printable Receipt Body */}
            <div id="receipt-print-area" className="p-6 sm:p-8">
              {/* Receipt Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-navy text-[11px] font-bold text-orange">
                      SP
                    </span>
                    <div>
                      <h4 className="text-sm font-extrabold tracking-tight text-navy">SPORTIVO ACADEMY</h4>
                      <p className="text-[9px] uppercase tracking-wider text-slate-400">Official Fee Receipt</p>
                    </div>
                  </div>
                  <p className="mt-3 text-[11px] text-slate-500">
                    Receipt No: <strong className="text-navy">{receiptNumber}</strong>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Date: <span className="text-navy">{formattedDate}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                    <CheckCircle size={12} /> PAID
                  </span>
                  <p className="mt-2 text-[10px] text-slate-400">Order ID: {txId.slice(0, 16)}...</p>
                </div>
              </div>

              {/* Student & Program Details */}
              <div className="mt-5 grid grid-cols-2 gap-4 text-xs">
                <div className="rounded-xl bg-paper/70 p-3 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Billed To</span>
                  <p className="mt-1 font-bold text-navy">{user?.name || "Student"}</p>
                  <p className="text-[11px] text-slate-500">{user?.email}</p>
                  <span className="mt-1.5 inline-block rounded-md bg-blue-soft px-2 py-0.5 text-[10px] font-bold text-blue">
                    Student ID: {studentId}
                  </span>
                </div>

                <div className="rounded-xl bg-paper/70 p-3 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Program Info</span>
                  <p className="mt-1 font-bold text-navy">{sportName}</p>
                  <p className="text-[11px] text-slate-500">{coachName}</p>
                  <span className="mt-1.5 inline-block rounded-md bg-orange/10 px-2 py-0.5 text-[10px] font-bold text-orange">
                    {classes} Classes Included
                  </span>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="mt-5 rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-paper border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="p-3">Description</th>
                      <th className="p-3 text-center">Duration</th>
                      <th className="p-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3">
                        <strong className="block text-navy">{planName}</strong>
                        <span className="text-[10px] text-slate-400">Coaching, facilities, and attendance tracking</span>
                      </td>
                      <td className="p-3 text-center text-slate-600">{duration} Month{duration > 1 ? "s" : ""}</td>
                      <td className="p-3 text-right font-bold text-navy">{money(payment.amount)}</td>
                    </tr>
                  </tbody>
                  <tfoot className="border-t border-slate-200 bg-paper/50 font-bold text-navy">
                    <tr>
                      <td colSpan={2} className="p-3 text-right text-xs">Total Amount Paid:</td>
                      <td className="p-3 text-right text-sm text-blue">{money(payment.amount)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Security & Verification note */}
              <div className="mt-4 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-500" />
                  Verified electronic receipt
                </span>
                <span>Sportivo Sports Academy India</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 bg-paper px-6 py-4">
              <button
                type="button"
                onClick={handleDownloadTxt}
                className="btn-secondary !text-xs !py-2"
              >
                <Download size={13} /> Text Receipt
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="btn-primary !text-xs !py-2"
              >
                <Printer size={13} /> Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
