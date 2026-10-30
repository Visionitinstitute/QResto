import { createClient } from "@supabase/supabase-js";

/**
 * Creates a server-only Supabase client using SUPABASE_SERVICE_ROLE_KEY.
 * STRICT SECURITY REQUIREMENT: Never import this client in client components or expose it to browser.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL. Admin client requires service role credentials."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
