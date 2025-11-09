import { loadDashboardSnapshot } from "@/src/lib/data";

export default async function UnitDashboardPage() {
  const snapshot = await loadDashboardSnapshot();
  return (
    <section>
      <h1 className="page-title">Unit Dashboard</h1>
      <div className="section-card">
        <p className="mb-4 text-slate-300">
          Highlights unit workloads, pending reviews, dependency blocks, and expiries.
        </p>
        <div className="space-y-3">
          {snapshot.projects.map((project) => (
            <div key={project.id} className="border border-slate-800 rounded-lg p-4 bg-slate-900/60">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-slate-100">{project.utn}</h3>
                  <p className="text-xs text-slate-500">{project.projectType} · {project.status}</p>
                </div>
                <div className="text-xs text-slate-500 text-right">
                  <p>Docs: {project.documents.length}</p>
                  <p>Requirements: {project.requirementSets.length}</p>
                </div>
              </div>
            </div>
          ))}
          {snapshot.projects.length === 0 && <p className="text-sm text-slate-500">No unit workloads registered.</p>}
        </div>
      </div>
    </section>
  );
}
