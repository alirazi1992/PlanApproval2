import { prisma } from "@/src/lib/prisma";

export default async function RbacAdminPage() {
  let roles = [];
  let tokens = [];
  try {
    [roles, tokens] = await Promise.all([
      prisma.accessRole.findMany({
        include: {
          grants: { include: { token: true, scope: true } },
          assignments: { include: { user: true, scope: true } }
        }
      }),
      prisma.accessToken.findMany()
    ]);
  } catch (error) {
    console.error("Unable to load RBAC overview", error);
  }

  return (
    <section>
      <h1 className="page-title">RBAC Administration</h1>
      <div className="section-card">
        <p className="text-slate-300 mb-4">
          Manage roles, scopes, and AccessID (RoleID + TokenID + ScopeID). Visibility sliders are persisted per grant.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-slate-800 rounded-lg p-4 bg-slate-900/60">
            <h2 className="section-heading">Roles</h2>
            {roles.map((role) => (
              <div key={role.id} className="mb-3">
                <p className="font-semibold text-slate-100">{role.name}</p>
                <p className="text-xs text-slate-500">Grants: {role.grants.length} · Assignments: {role.assignments.length}</p>
              </div>
            ))}
            {roles.length === 0 && <p className="text-sm text-slate-500">No roles found.</p>}
          </div>
          <div className="border border-slate-800 rounded-lg p-4 bg-slate-900/60">
            <h2 className="section-heading">Access Tokens</h2>
            {tokens.map((token) => (
              <div key={token.id} className="mb-2">
                <p className="font-semibold text-slate-100">{token.code}</p>
                <p className="text-xs text-slate-500">{token.name}</p>
              </div>
            ))}
            {tokens.length === 0 && <p className="text-sm text-slate-500">No tokens seeded.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
