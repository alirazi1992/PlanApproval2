import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/src/lib/prisma";
import { getStorageProvider } from "@/src/lib/storage";
import { withRbac } from "@/src/middleware/with-rbac";
import { sha256 } from "@/src/lib/crypto";
import { AuditAction, DocumentWorkflowState, SecuritySeverity, UploadIntegrityStatus } from "@prisma/client";

const schema = z.object({
  sessionId: z.string().uuid()
});

async function handler(req: NextRequest, _context: { accessId?: string }) {
  const data = await req.json();
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { sessionId } = parsed.data;
  const session = await prisma.uploadSession.findUnique({
    where: { id: sessionId },
    include: {
      document: true
    }
  });

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.status === UploadIntegrityStatus.IntegrityError) {
    return NextResponse.json({ error: "Session marked with integrity error" }, { status: 409 });
  }

  const storage = await getStorageProvider();
  const fileBuffer = await storage.composeFile(sessionId, session.expectedChunks);
  const computed = sha256(fileBuffer);

  if (computed !== session.document.fileHash.toLowerCase()) {
    await prisma.$transaction([
      prisma.uploadSession.update({
        where: { id: sessionId },
        data: { status: UploadIntegrityStatus.IntegrityError }
      }),
      prisma.document.update({
        where: { id: session.documentId },
        data: {
          uploadStatus: UploadIntegrityStatus.IntegrityError,
          workflowState: DocumentWorkflowState.Rejected,
          comment: "Final hash mismatch"
        }
      }),
      prisma.securityLog.create({
        data: {
          userId: session.createdById,
          event: "FileHashMismatch",
          details: `Expected ${session.document.fileHash} but computed ${computed}`,
          severity: SecuritySeverity.Critical
        }
      })
    ]);
    return NextResponse.json({ error: "Hash mismatch" }, { status: 409 });
  }

  await prisma.$transaction([
    prisma.uploadSession.update({
      where: { id: sessionId },
      data: {
        status: UploadIntegrityStatus.Completed,
        completedAt: new Date()
      }
    }),
    prisma.document.update({
      where: { id: session.documentId },
      data: {
        uploadStatus: UploadIntegrityStatus.Completed,
        workflowState: DocumentWorkflowState.UnderReview
      }
    }),
    prisma.auditEvent.create({
      data: {
        userId: session.actingUserId ?? session.createdById,
        entity: "Document",
        action: AuditAction.Upload,
        projectId: session.document.projectId,
        beforeRef: session.documentId,
        afterRef: computed
      }
    })
  ]);

  return NextResponse.json({ status: "completed" });
}


export const POST = withRbac(handler, "IN-10-DOC-UPLOAD", "Project", {
  referenceResolver: async (req) => {
    try {
      const body = await req.clone().json();
      if (!body?.sessionId) return null;
      const session = await prisma.uploadSession.findUnique({
        where: { id: body.sessionId },
        include: { document: true }
      });
      return session?.document.projectId ?? null;
    } catch {
      return null;
    }
  }
});
