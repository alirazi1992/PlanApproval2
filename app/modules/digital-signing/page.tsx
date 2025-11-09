import { prisma } from "@/src/lib/prisma";

export default async function DigitalSigningPage() {
  let signatures = [];
  try {
    signatures = await prisma.digitalSignature.findMany({ include: { document: true, signer: true } });
  } catch (error) {
    console.error("Unable to load signatures", error);
  }

  return (
    <section>
      <h1 className="page-title">Digital Signing & Sealing</h1>
      <div className="section-card">
        <p className="text-slate-300 mb-4">
          DS-01 and DS-02 flows maintain pre/post hashes and QR-bound CRH metadata. Offline queues resume automatically when
          connectivity is restored.
        </p>
        <div className="space-y-3">
          {signatures.map((signature) => (
            <div key={signature.id} className="border border-slate-800 rounded-lg p-4 bg-slate-900/60">
              <p className="text-slate-100 font-semibold">{signature.document.fileName}</p>
              <p className="text-xs text-slate-500">
                Signer: {signature.signer.name} · Status {signature.status} · PreHash {signature.preSignHash.slice(0, 12)}…
              </p>
              {signature.postSealHash && <p className="text-xs text-emerald-400">Post-Seal Hash {signature.postSealHash.slice(0, 12)}…</p>}
            </div>
          ))}
          {signatures.length === 0 && <p className="text-sm text-slate-500">No digital signatures yet.</p>}
        </div>
      </div>
    </section>
  );
}
