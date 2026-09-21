import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/supabase/server";
import { AccountNav } from "@/components/account/AccountNav";
import { SignOutButton } from "@/components/account/SignOutButton";

export const metadata = { title: "Account" };

function greeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function AccountPage() {
  const user = await getSessionUser();

  if (!user) redirect("/sign-in");

  return (
    <div className="mx-auto w-full max-w-[1080px] px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-[32px] tracking-tight">
            {greeting(new Date().getHours())}
          </h1>
          <p className="mt-1 text-[14px] text-foreground-muted">
            {user.email} · Your research activity.
          </p>
        </div>
        <SignOutButton />
      </div>
      <div className="mt-4">
        <AccountNav />
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {["Saved Papers|/account/saved", "Reading History|/account/history", "Profile|/account/settings"].map(
          (s) => {
            const [label, href] = s.split("|");
            return (
              <a
                key={href}
                href={href}
                className="rounded-[10px] border rule bg-surface p-5 text-[14px] font-medium hover:border-border-strong"
              >
                {label}
              </a>
            );
          },
        )}
      </div>
      <p className="mt-6 text-[13px] text-foreground-muted">
        Signed in with Supabase Auth. Saved papers and reading history land
        here once the database migration is run.
      </p>
    </div>
  );
}
