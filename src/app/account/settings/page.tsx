import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/supabase/server";
import { AccountNav } from "@/components/account/AccountNav";
import { ProfileForm } from "@/components/account/ProfileForm";
import { ClearHistoryButton } from "@/components/account/ClearHistoryButton";
import { SignOutButton } from "@/components/account/SignOutButton";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await getSessionUser();

  if (!user) redirect("/sign-in");

  return (
    <div className="mx-auto w-full max-w-[1080px] px-4 py-12 sm:px-6">
      <h1 className="font-display text-[32px] tracking-tight">Settings</h1>
      <div className="mt-4">
        <AccountNav />
      </div>

      <section aria-labelledby="profile-heading" className="mt-8 max-w-[640px]">
        <h2 id="profile-heading" className="text-[16px] font-semibold tracking-tight">
          Profile
        </h2>
        <p className="mt-1 text-[13px] text-foreground-muted">
          How you appear across GEEK.
        </p>
        <div className="mt-4">
          <ProfileForm userId={user.id} />
        </div>
      </section>

      <section aria-labelledby="account-heading" className="mt-10 max-w-[640px] border-t rule pt-8">
        <h2 id="account-heading" className="text-[16px] font-semibold tracking-tight">
          Account
        </h2>
        <dl className="mt-4 space-y-3 text-[14px]">
          <div className="flex items-center justify-between gap-4 rounded-[8px] border rule bg-surface px-4 py-3">
            <dt className="text-foreground-muted">Email</dt>
            <dd className="font-medium">{user.email}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-[8px] border rule bg-surface px-4 py-3">
            <dt className="text-foreground-muted">Reading history</dt>
            <dd>
              <ClearHistoryButton />
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-[8px] border rule bg-surface px-4 py-3">
            <dt className="text-foreground-muted">Session</dt>
            <dd>
              <SignOutButton />
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
