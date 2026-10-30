import { SupabaseClient } from "@supabase/supabase-js";
import { Profile, RestaurantMember, UserRole } from "@meraresto/types";

export interface AuthenticatedUser {
  id: string;
  email: string;
  profile: Profile | null;
  memberships: RestaurantMember[];
}

/**
 * Retrieve authenticated user session along with profile and restaurant memberships.
 */
export async function getCurrentUser(
  supabase: SupabaseClient
): Promise<AuthenticatedUser | null> {
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) return null;

  const [{ data: profile }, { data: memberships }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("restaurant_members").select("*").eq("user_id", user.id),
  ]);

  return {
    id: user.id,
    email: user.email || "",
    profile: (profile || null) as Profile | null,
    memberships: (memberships || []) as RestaurantMember[],
  };
}

/**
 * Guard that verifies the user has access to a specific restaurant and matches one of the allowed roles.
 */
export async function checkTenantRole(
  supabase: SupabaseClient,
  restaurantId: string,
  allowedRoles?: UserRole[]
): Promise<{ allowed: boolean; role?: UserRole; isSuperAdmin?: boolean }> {
  const authUser = await getCurrentUser(supabase);
  if (!authUser) return { allowed: false };

  // Super admins bypass tenant restrictions
  if (authUser.profile?.is_super_admin) {
    return { allowed: true, isSuperAdmin: true };
  }

  const member = authUser.memberships.find(
    (m) => m.restaurant_id === restaurantId
  );

  if (!member) {
    return { allowed: false };
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(member.role)) {
      return { allowed: false, role: member.role };
    }
  }

  return { allowed: true, role: member.role };
}
