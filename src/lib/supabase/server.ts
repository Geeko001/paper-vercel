import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server-side client. Reads/writes auth cookies — use in Server Components,
// Server Actions and Route Handlers. Never import the service-role key here.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component (read-only cookies).
            // Refresh is handled by proxy.ts instead.
          }
        },
      },
    },
  );
}

// Privileged server client for admin-only operations (e.g. publishing papers).
// Service-role key only — never expose to the browser.
export async function createServiceClient() {
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

import type { User } from "@supabase/supabase-js";

// Returns the signed-in user, or null when logged out, misconfigured, or
// unreachable. Never throws — pages stay up even without env keys.
export async function getSessionUser(): Promise<User | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) return null;
    return data.user;
  } catch {
    return null;
  }
}
