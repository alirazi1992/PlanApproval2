import { loadDashboardSnapshot } from "@/src/lib/data";

export default async function ExecutiveDashboardPage() {
  const snapshot = await loadDashboardSnapshot();
  return (
    <section>
      <h1 className="page-title">Executive Dashboard</h1>
      <div className="section-card">
        <p className="text-slate-300 mb-4">
          Aggregated program overview with KPIs, compliance posture, and certification readiness. Visibility is governed via
          AccessID scoped at organization level.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-4">
            <h3 className="section-heading">Projects</h3>
            <p className="text-3xl font-bold">{snapshot.projects.length}</p>
            <p className="text-xs text-slate-500">Lifecycle coverage across Pending → Final states.</p>
          </div>
          <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-4">
            <h3 className="section-heading">Inspections Logged</h3>
            <p className="text-3xl font-bold">{snapshot.inspections.length}</p>
            <p className="text-xs text-slate-500">IN-25 LogInspectionResult token required.</p>
          </div>
          <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-4">
            <h3 className="section-heading">Certificates Issued</h3>
            <p className="text-3xl font-bold">{snapshot.certificates.length}</p>
            <p className="text-xs text-slate-500">Stage-2 closure audited & digitally sealed.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
