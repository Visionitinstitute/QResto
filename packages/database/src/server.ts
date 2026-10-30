import { createServerClient } from "@supabase/ssr";

export interface CookieMethods {
  getAll: () => Array<{ name: string; value: string }>;
  setAll: (
    cookiesToSet: Array<{
      name: string;
      value: string;
      options?: Record<string, unknown>;
    }>
  ) => void;
}

/**
 * Creates a server-side Supabase client with flexible cookie handling
 */
export function createServerSupabaseClient(cookies: CookieMethods) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookies.setAll(cookiesToSet);
      },
    },
  });
}

