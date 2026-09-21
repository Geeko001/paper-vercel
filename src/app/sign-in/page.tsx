import { GuestSection } from "@/components/account/GuestSection";
import { AuthJoke } from "@/components/account/AuthJoke";

export const metadata = {
  title: "Sign In",
  description: "Sign in to save pieces and keep track of your reading.",
};

export default function SignInPage() {
  return (
    <div className="anim-fade mx-auto flex w-full max-w-[1280px] flex-1 items-center justify-center px-4 py-14 sm:px-6">
      <div className="w-full max-w-[420px] rounded-[14px] border rule bg-surface p-8 text-center shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <p className="font-display text-lg">GEEK</p>
        <h1 className="mt-3 text-[20px] font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-[13.5px] text-foreground-muted">
          Sign in to save pieces and track your reading.
        </p>
        <AuthJoke />
        <p className="mt-1 text-[12px] italic text-foreground-muted">
          sign-in / login budget expired — i ate momos worth that much.
        </p>
        <div className="my-5 flex items-center gap-3 text-[12px] text-foreground-muted">
          <span className="h-px flex-1 bg-[var(--border)]" />
          the real way in
          <span className="h-px flex-1 bg-[var(--border)]" />
        </div>
        <GuestSection />
      </div>
    </div>
  );
}
