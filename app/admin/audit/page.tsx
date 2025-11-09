import { loadAuditEvents } from "@/src/lib/data";
import { prisma } from "@/src/lib/prisma";

export default async function AuditSecurityPage() {
  const [events, security] = await Promise.all([
    loadAuditEvents(),
    prisma.securityLog.findMany({ orderBy: { createdAt: "desc" }, take: 20 })
  ]);

  return (
    <section>
      <h1 className="page-title">Audit & Security</h1>
      <div className="section-card">
        <p className="text-slate-300 mb-4">Immutable audit trail and security log extracts. Export endpoints are exposed via the reporting API.</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="border border-slate-800 rounded-lg p-4 bg-slate-900/60">
            <h2 className="section-heading">Audit Events</h2>
            {events.map((event) => (
              <div key={event.id} className="mb-2 text-xs text-slate-400">
                <p className="text-slate-200">{event.action} · {event.entity}</p>
                <p>{event.createdAt.toISOString()} · User {event.userId ?? "system"}</p>
              </div>
            ))}
            {events.length === 0 && <p className="text-sm text-slate-500">No audit events recorded.</p>}
          </div>
          <div className="border border-slate-800 rounded-lg p-4 bg-slate-900/60">
            <h2 className="section-heading">Security Log</h2>
            {security.map((entry) => (
              <div key={entry.id} className="mb-2 text-xs text-slate-400">
                <p className="text-slate-200">{entry.event}</p>
                <p>{entry.createdAt.toISOString()} · Severity {entry.severity}</p>
              </div>
            ))}
            {security.length === 0 && <p className="text-sm text-slate-500">Security log empty.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
