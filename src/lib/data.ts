import { prisma } from "@/src/lib/prisma";

export async function loadDashboardSnapshot() {
  try {
    const [projects, inspections, certificates] = await Promise.all([
      prisma.project.findMany({
        include: { documents: true, unit: true, requirementSets: true }
      }),
      prisma.inspection.findMany({ include: { project: true } }),
      prisma.certificate.findMany({ include: { project: true } })
    ]);
    return { projects, inspections, certificates };
  } catch (error) {
    console.error("Failed to load dashboard snapshot", error);
    return { projects: [], inspections: [], certificates: [] };
  }
}

export async function loadRequirementLibraries() {
  try {
    return prisma.requirementLibrary.findMany({ include: { versions: { include: { items: true } } } });
  } catch (error) {
    console.error("Failed to load requirement libraries", error);
    return [];
  }
}

export async function loadAuditEvents(limit = 20) {
  try {
    return prisma.auditEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { user: true, role: true, token: true, scope: true }
    });
  } catch (error) {
    console.error("Failed to load audit events", error);
    return [];
  }
}

export async function loadCapaCases() {
  try {
    return prisma.correctiveActionPlan.findMany({ include: { project: true, inspection: true } });
  } catch (error) {
    console.error("Failed to load CAPA cases", error);
    return [];
  }
}
