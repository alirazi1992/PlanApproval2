import { loadDashboardSnapshot, loadRequirementLibraries } from "@/src/lib/data";

export default async function ReviewWorkspacePage() {
  const [snapshot, libraries] = await Promise.all([loadDashboardSnapshot(), loadRequirementLibraries()]);
  return (
    <section>
      <h1 className="page-title">Review Workspace</h1>
      <div className="section-card">
        <p className="text-slate-300 mb-4">
          Unified document viewer, requirement checklist, discussion threads, and offline conflict resolver state. Reviewers can
          reject, comment, or accept with digital signing preparation.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="border border-slate-800 rounded-lg p-4 bg-slate-900/60">
            <h2 className="section-heading">Active Documents</h2>
            {snapshot.projects.flatMap((project) => project.documents).map((doc) => (
              <div key={doc.id} className="mb-3">
                <p className="font-semibold text-slate-100">{doc.fileName}</p>
                <p className="text-xs text-slate-500">Rev {doc.revision} · {doc.workflowState} · Status {doc.reviewStatus}</p>
              </div>
            ))}
            {snapshot.projects.flatMap((p) => p.documents).length === 0 && (
              <p className="text-sm text-slate-500">No documents awaiting review.</p>
            )}
          </div>
          <div className="border border-slate-800 rounded-lg p-4 bg-slate-900/60">
            <h2 className="section-heading">Requirement Libraries</h2>
            {libraries.map((library) => (
              <div key={library.id} className="mb-3">
                <p className="font-semibold text-slate-100">{library.title} · {library.projectType}</p>
                <p className="text-xs text-slate-500">Versions: {library.versions.length}</p>
              </div>
            ))}
            {libraries.length === 0 && <p className="text-sm text-slate-500">No requirement libraries configured.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
