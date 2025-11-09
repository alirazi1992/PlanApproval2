import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/src/lib/prisma";
import { getStorageProvider } from "@/src/lib/storage";
import { withRbac } from "@/src/middleware/with-rbac";
import { sha256 } from "@/src/lib/crypto";
import { AuditAction, DocumentReviewStatus, DocumentWorkflowState, SecuritySeverity, UploadIntegrityStatus } from "@prisma/client";

const chunkSchema = z.object({
  sessionId: z.string().uuid(),
  chunkNo: z.number().int().positive(),
  sha256: z.string().length(64),
  size: z.number().int().positive(),
  data: z.string()
});

async function handler(req: NextRequest, _context: { accessId?: string }) {
  const body = await req.json();
  const parsed = chunkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { sessionId, chunkNo, sha256: expectedHash, data, size } = parsed.data;
  const session = await prisma.uploadSession.findUnique({
    where: { id: sessionId },
    include: {
      document: true
    }
  });

  if (!session) {
    return NextResponse.json({ error: "Upload session not found" }, { status: 404 });
  }

  if (session.status === UploadIntegrityStatus.IntegrityError) {
    return NextResponse.json({ error: "Session locked due to integrity failure" }, { status: 409 });
  }

  const buffer = Buffer.from(data, "base64");
  if (buffer.length !== size) {
    return NextResponse.json({ error: "Size mismatch" }, { status: 400 });
  }

  const computed = sha256(buffer);
  if (computed !== expectedHash.toLowerCase()) {
    await prisma.$transaction([
      prisma.uploadSession.update({
        where: { id: sessionId },
        data: { status: UploadIntegrityStatus.IntegrityError }
      }),
      prisma.document.update({
        where: { id: session.documentId },
        data: {
          uploadStatus: UploadIntegrityStatus.IntegrityError,
          reviewStatus: DocumentReviewStatus.Rejected,
          workflowState: DocumentWorkflowState.Rejected,
          comment: "Integrity error detected during upload"
        }
      }),
      prisma.securityLog.create({
        data: {
          userId: session.createdById,
          event: "ChunkHashMismatch",
          details: `Chunk ${chunkNo} expected ${expectedHash} but received ${computed}`,
          severity: SecuritySeverity.High
        }
      })
    ]);

    return NextResponse.json({ error: "Integrity mismatch" }, { status: 409 });
  }

  const storage = await getStorageProvider();
  await storage.putChunk(sessionId, chunkNo, buffer);

  await prisma.$transaction([
    prisma.uploadChunk.upsert({
      where: { documentId_chunkNo: { documentId: session.documentId, chunkNo } },
      update: { size, sha256: computed, completedAt: new Date() },
      create: { documentId: session.documentId, chunkNo, size, sha256: computed, completedAt: new Date() }
    }),
    prisma.uploadChunkDigest.upsert({
      where: { sessionId_chunkNo: { sessionId, chunkNo } },
      update: { sha256: computed, size },
      create: { sessionId, chunkNo, sha256: computed, size }
    }),
    prisma.auditEvent.create({
      data: {
        userId: session.actingUserId ?? session.createdById,
        entity: "UploadChunk",
        action: AuditAction.Upload,
        projectId: session.document.projectId,
        beforeRef: `${sessionId}:${chunkNo}`,
        afterRef: computed
      }
    })
  ]);

  return NextResponse.json({ status: "ok" });
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
