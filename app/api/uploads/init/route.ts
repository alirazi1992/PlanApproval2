import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/src/lib/prisma";
import { withRbac } from "@/src/middleware/with-rbac";
import { AuditAction, DocumentWorkflowState, SecuritySeverity, UploadIntegrityStatus } from "@prisma/client";

const bodySchema = z.object({
  projectId: z.string().uuid(),
  fileName: z.string().min(1),
  fileHash: z.string().length(64),
  totalSize: z.number().int().positive(),
  expectedChunks: z.number().int().positive(),
  uploaderId: z.string().uuid(),
  actingUserId: z.string().uuid().optional(),
  note: z.string().optional()
});

async function handler(req: NextRequest, _context: { accessId?: string }) {
  const json = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { projectId, fileName, fileHash, totalSize, expectedChunks, uploaderId, actingUserId, note } = parsed.data;

  const project = await prisma.project.findUnique({ where: { id: projectId }, include: { documents: true } });
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const revision = project.documents.length === 0 ? 1 : Math.max(...project.documents.map((doc) => doc.revision)) + 1;
  const prevDocument = project.documents.length ? project.documents.find((doc) => doc.revision === revision - 1) : null;

  const versionChainId = prevDocument?.versionChainId
    ? prevDocument.versionChainId
    : (
        await prisma.versionChain.create({
          data: { projectId }
        })
      ).id;

  const document = await prisma.document.create({
    data: {
      projectId,
      fileName,
      fileHash,
      revision,
      workflowState: prevDocument ? DocumentWorkflowState.RevisedPendingReview : DocumentWorkflowState.Draft,
      versionChainId,
      reviewStatus: prevDocument ? prevDocument.reviewStatus : undefined
    }
  });

  if (prevDocument) {
    await prisma.document.update({
      where: { id: prevDocument.id },
      data: {
        workflowState: DocumentWorkflowState.SupersededLocked
      }
    });
  }

  const session = await prisma.uploadSession.create({
    data: {
      documentId: document.id,
      expectedChunks,
      totalSize,
      createdById: uploaderId,
      actingUserId,
      note,
      status: UploadIntegrityStatus.Pending
    }
  });

  await prisma.auditEvent.create({
    data: {
      userId: actingUserId ?? uploaderId,
      entity: "UploadSession",
      action: AuditAction.Upload,
      projectId,
      tokenId: null,
      roleId: null,
      scopeId: null,
      beforeRef: null,
      afterRef: session.id
    }
  });

  if (actingUserId) {
    await prisma.securityLog.create({
      data: {
        userId: actingUserId,
        event: "UploadOnBehalf",
        details: `Uploaded by clerk on behalf of ${uploaderId}`,
        severity: SecuritySeverity.Low
      }
    });
  }

  return NextResponse.json({
    sessionId: session.id,
    documentId: document.id,
    revision
  });
}


export const POST = withRbac(handler, "IN-10-DOC-UPLOAD", "Project", {
  referenceResolver: async (req) => {
    try {
      const body = await req.clone().json();
      return typeof body.projectId === "string" ? body.projectId : null;
    } catch {
      return null;
    }
  }
});
