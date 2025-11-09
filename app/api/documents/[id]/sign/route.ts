import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { withRbac } from "@/src/middleware/with-rbac";
import { AuditAction, DigitalSignatureStatus, DocumentWorkflowState } from "@prisma/client";
import { sha256 } from "@/src/lib/crypto";
import { z } from "zod";

const bodySchema = z.object({
  signerId: z.string().uuid(),
  certificateRef: z.string().optional(),
  seal: z
    .object({
      pages: z.array(
        z.object({
          pageNumber: z.number().int().positive(),
          contentHash: z.string().length(64)
        })
      )
    })
    .optional()
});

async function handler(req: NextRequest, context: { params: { id: string }; accessId?: string }) {
  const { params } = context;
  const json = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const document = await prisma.document.findUnique({ where: { id: params.id }, include: { project: true } });
  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const preHash = document.fileHash.toLowerCase();
  const signature = await prisma.digitalSignature.create({
    data: {
      documentId: document.id,
      signerId: parsed.data.signerId,
      preSignHash: preHash,
      certificateRef: parsed.data.certificateRef,
      status: parsed.data.seal ? DigitalSignatureStatus.Sealed : DigitalSignatureStatus.Signed,
      postSealHash: parsed.data.seal ? sha256(Buffer.from(preHash + JSON.stringify(parsed.data.seal))) : null,
      sealedAt: parsed.data.seal ? new Date() : null
    }
  });

  if (parsed.data.seal) {
    for (const page of parsed.data.seal.pages) {
      await prisma.digitalSealPage.create({
        data: {
          signatureId: signature.id,
          pageNumber: page.pageNumber,
          pageHash: page.contentHash
        }
      });
    }
  }

  await prisma.document.update({
    where: { id: document.id },
    data: {
      workflowState: DocumentWorkflowState.Final
    }
  });

  await prisma.auditEvent.create({
    data: {
      userId: parsed.data.signerId,
      entity: "DigitalSignature",
      action: parsed.data.seal ? AuditAction.DigitalSeal : AuditAction.DigitalSignature,
      projectId: document.projectId,
      afterRef: signature.id
    }
  });

  return NextResponse.json({ id: signature.id, status: signature.status });
}

export const POST = withRbac(handler, "IN-71-DS", "Project", {
  referenceResolver: async (_req, context) => {
    return context?.params?.id ?? null;
  }
});
