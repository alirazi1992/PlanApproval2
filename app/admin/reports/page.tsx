import { prisma } from "@/src/lib/prisma";

export default async function ReportsAdminPage() {
  let schedules = [];
  let executions = [];
  try {
    [schedules, executions] = await Promise.all([
      prisma.reportSchedule.findMany({ include: { project: true } }),
      prisma.reportExecution.findMany({ orderBy: { executedAt: "desc" }, take: 10, include: { executedBy: true, schedule: true } })
    ]);
  } catch (error) {
    console.error("Unable to load report centre", error);
  }

  return (
    <section>
      <h1 className="page-title">Reports Centre</h1>
      <div className="section-card">
        <p className="text-slate-300 mb-4">
          Generate exports (PDF/Excel/CSV), manage schedules, and enforce IN-69/70/71 tokens for execution and digital signatures.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="border border-slate-800 rounded-lg p-4 bg-slate-900/60">
            <h2 className="section-heading">Schedules</h2>
            {schedules.map((schedule) => (
              <div key={schedule.id} className="mb-2">
                <p className="text-slate-100 font-semibold">{schedule.name}</p>
                <p className="text-xs text-slate-500">
                  {schedule.cron} · {schedule.format} · {schedule.requiresSign ? "Digital sign required" : "Standard"}
                </p>
              </div>
            ))}
            {schedules.length === 0 && <p className="text-sm text-slate-500">No schedules configured.</p>}
          </div>
          <div className="border border-slate-800 rounded-lg p-4 bg-slate-900/60">
            <h2 className="section-heading">Execution History</h2>
            {executions.map((execution) => (
              <div key={execution.id} className="mb-2 text-xs text-slate-400">
                <p className="text-slate-200">{execution.reportType} · {execution.format}</p>
                <p>{execution.executedAt.toISOString()} · {execution.executedBy?.name ?? "system"}</p>
              </div>
            ))}
            {executions.length === 0 && <p className="text-sm text-slate-500">No executions yet.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
