import { NextRequest, NextResponse } from "next/server";
import { resolveAccess } from "@/src/lib/rbac";

export function withRbac<T = Record<string, unknown>>(
  handler: (req: NextRequest, context: T & { accessId?: string }) => Promise<NextResponse>,
  tokenCode: string,
  scopeType: string,
  options?: { referenceResolver?: (req: NextRequest, context: T) => string | null | Promise<string | null> }
) {
  return async function wrapped(req: NextRequest, context?: T): Promise<NextResponse> {
    const ctx = (context ?? {}) as T;
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Missing user context" }, { status: 401 });
    }

    const referenceId = options?.referenceResolver ? await options.referenceResolver(req, ctx) : null;
    const result = await resolveAccess({ userId, tokenCode, scopeType, referenceId: referenceId ?? undefined });
    if (!result.granted) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const response = await handler(req, {
      ...((ctx as unknown) as Record<string, unknown>),
      accessId: result.grant ? `${result.grant.roleId}:${result.grant.tokenId}:${result.grant.scopeId}` : undefined
    } as T & { accessId?: string });
    if (result.grant) {
      response.headers.set("x-access-visibility", result.grant.visibility.toString());
      response.headers.set("x-access-id", `${result.grant.roleId}:${result.grant.tokenId}:${result.grant.scopeId}`);
    }
    return response;
  };
}
