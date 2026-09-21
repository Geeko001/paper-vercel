import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  try {
    return await updateSession(request);
  } catch {
    // Misconfigured or unreachable auth must never take down routes.
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: ["/account/:path*", "/auth/:path*"],
};
