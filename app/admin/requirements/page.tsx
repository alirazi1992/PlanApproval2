import { loadRequirementLibraries } from "@/src/lib/data";

export default async function RequirementLibraryPage() {
  const libraries = await loadRequirementLibraries();
  return (
    <section>
      <h1 className="page-title">Requirement Library</h1>
      <div className="section-card">
        <p className="text-slate-300 mb-4">Administer requirement sets, prerequisites, dependencies, and change impact notes.</p>
        <div className="space-y-4">
          {libraries.map((library) => (
            <div key={library.id} className="border border-slate-800 rounded-lg p-4 bg-slate-900/60">
              <h2 className="text-slate-100 font-semibold">{library.title}</h2>
              <p className="text-xs text-slate-500">{library.projectType} · Versions {library.versions.length}</p>
              <div className="mt-3 space-y-2">
                {library.versions.map((version) => (
                  <div key={version.id} className="bg-slate-900 border border-slate-800 rounded p-3">
                    <p className="text-sm text-slate-200">Version {version.version}</p>
                    <p className="text-xs text-slate-500">Items {version.items.length}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {libraries.length === 0 && <p className="text-sm text-slate-500">No requirement sets configured.</p>}
        </div>
      </div>
    </section>
  );
}
