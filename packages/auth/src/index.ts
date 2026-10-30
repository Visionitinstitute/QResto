export * from "./cookies";
import type { MemberRole } from "@meraresto/types";

/**
 * Checks if a member has permission based on allowed roles
 */
export function hasPermission(
  currentRole: MemberRole,
  allowedRoles: MemberRole[]
): boolean {
  if (currentRole === "owner") return true; // Owner has all permissions
  return allowedRoles.includes(currentRole);
}
