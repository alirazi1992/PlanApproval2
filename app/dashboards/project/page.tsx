import { loadDashboardSnapshot } from "@/src/lib/data";

export default async function ProjectDashboardPage() {
  const snapshot = await loadDashboardSnapshot();
  return (
    <section>
      <h1 className="page-title">Project Dashboard</h1>
      <div className="section-card">
        <p className="text-slate-300 mb-4">Timeline of project activity with revision and dependency awareness.</p>
        <div className="space-y-4">
          {snapshot.projects.map((project) => (
            <article key={project.id} className="border border-slate-800 rounded-lg p-4">
              <header className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-100">{project.utn}</h3>
                  <p className="text-xs text-slate-500">{project.projectType} · {project.status}</p>
                </div>
                <span className="text-xs bg-slate-800 px-3 py-1 rounded-full">Documents {project.documents.length}</span>
              </header>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                {project.documents.map((doc) => (
                  <div key={doc.id} className="bg-slate-900/60 border border-slate-800 rounded p-3">
                    <p className="font-medium text-slate-100">{doc.fileName}</p>
                    <p className="text-xs text-slate-500">Revision {doc.revision} · {doc.workflowState}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
          {snapshot.projects.length === 0 && <p className="text-sm text-slate-500">No projects seeded yet.</p>}
        </div>
      </div>
    </section>
  );
}
