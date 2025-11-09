import Link from "next/link";

const quickLinks = [
  { href: "/dashboards/executive", label: "Executive Dashboard" },
  { href: "/dashboards/unit", label: "Unit Dashboard" },
  { href: "/dashboards/project", label: "Project Dashboard" },
  { href: "/workspaces/review", label: "Review Workspace" },
  { href: "/modules/inspections", label: "Inspections" },
  { href: "/modules/certificates", label: "Certificates" },
  { href: "/modules/capa", label: "CAPA / NCS" },
  { href: "/modules/closures", label: "Closures" },
  { href: "/admin/rbac", label: "RBAC Admin" },
  { href: "/admin/audit", label: "Audit & Security" },
  { href: "/admin/reports", label: "Reports Centre" }
];

export default function Home() {
  return (
    <section>
      <h1 className="page-title">PlanApproval 2 Control Centre</h1>
      <div className="section-card">
        <p className="mb-4 text-slate-300">
          Navigate through lifecycle dashboards, review workspaces, inspections, certificates, and administrative tooling
          for PlanApproval 2. Each module reflects the workflow-driven architecture seeded with demonstrator data.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-lg border border-slate-800 bg-slate-900/70 p-4 hover:border-sky-500 hover:bg-slate-900"
            >
              <span className="font-semibold text-slate-100">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
