import Link from "next/link";
import { ReactNode } from "react";

const sections: Array<{ title: string; links: Array<{ href: string; label: string }> }> = [
  {
    title: "Dashboards",
    links: [
      { href: "/dashboards/executive", label: "Executive" },
      { href: "/dashboards/unit", label: "Unit" },
      { href: "/dashboards/project", label: "Project" }
    ]
  },
  {
    title: "Operations",
    links: [
      { href: "/workspaces/review", label: "Review Workspace" },
      { href: "/modules/inspections", label: "Inspections" },
      { href: "/modules/certificates", label: "Certificates" },
      { href: "/modules/capa", label: "CAPA / NCS" },
      { href: "/modules/closures", label: "Closures" },
      { href: "/modules/digital-signing", label: "Digital Signing" }
    ]
  },
  {
    title: "Administration",
    links: [
      { href: "/admin/rbac", label: "RBAC" },
      { href: "/admin/audit", label: "Audit & Security" },
      { href: "/admin/reports", label: "Reports" },
      { href: "/admin/requirements", label: "Requirement Library" }
    ]
  }
];

export function Sidebar(): ReactNode {
  return (
    <aside className="sidebar">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-50">PlanApproval 2</h2>
        <p className="text-sm text-slate-400">Lifecycle governance</p>
      </div>
      {sections.map((section) => (
        <div key={section.title} className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">{section.title}</p>
          <nav className="space-y-2">
            {section.links.map((link) => (
              <Link key={link.href} href={link.href} className="block text-slate-200 hover:text-sky-400">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ))}
    </aside>
  );
}
