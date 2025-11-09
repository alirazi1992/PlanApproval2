import { prisma } from "@/src/lib/prisma";
import { AccessGrant, AccessScope, AccessToken, RoleAssignment } from "@prisma/client";

export type AccessCheckInput = {
  userId: string;
  tokenCode: string;
  scopeType: string;
  referenceId?: string | null;
};

export type AccessResolution = {
  granted: boolean;
  visibility: number;
  grant?: AccessGrant & { token: AccessToken; scope: AccessScope; roleAssignment: RoleAssignment };
};

export async function resolveAccess({ userId, tokenCode, scopeType, referenceId }: AccessCheckInput): Promise<AccessResolution> {
  const assignment = await prisma.roleAssignment.findFirst({
    where: {
      userId,
      active: true,
      scope: {
        scopeType,
        ...(referenceId ? { referenceId } : {})
      },
      role: {
        grants: {
          some: {
            token: {
              code: tokenCode
            },
            scope: {
              scopeType,
              ...(referenceId ? { referenceId } : {})
            }
          }
        }
      }
    },
    include: {
      role: {
        include: {
          grants: {
            where: {
              token: {
                code: tokenCode
              },
              scope: {
                scopeType,
                ...(referenceId ? { referenceId } : {})
              }
            },
            include: {
              token: true,
              scope: true
            }
          }
        }
      },
      scope: true
    }
  });

  if (!assignment || assignment.role.grants.length === 0) {
    return { granted: false, visibility: 0 };
  }

  const grant = assignment.role.grants[0];
  return {
    granted: true,
    visibility: grant.visibility,
    grant: {
      ...grant,
      roleAssignment: assignment,
      token: grant.token,
      scope: grant.scope
    }
  };
}

export function deriveAccessId(grant: AccessGrant) {
  return `${grant.roleId}:${grant.tokenId}:${grant.scopeId}`;
}
