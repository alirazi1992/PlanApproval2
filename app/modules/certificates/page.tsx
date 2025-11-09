import { loadDashboardSnapshot } from "@/src/lib/data";

export default async function CertificatesPage() {
  const snapshot = await loadDashboardSnapshot();
  return (
    <section>
      <h1 className="page-title">Certificates</h1>
      <div className="section-card">
        <p className="text-slate-300 mb-4">Manage Stage-2 issuance, revocations, and digital seal verification.</p>
        <div className="space-y-3">
          {snapshot.certificates.map((certificate) => (
            <div key={certificate.id} className="border border-slate-800 rounded-lg p-4 bg-slate-900/60">
              <h3 className="text-slate-100 font-semibold">{certificate.project.utn}</h3>
              <p className="text-xs text-slate-500">
                {certificate.type} · Issue {new Date(certificate.issueDate).toLocaleDateString()} ·
                {certificate.expiryDate ? ` Expires ${new Date(certificate.expiryDate).toLocaleDateString()}` : " No Expiry"}
              </p>
            </div>
          ))}
          {snapshot.certificates.length === 0 && <p className="text-sm text-slate-500">No certificates issued.</p>}
        </div>
      </div>
    </section>
  );
}
