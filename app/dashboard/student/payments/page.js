import { CheckCircle2, Hourglass, XCircle } from "lucide-react";
import PageIntro from "@/components/dashboard/PageIntro";
import StatCard from "@/components/dashboard/StatCard";
import EmptyState from "@/components/dashboard/EmptyState";
import { currentUser } from "@/lib/server-auth";
import { getStudentDashboard } from "@/lib/dashboard-data";
import { dateLabel, money } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import PaymentReceiptModal from "@/components/payments/PaymentReceiptModal";

export const dynamic = "force-dynamic";

export default async function StudentPaymentsPage({ searchParams }) {
  const user = await currentUser();
  const [data, params] = await Promise.all([getStudentDashboard(user.id), searchParams]);
  const successful = data.payments.filter((payment) => payment.status === "successful");
  const pending = data.payments.filter((payment) => payment.status === "pending");
  const failed = data.payments.filter((payment) => ["failed", "refunded"].includes(payment.status));

  return (
    <div>
      <PageIntro
        eyebrow="Billing and Invoices"
        title="Payments"
        description="Your membership payments, chosen program details, and downloadable fee receipts stay together here."
      />

      {params?.success === "1" && (
        <div role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
          Payment verified and membership activated successfully.
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          icon={CheckCircle2}
          label="Successful payments"
          value={successful.length}
          note={`${money(successful.reduce((sum, payment) => sum + payment.amount, 0))} paid`}
          tone="green"
        />
        <StatCard
          icon={Hourglass}
          label="Pending"
          value={pending.length}
          note="Orders awaiting verification"
          tone="orange"
        />
        <StatCard
          icon={XCircle}
          label="Failed or refunded"
          value={failed.length}
          note="No amount was added to membership"
        />
      </div>

      <section className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-navy">Payment & Program History</h3>
          <span className="text-xs text-slate-500">Student ID: #{user.studentId || 10001}</span>
        </div>

        {data.payments.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Membership Plan</th>
                  <th>Sport</th>
                  <th>Coach</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="text-right">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {data.payments.map((payment) => {
                  const planDuration = payment.membershipPlan?.duration || 1;
                  const classes = planDuration === 1 ? 30 : planDuration === 3 ? 90 : 180;
                  return (
                    <tr key={payment._id}>
                      <td>
                        <strong className="block text-navy font-bold">{payment.membershipPlan?.name || "Academy Membership"}</strong>
                        <span className="text-[10px] text-slate-400">{classes} Classes ({planDuration} mo)</span>
                      </td>
                      <td>
                        <span className="inline-flex items-center gap-1 font-semibold text-navy">
                          {payment.sport?.name || data.currentEnrollment?.sport?.name || "Sport"}
                        </span>
                      </td>
                      <td>
                        <span className="text-slate-600 font-medium">
                          {payment.coach?.name ? `Coach ${payment.coach.name}` : data.currentEnrollment?.coach?.name ? `Coach ${data.currentEnrollment.coach.name}` : "Assigned Coach"}
                        </span>
                      </td>
                      <td className="font-bold text-navy">{money(payment.amount)}</td>
                      <td>{dateLabel(payment.createdAt)}</td>
                      <td>
                        <span className={payment.status === "successful" ? "status-good" : payment.status === "pending" ? "status-warn" : "status-muted"}>
                          {payment.status === "successful" ? "Successful" : payment.status}
                        </span>
                      </td>
                      <td className="text-right">
                        <PaymentReceiptModal
                          payment={{
                            ...payment,
                            sport: payment.sport || data.currentEnrollment?.sport,
                            coach: payment.coach || data.currentEnrollment?.coach,
                          }}
                          user={user}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No payments yet."
            description="Once you select a membership plan and coach, your verified payment receipt will show up here."
            action={<Button href="/dashboard/student">Explore memberships</Button>}
          />
        )}
      </section>
    </div>
  );
}
