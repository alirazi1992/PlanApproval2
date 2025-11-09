import { loadCapaCases } from "@/src/lib/data";

export default async function CapaPage() {
  const cases = await loadCapaCases();
  return (
    <section>
      <h1 className="page-title">CAPA / NCS</h1>
      <div className="section-card">
        <p className="text-slate-300 mb-4">
          Non-compliances automatically open CAPA cases. Progress is tracked and requires approval from roles with the relevant
          AccessID token.
        </p>
        <div className="space-y-3">
          {cases.map((entry) => (
            <div key={entry.id} className="border border-slate-800 rounded-lg p-4 bg-slate-900/60">
              <h3 className="text-slate-100 font-semibold">{entry.project.utn}</h3>
              <p className="text-xs text-slate-500">Due {entry.dueDate ? new Date(entry.dueDate).toLocaleDateString() : "—"}</p>
              <p className="text-xs text-slate-400">Status: {entry.status}</p>
            </div>
          ))}
          {cases.length === 0 && <p className="text-sm text-slate-500">No CAPA cases are active.</p>}
        </div>
      </div>
    </section>
  );
}
