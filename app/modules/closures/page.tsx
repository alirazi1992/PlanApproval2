import { loadDashboardSnapshot } from "@/src/lib/data";

export default async function ClosuresPage() {
  const snapshot = await loadDashboardSnapshot();
  const closedProjects = snapshot.projects.filter((project) => project.status === "Certified");
  return (
    <section>
      <h1 className="page-title">Closures</h1>
      <div className="section-card">
        <p className="text-slate-300 mb-4">
          Track Technical / Financial / Contractual closure states. Stage transitions are fully audited and require tokens to
          reopen.
        </p>
        <div className="space-y-3">
          {closedProjects.map((project) => (
            <div key={project.id} className="border border-slate-800 rounded-lg p-4 bg-slate-900/60">
              <h3 className="text-slate-100 font-semibold">{project.utn}</h3>
              <p className="text-xs text-slate-500">{project.projectType} · Fully Closed</p>
            </div>
          ))}
          {closedProjects.length === 0 && <p className="text-sm text-slate-500">No projects fully closed yet.</p>}
        </div>
      </div>
    </section>
  );
}
