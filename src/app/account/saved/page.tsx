import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/supabase/server";
import { AccountNav } from "@/components/account/AccountNav";

export const metadata = { title: "Saved Pieces" };

export default async function SavedPage() {
  const user = await getSessionUser();

  if (!user) redirect("/sign-in");

  return (
    <div className="mx-auto w-full max-w-[1080px] px-4 py-12 sm:px-6">
      <h1 className="font-display text-[32px] tracking-tight">Saved pieces</h1>
      <div className="mt-4">
        <AccountNav />
      </div>
      <p className="mt-6 text-[14px] text-foreground-muted">
        No pieces found. Try changing your search or filters.
      </p>
      <p className="mt-2 text-[12.5px] text-foreground-muted">
        Bookmarking lights up once writing is published — reading stays public.
      </p>
    </div>
  );
}
