# PlanApproval 2

PlanApproval 2 provides a consolidated plan-approval and certification lifecycle built on Next.js, Prisma/PostgreSQL, NextAuth (JWT), and Zod/Swagger contracts. The implementation focuses on RBAC-driven workflows, chunked uploads with integrity enforcement, digital signing/sealing, inspections, CAPA/NCS, and rich dashboards.

## Tech baseline

- **Frontend / API**: Next.js App Router (TypeScript, TailwindCSS)
- **Authentication**: NextAuth (JWT strategy with credentials provider)
- **Database**: PostgreSQL via Prisma ORM
- **Validation & docs**: Zod schemas and `/api/swagger` (Swagger UI at `/api-docs`)
- **File storage**: Abstraction that supports local filesystem (dev) and S3-compatible providers (prod)
- **Testing**: Vitest

## Getting started

```bash
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

> **Note:** The execution environment used to build this repository could not download npm packages (403 from registry). Run `npm install` locally where you have network access before running the app or tests.

### Database

Provision a PostgreSQL database (Docker or managed) and update `DATABASE_URL` in `.env`. Apply migrations and seed demo data:

```bash
npm run db:migrate
npm run db:seed
```

The seed script provisions:

- Base organization, unit, and demo users (admin, reviewer, inspector, signer)
- Roles, scopes, access grants, and Access Tokens for IN-codes (IN-10, IN-25, IN-31, IN-66, IN-69, IN-70, IN-71)
- Requirement library (Hull structural baseline), sample project with documents, inspections, CAPA, certificates, report schedule
- Initial audit and security log entries demonstrating Lockdown mode notifications

### Running

```bash
npm run dev
```

Visit:

- `/` – Control centre overview
- `/dashboards/*` – Executive, Unit, and Project dashboards
- `/workspaces/review` – Review workspace (documents, requirements, offline status)
- `/modules/*` – Inspections, Certificates, CAPA/NCS, Closures, Digital Signing
- `/admin/*` – RBAC admin, audit & security, reports centre, requirement library
- `/api-docs` – Swagger UI for API contracts

### Authentication

Use the seeded credential pairs (password `password`):

- `admin@atlas.test`
- `reviewer@atlas.test`
- `inspector@atlas.test`
- `signer@atlas.test`

Include `x-user-id` header in API requests to exercise RBAC middleware. The header should be a UUID matching a seeded user.

### Workflows & integrity

- **Chunked uploads** – `/api/uploads/init`, `/api/uploads/chunk`, `/api/uploads/complete` enforce per-chunk and final SHA-256 hashes, updating `UploadSession`, `UploadChunk`, `SecurityLog`, and document states (`Rejected – Integrity Error`, `Revised – Pending Review`, `Superseded – Locked`).
- **Versioning** – New revisions reuse `VersionChain`, automatically locking superseded documents and tracking revision history.
- **On behalf uploads** – Provide `actingUserId` to log “Uploaded by Clerk on Behalf of Client” events.
- **RBAC** – `withRbac` middleware resolves AccessID (RoleID + TokenID + ScopeID) enforcing scope-aware tokens with visibility sliders.
- **Digital signing** – `/api/documents/:id/sign` creates DS-01/DS-02 records with pre/post hashes, optional seal metadata, and audit entries. Dashboard surfaces signature readiness.
- **Inspections & CAPA** – Non-compliant inspections open CAPA records and gate closures until resolved.
- **Reporting & scheduling** – Report schedules support cron-like cadence, optional digital sign enforcement, and history listing.
- **Audit & security** – Immutable audit events, security logs (integrity failures, lockdown), and Lockdown mode scaffold.

### Testing

```bash
npm run test
```

Vitest covers cryptographic helpers and can be extended for workflow, RBAC, and integrity guards.

## Directory structure highlights

- `app/` – Next.js App Router pages & API routes
- `auth/` – NextAuth configuration
- `prisma/` – Prisma schema, migrations, and seed script
- `src/lib` – Prisma client, data loaders, storage, RBAC helpers, crypto utilities
- `src/middleware` – RBAC middleware wrapper
- `tests/` – Vitest suites

## Offline review & conflict resolution

`OfflineReviewCache` and `ConflictResolution` tables track reviewer caching, offline sync, and conflict states (`Conflict Detected – Manual Verification Required`). UI messaging is included in the review workspace, with data scaffolding ready for offline flows.

## Lockdown mode

`SecurityLog` and `LockdownEvent` tables capture elevated security incidents. Seeds include a sample Lockdown event that can be surfaced in dashboards/notifications.

## Scripts

- `npm run dev` – Next.js dev server
- `npm run build` – Production build
- `npm run start` – Production server
- `npm run db:migrate` – Apply Prisma migrations
- `npm run db:seed` – Seed demo data
- `npm run test` – Vitest
