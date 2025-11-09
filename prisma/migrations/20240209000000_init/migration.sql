-- Manual initial migration due to offline tooling limitations.
-- Aligns with prisma/schema.prisma definitions.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE "ProjectType" AS ENUM ('Hull', 'Machinery', 'Electrical', 'General');
CREATE TYPE "ProjectStatus" AS ENUM ('Pending', 'UnderReview', 'Approved', 'Certified');
CREATE TYPE "DocumentReviewStatus" AS ENUM ('UnderReview', 'Approved', 'Rejected');
CREATE TYPE "DocumentWorkflowState" AS ENUM (
  'Draft',
  'UnderReview',
  'Rejected',
  'Commented',
  'Accepted',
  'Verified',
  'Final',
  'Revoked',
  'Withdrawn',
  'RevisedPendingReview',
  'SupersededLocked',
  'ConflictDetected'
);
CREATE TYPE "InspectionType" AS ENUM ('Initial', 'Re', 'Final');
CREATE TYPE "InspectionResult" AS ENUM ('Compliant', 'NonCompliant', 'Conditional');
CREATE TYPE "CertificateType" AS ENUM ('Design', 'Renewal', 'Replacement');
CREATE TYPE "RequirementItemStatus" AS ENUM ('ReadyForUpload', 'PendingDependency', 'NotApplicable');
CREATE TYPE "UploadIntegrityStatus" AS ENUM ('Pending', 'Completed', 'IntegrityError');
CREATE TYPE "WorkflowAction" AS ENUM (
  'Submit', 'Reject', 'Comment', 'Accept', 'Verify', 'Finalize', 'Revoke', 'Withdraw', 'Revise', 'Lock', 'ResolveConflict'
);
CREATE TYPE "ReportFormat" AS ENUM ('PDF', 'Excel', 'CSV');
CREATE TYPE "AuditAction" AS ENUM (
  'Created',
  'Updated',
  'Deleted',
  'WorkflowTransition',
  'PermissionChange',
  'Upload',
  'IntegrityFailure',
  'InspectionResult',
  'CertificateIssued',
  'DigitalSignature',
  'DigitalSeal',
  'Lockdown'
);
CREATE TYPE "SecuritySeverity" AS ENUM ('Low', 'Medium', 'High', 'Critical');
CREATE TYPE "DigitalSignatureStatus" AS ENUM ('Pending', 'Signed', 'Sealed');

CREATE TABLE "Organization" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "Unit" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" TEXT NOT NULL,
  "organizationId" UUID NOT NULL REFERENCES "Organization"("id") ON DELETE RESTRICT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "User" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "email" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "hashedPassword" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "UserUnit" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "unitId" UUID NOT NULL REFERENCES "Unit"("id") ON DELETE CASCADE,
  "role" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "AccessRole" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "organizationId" UUID REFERENCES "Organization"("id") ON DELETE SET NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "AccessToken" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "code" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "AccessScope" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "scopeType" TEXT NOT NULL,
  "referenceId" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "Delegation" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "principalId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "delegateId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "scopeId" UUID NOT NULL REFERENCES "AccessScope"("id") ON DELETE CASCADE,
  "expiresAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "AccessGrant" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "roleId" UUID NOT NULL REFERENCES "AccessRole"("id") ON DELETE CASCADE,
  "tokenId" UUID NOT NULL REFERENCES "AccessToken"("id") ON DELETE CASCADE,
  "scopeId" UUID NOT NULL REFERENCES "AccessScope"("id") ON DELETE CASCADE,
  "visibility" INTEGER NOT NULL DEFAULT 100,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT access_grant_unique UNIQUE ("roleId", "tokenId", "scopeId")
);

CREATE TABLE "RoleAssignment" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "roleId" UUID NOT NULL REFERENCES "AccessRole"("id") ON DELETE CASCADE,
  "scopeId" UUID NOT NULL REFERENCES "AccessScope"("id") ON DELETE CASCADE,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "Project" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "utn" TEXT NOT NULL UNIQUE,
  "applicantId" UUID NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT,
  "projectType" "ProjectType" NOT NULL,
  "status" "ProjectStatus" NOT NULL DEFAULT 'Pending',
  "unitId" UUID NOT NULL REFERENCES "Unit"("id") ON DELETE RESTRICT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "VersionChain" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "projectId" UUID NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE,
  "rootDocumentId" UUID,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "Document" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "projectId" UUID NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE,
  "fileName" TEXT NOT NULL,
  "fileHash" CHAR(64) NOT NULL,
  "revision" INTEGER NOT NULL,
  "reviewStatus" "DocumentReviewStatus" NOT NULL DEFAULT 'UnderReview',
  "reviewedById" UUID REFERENCES "User"("id") ON DELETE SET NULL,
  "reviewDate" TIMESTAMP,
  "comment" TEXT,
  "workflowState" "DocumentWorkflowState" NOT NULL DEFAULT 'Draft',
  "uploadStatus" "UploadIntegrityStatus" NOT NULL DEFAULT 'Pending',
  "versionChainId" UUID REFERENCES "VersionChain"("id") ON DELETE SET NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "UploadSession" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "documentId" UUID NOT NULL REFERENCES "Document"("id") ON DELETE CASCADE,
  "currentChunk" INTEGER NOT NULL DEFAULT 0,
  "expectedChunks" INTEGER NOT NULL,
  "totalSize" INTEGER NOT NULL,
  "status" "UploadIntegrityStatus" NOT NULL DEFAULT 'Pending',
  "createdById" UUID NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT,
  "actingUserId" UUID REFERENCES "User"("id") ON DELETE SET NULL,
  "note" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "completedAt" TIMESTAMP
);

CREATE TABLE "UploadChunkDigest" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "sessionId" UUID NOT NULL REFERENCES "UploadSession"("id") ON DELETE CASCADE,
  "chunkNo" INTEGER NOT NULL,
  "sha256" CHAR(64) NOT NULL,
  "size" INTEGER NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT upload_chunk_digest_unique UNIQUE ("sessionId", "chunkNo")
);

CREATE TABLE "UploadChunk" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "documentId" UUID NOT NULL REFERENCES "Document"("id") ON DELETE CASCADE,
  "chunkNo" INTEGER NOT NULL,
  "size" INTEGER NOT NULL,
  "sha256" CHAR(64) NOT NULL,
  "completedAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT upload_chunk_unique UNIQUE ("documentId", "chunkNo")
);

CREATE TABLE "Inspection" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "projectId" UUID NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE,
  "type" "InspectionType" NOT NULL,
  "inspectorId" UUID NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT,
  "inspectionDate" TIMESTAMP NOT NULL,
  "result" "InspectionResult" NOT NULL,
  "remarks" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "CorrectiveActionPlan" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "inspectionId" UUID NOT NULL UNIQUE REFERENCES "Inspection"("id") ON DELETE CASCADE,
  "projectId" UUID NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE,
  "status" TEXT NOT NULL,
  "dueDate" TIMESTAMP,
  "closedAt" TIMESTAMP,
  "approverId" UUID REFERENCES "User"("id") ON DELETE SET NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "Certificate" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "projectId" UUID NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE,
  "type" "CertificateType" NOT NULL,
  "issueDate" TIMESTAMP NOT NULL,
  "expiryDate" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "RequirementLibrary" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "projectType" "ProjectType" NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "RequirementVersionChain" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "projectType" "ProjectType" NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "RequirementSet" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "version" INTEGER NOT NULL,
  "libraryId" UUID NOT NULL REFERENCES "RequirementLibrary"("id") ON DELETE CASCADE,
  "changeNote" TEXT,
  "versionChainId" UUID REFERENCES "RequirementVersionChain"("id") ON DELETE SET NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "RequirementItem" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "requirementSetId" UUID NOT NULL REFERENCES "RequirementSet"("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "required" BOOLEAN NOT NULL,
  "acceptanceCriteria" TEXT,
  "status" "RequirementItemStatus" NOT NULL DEFAULT 'PendingDependency',
  "changeImpactNote" TEXT
);

CREATE TABLE "RequirementPrerequisite" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "itemId" UUID NOT NULL REFERENCES "RequirementItem"("id") ON DELETE CASCADE,
  "prerequisiteKey" TEXT NOT NULL
);

CREATE TABLE "RequirementDependency" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "itemId" UUID NOT NULL REFERENCES "RequirementItem"("id") ON DELETE CASCADE,
  "dependsOn" TEXT NOT NULL
);

CREATE TABLE "RequirementSetApplication" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "projectId" UUID NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE,
  "requirementSetId" UUID NOT NULL REFERENCES "RequirementSet"("id") ON DELETE CASCADE,
  "appliedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "RequirementTrailEntry" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "requirementId" UUID NOT NULL REFERENCES "RequirementItem"("id") ON DELETE CASCADE,
  "description" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "RequirementItemThread" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "requirementId" UUID NOT NULL REFERENCES "RequirementItem"("id") ON DELETE CASCADE,
  "documentId" UUID REFERENCES "Document"("id") ON DELETE SET NULL,
  "createdById" UUID NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "ThreadMessage" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "threadId" UUID NOT NULL REFERENCES "RequirementItemThread"("id") ON DELETE CASCADE,
  "authorId" UUID NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT,
  "content" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "RequirementChecklistEntry" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "documentId" UUID NOT NULL REFERENCES "Document"("id") ON DELETE CASCADE,
  "requirementId" UUID NOT NULL REFERENCES "RequirementItem"("id") ON DELETE CASCADE,
  "status" TEXT NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT requirement_checklist_unique UNIQUE ("documentId", "requirementId")
);

CREATE TABLE "WorkflowState" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "projectId" UUID NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE,
  "state" "DocumentWorkflowState" NOT NULL,
  "enteredAt" TIMESTAMP NOT NULL DEFAULT now(),
  "actorId" UUID REFERENCES "User"("id") ON DELETE SET NULL,
  "comment" TEXT
);

CREATE TABLE "WorkflowTransitionLog" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "projectId" UUID NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE,
  "documentId" UUID REFERENCES "Document"("id") ON DELETE SET NULL,
  "fromState" "DocumentWorkflowState" NOT NULL,
  "toState" "DocumentWorkflowState" NOT NULL,
  "action" "WorkflowAction" NOT NULL,
  "actedById" UUID REFERENCES "User"("id") ON DELETE SET NULL,
  "actedAt" TIMESTAMP NOT NULL DEFAULT now(),
  "comment" TEXT
);

CREATE TABLE "Waiver" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "projectId" UUID NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE,
  "reason" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "AuditEvent" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID REFERENCES "User"("id") ON DELETE SET NULL,
  "roleId" UUID REFERENCES "AccessRole"("id") ON DELETE SET NULL,
  "tokenId" UUID REFERENCES "AccessToken"("id") ON DELETE SET NULL,
  "scopeId" UUID REFERENCES "AccessScope"("id") ON DELETE SET NULL,
  "projectId" UUID REFERENCES "Project"("id") ON DELETE SET NULL,
  "certificateId" UUID REFERENCES "Certificate"("id") ON DELETE SET NULL,
  "entity" TEXT NOT NULL,
  "action" "AuditAction" NOT NULL,
  "beforeRef" TEXT,
  "afterRef" TEXT,
  "ipAddress" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "SecurityLog" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID REFERENCES "User"("id") ON DELETE SET NULL,
  "event" TEXT NOT NULL,
  "details" TEXT,
  "severity" "SecuritySeverity" NOT NULL DEFAULT 'Medium',
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "OfflineReviewCache" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "reviewerId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "documentId" UUID NOT NULL REFERENCES "Document"("id") ON DELETE CASCADE,
  "cachedAt" TIMESTAMP NOT NULL DEFAULT now(),
  "syncedAt" TIMESTAMP,
  "conflictState" BOOLEAN NOT NULL DEFAULT false,
  "payloadHash" CHAR(64) NOT NULL
);

CREATE TABLE "ConflictResolution" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "documentId" UUID NOT NULL REFERENCES "Document"("id") ON DELETE CASCADE,
  "detectedAt" TIMESTAMP NOT NULL DEFAULT now(),
  "resolvedAt" TIMESTAMP,
  "resolverId" UUID REFERENCES "User"("id") ON DELETE SET NULL,
  "outcome" TEXT
);

CREATE TABLE "DigitalSignature" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "documentId" UUID NOT NULL REFERENCES "Document"("id") ON DELETE CASCADE,
  "signerId" UUID NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT,
  "preSignHash" CHAR(64) NOT NULL,
  "postSealHash" CHAR(64),
  "certificateRef" TEXT,
  "status" "DigitalSignatureStatus" NOT NULL DEFAULT 'Pending',
  "sealedAt" TIMESTAMP,
  "qrCode" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "DigitalSealPage" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "signatureId" UUID NOT NULL REFERENCES "DigitalSignature"("id") ON DELETE CASCADE,
  "pageNumber" INTEGER NOT NULL,
  "pageHash" CHAR(64) NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "ReportSchedule" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "projectId" UUID REFERENCES "Project"("id") ON DELETE SET NULL,
  "name" TEXT NOT NULL,
  "format" "ReportFormat" NOT NULL,
  "cron" TEXT NOT NULL,
  "requiresSign" BOOLEAN NOT NULL DEFAULT false,
  "lastRunAt" TIMESTAMP,
  "createdById" UUID REFERENCES "User"("id") ON DELETE SET NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "ReportExecution" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "scheduleId" UUID REFERENCES "ReportSchedule"("id") ON DELETE SET NULL,
  "reportType" TEXT NOT NULL,
  "format" "ReportFormat" NOT NULL,
  "executedAt" TIMESTAMP NOT NULL DEFAULT now(),
  "executedById" UUID REFERENCES "User"("id") ON DELETE SET NULL,
  "location" TEXT NOT NULL
);

CREATE TABLE "Notification" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "recipientId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "message" TEXT NOT NULL,
  "link" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "readAt" TIMESTAMP
);

CREATE TABLE "KPIConfig" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "code" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "target" DOUBLE PRECISION,
  "unit" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "ActivityTimelineEvent" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "projectId" UUID NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE,
  "label" TEXT NOT NULL,
  "occurredAt" TIMESTAMP NOT NULL DEFAULT now(),
  "metadata" TEXT
);

CREATE TABLE "LockdownEvent" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "reason" TEXT NOT NULL,
  "triggeredById" UUID REFERENCES "SecurityLog"("id") ON DELETE SET NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "releasedAt" TIMESTAMP
);

ALTER TABLE "RequirementSetApplication"
  ADD CONSTRAINT requirement_application_unique UNIQUE ("projectId", "requirementSetId");

-- Views for dashboards can be added later via raw SQL migrations.
