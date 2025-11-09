import { PrismaClient, ProjectStatus, ProjectType, DocumentWorkflowState, DocumentReviewStatus, UploadIntegrityStatus, InspectionType, InspectionResult, CertificateType, RequirementItemStatus, ReportFormat, SecuritySeverity, DigitalSignatureStatus, AuditAction } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedAccessControl(organizationId: string, unitId: string, projectId: string, users: Record<string, string>) {
  const tokens = await prisma.$transaction(
    [
      { code: "IN-10-DOC-UPLOAD", name: "Document Upload", description: "Upload documents with integrity enforcement" },
      { code: "IN-25", name: "Log Inspection Result", description: "Record inspection outcomes" },
      { code: "IN-31", name: "Backup and Recovery", description: "Manage backup plans" },
      { code: "IN-66", name: "Dashboard Configure", description: "Configure dashboards" },
      { code: "IN-69", name: "Report Generate", description: "Generate reports" },
      { code: "IN-70", name: "Report Schedule", description: "Manage report schedules" },
      { code: "IN-71-DS", name: "Digital Sign", description: "Digitally sign and seal documents" }
    ].map((token) =>
      prisma.accessToken.upsert({
        where: { code: token.code },
        create: token,
        update: token
      })
    )
  );

  const orgScope = await prisma.accessScope.upsert({
    where: { id: "org-default" },
    create: { id: "org-default", scopeType: "Organization", referenceId: organizationId },
    update: {}
  });

  const unitScope = await prisma.accessScope.upsert({
    where: { id: "unit-default" },
    create: { id: "unit-default", scopeType: "Unit", referenceId: unitId },
    update: {}
  });

  const projectScope = await prisma.accessScope.upsert({
    where: { id: "project-default" },
    create: { id: "project-default", scopeType: "Project", referenceId: projectId },
    update: {}
  });

  const [adminRole, reviewerRole, inspectorRole] = await Promise.all([
    prisma.accessRole.upsert({
      where: { id: "role-admin" },
      create: { id: "role-admin", name: "Organization Admin", organizationId, description: "Full access" },
      update: {}
    }),
    prisma.accessRole.upsert({
      where: { id: "role-reviewer" },
      create: { id: "role-reviewer", name: "Reviewer", organizationId },
      update: {}
    }),
    prisma.accessRole.upsert({
      where: { id: "role-inspector" },
      create: { id: "role-inspector", name: "Inspector", organizationId },
      update: {}
    })
  ]);

  const grantsData = [
    { roleId: adminRole.id, token: "IN-10-DOC-UPLOAD", scopeId: orgScope.id, visibility: 100 },
    { roleId: adminRole.id, token: "IN-66", scopeId: orgScope.id, visibility: 100 },
    { roleId: adminRole.id, token: "IN-69", scopeId: orgScope.id, visibility: 100 },
    { roleId: adminRole.id, token: "IN-70", scopeId: orgScope.id, visibility: 100 },
    { roleId: adminRole.id, token: "IN-71-DS", scopeId: orgScope.id, visibility: 100 },
    { roleId: reviewerRole.id, token: "IN-10-DOC-UPLOAD", scopeId: projectScope.id, visibility: 80 },
    { roleId: reviewerRole.id, token: "IN-71-DS", scopeId: projectScope.id, visibility: 60 },
    { roleId: inspectorRole.id, token: "IN-25", scopeId: unitScope.id, visibility: 75 }
  ];

  await Promise.all(
    grantsData.map((grant) =>
      prisma.accessGrant.upsert({
        where: {
          roleId_tokenId_scopeId: {
            roleId: grant.roleId,
            tokenId: tokens.find((token) => token.code === grant.token)!.id,
            scopeId: grant.scopeId
          }
        },
        create: {
          roleId: grant.roleId,
          tokenId: tokens.find((token) => token.code === grant.token)!.id,
          scopeId: grant.scopeId,
          visibility: grant.visibility
        },
        update: { visibility: grant.visibility }
      })
    )
  );

  await Promise.all([
    prisma.roleAssignment.upsert({
      where: { id: "assign-admin" },
      create: { id: "assign-admin", userId: users.admin, roleId: adminRole.id, scopeId: orgScope.id },
      update: {}
    }),
    prisma.roleAssignment.upsert({
      where: { id: "assign-reviewer" },
      create: { id: "assign-reviewer", userId: users.reviewer, roleId: reviewerRole.id, scopeId: projectScope.id },
      update: {}
    }),
    prisma.roleAssignment.upsert({
      where: { id: "assign-inspector" },
      create: { id: "assign-inspector", userId: users.inspector, roleId: inspectorRole.id, scopeId: unitScope.id },
      update: {}
    })
  ]);
}

async function main() {
  await prisma.auditEvent.deleteMany();
  await prisma.securityLog.deleteMany();
  await prisma.digitalSealPage.deleteMany();
  await prisma.digitalSignature.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.correctiveActionPlan.deleteMany();
  await prisma.inspection.deleteMany();
  await prisma.document.deleteMany();
  await prisma.project.deleteMany();
  await prisma.requirementSetApplication.deleteMany();
  await prisma.requirementItem.deleteMany();
  await prisma.requirementSet.deleteMany();
  await prisma.requirementLibrary.deleteMany();
  await prisma.versionChain.deleteMany();
  await prisma.userUnit.deleteMany();
  await prisma.roleAssignment.deleteMany();
  await prisma.accessGrant.deleteMany();
  await prisma.accessRole.deleteMany();
  await prisma.accessScope.deleteMany();
  await prisma.accessToken.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();

  const organization = await prisma.organization.create({
    data: { name: "Atlas Classification" }
  });

  const unit = await prisma.unit.create({
    data: { name: "Hull Engineering", organizationId: organization.id }
  });

  const users = {
    admin: (
      await prisma.user.create({
        data: {
          email: "admin@atlas.test",
          name: "System Admin",
          hashedPassword: await bcrypt.hash("password", 10)
        }
      })
    ).id,
    reviewer: (
      await prisma.user.create({
        data: {
          email: "reviewer@atlas.test",
          name: "Lead Reviewer",
          hashedPassword: await bcrypt.hash("password", 10)
        }
      })
    ).id,
    inspector: (
      await prisma.user.create({
        data: {
          email: "inspector@atlas.test",
          name: "Field Inspector",
          hashedPassword: await bcrypt.hash("password", 10)
        }
      })
    ).id,
    signer: (
      await prisma.user.create({
        data: {
          email: "signer@atlas.test",
          name: "Certification Officer",
          hashedPassword: await bcrypt.hash("password", 10)
        }
      })
    ).id
  } as Record<string, string>;

  await prisma.userUnit.create({ data: { userId: users.reviewer, unitId: unit.id, role: "Reviewer" } });

  const project = await prisma.project.create({
    data: {
      utn: "ATLAS-GA-001",
      applicantId: users.admin,
      projectType: ProjectType.Hull,
      status: ProjectStatus.UnderReview,
      unitId: unit.id
    }
  });

  const library = await prisma.requirementLibrary.create({
    data: {
      projectType: ProjectType.Hull,
      title: "Hull Structural Baseline",
      versions: {
        create: {
          version: 1,
          changeNote: "Initial baseline",
          items: {
            create: [
              {
                title: "General Arrangement",
                required: true,
                status: RequirementItemStatus.ReadyForUpload,
                acceptanceCriteria: "Uploaded GA drawing",
                description: "Submit latest GA"
              },
              {
                title: "Structural Arrangement",
                required: true,
                status: RequirementItemStatus.PendingDependency,
                acceptanceCriteria: "Depends on GA",
                description: "Provide structural arrangement",
                dependencies: {
                  create: [{ dependsOn: "General Arrangement" }]
                }
              }
            ]
          }
        }
      }
    },
    include: { versions: { include: { items: true } } }
  });

  const requirementSet = library.versions[0];

  await prisma.requirementSetApplication.create({
    data: {
      projectId: project.id,
      requirementSetId: requirementSet.id
    }
  });

  const versionChain = await prisma.versionChain.create({ data: { projectId: project.id } });

  const document = await prisma.document.create({
    data: {
      projectId: project.id,
      fileName: "GA_Drawing.pdf",
      fileHash: "9d3774375f3f5c9ff3f4042afe7f18498399a9f875f4c8ad5ac2ffb5f3d3fb1a",
      revision: 1,
      reviewStatus: DocumentReviewStatus.UnderReview,
      workflowState: DocumentWorkflowState.UnderReview,
      uploadStatus: UploadIntegrityStatus.Completed,
      versionChainId: versionChain.id
    }
  });

  await prisma.activityTimelineEvent.create({
    data: {
      projectId: project.id,
      label: "Document uploaded",
      metadata: document.id
    }
  });

  const inspection = await prisma.inspection.create({
    data: {
      projectId: project.id,
      inspectorId: users.inspector,
      inspectionDate: new Date(),
      type: InspectionType.Initial,
      result: InspectionResult.Conditional,
      remarks: "Minor findings"
    }
  });

  await prisma.correctiveActionPlan.create({
    data: {
      inspectionId: inspection.id,
      projectId: project.id,
      status: "Open",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });

  await prisma.certificate.create({
    data: {
      projectId: project.id,
      type: CertificateType.Design,
      issueDate: new Date(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    }
  });

  await prisma.digitalSignature.create({
    data: {
      documentId: document.id,
      signerId: users.signer,
      preSignHash: document.fileHash,
      status: DigitalSignatureStatus.Signed
    }
  });

  await prisma.reportSchedule.create({
    data: {
      name: "Weekly Project Trail",
      format: ReportFormat.PDF,
      cron: "0 8 * * MON",
      projectId: project.id,
      requiresSign: true,
      createdById: users.admin
    }
  });

  await seedAccessControl(organization.id, unit.id, project.id, users);

  await prisma.securityLog.createMany({
    data: [
      {
        userId: users.admin,
        event: "LockdownMode",
        details: "Test lockdown event",
        severity: SecuritySeverity.High
      },
      {
        userId: users.reviewer,
        event: "UploadOnBehalf",
        details: "Uploaded by clerk on behalf of client",
        severity: SecuritySeverity.Low
      }
    ]
  });

  await prisma.auditEvent.create({
    data: {
      userId: users.admin,
      entity: "Seed",
      action: AuditAction.Created,
      projectId: project.id
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
