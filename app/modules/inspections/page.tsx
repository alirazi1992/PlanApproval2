import { loadDashboardSnapshot } from "@/src/lib/data";

export default async function InspectionsPage() {
  const snapshot = await loadDashboardSnapshot();
  return (
    <section>
      <h1 className="page-title">Inspections</h1>
      <div className="section-card">
        <p className="text-slate-300 mb-4">
          Manage inspection records; IN-25 token holders can log results and trigger CAPA/NCS automatically when non-compliant.
        </p>
        <div className="space-y-3">
          {snapshot.inspections.map((inspection) => (
            <div key={inspection.id} className="border border-slate-800 rounded-lg p-4 bg-slate-900/60">
              <h3 className="text-slate-100 font-semibold">{inspection.project.utn}</h3>
              <p className="text-xs text-slate-500">
                {inspection.type} · {inspection.result} · {new Date(inspection.inspectionDate).toLocaleDateString()}
              </p>
              {inspection.capa && (
                <p className="text-xs text-amber-400 mt-1">CAPA status: {inspection.capa.status}</p>
              )}
            </div>
          ))}
          {snapshot.inspections.length === 0 && <p className="text-sm text-slate-500">No inspections recorded.</p>}
        </div>
      </div>
    </section>
  );
}
