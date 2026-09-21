import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/supabase/server";
import { AccountNav } from "@/components/account/AccountNav";

export const metadata = { title: "Reading History" };

export default async function HistoryPage() {
  const user = await getSessionUser();

  if (!user) redirect("/sign-in");

  return (
    <div className="mx-auto w-full max-w-[1080px] px-4 py-12 sm:px-6">
      <h1 className="font-display text-[32px] tracking-tight">Reading History</h1>
      <div className="mt-4">
        <AccountNav />
      </div>
      <p className="mt-6 text-[14px] text-foreground-muted">
        No history yet. Pieces you open will appear here with progress.
      </p>
    </div>
  );
}
