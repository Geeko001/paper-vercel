"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGuest } from "./GuestProvider";

export function GuestSection() {
  const { guest, ready, startGuest, endGuest } = useGuest();
  const router = useRouter();

  // Note: the button branch renders identically on server and first client
  // paint (no hydration mismatch); only the active-guest panel is gated
  // on `ready` so stored identities never flash/mismatch.
  if (ready && guest) {
    return (
      <div className="anim-fade mt-4 rounded-[10px] border rule bg-background p-4 text-left">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={guest.avatar}
            alt=""
            className="h-9 w-9 rounded-full border rule"
          />
          <div>
            <p className="text-[13.5px] font-semibold">
              Browsing as {guest.name}
            </p>
            <p className="text-[12px] text-foreground-muted">
              Guest mode · nothing leaves this tab
            </p>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <Link
            href="/research"
            className="flex-1 rounded-[7px] bg-inverse px-3 py-2 text-center text-[13px] font-medium text-inverse-foreground"
          >
            Continue reading
          </Link>
          <button
            type="button"
            onClick={endGuest}
            className="rounded-[7px] border rule px-3 py-2 text-[13px] hover:border-border-strong"
          >
            End session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={() => {
          startGuest();
          router.push("/research");
        }}
        className="anim-pop w-full rounded-[8px] bg-inverse px-4 py-3 text-[14.5px] font-semibold text-inverse-foreground transition-opacity hover:opacity-90"
      >
        Log in as Guest
      </button>
      <p className="mt-2 text-[12px] leading-relaxed text-foreground-muted">
        No email, no data, full privacy — a random name + avatar is made in
        this tab only and vanishes when you close it.
      </p>
      <p className="mt-2 text-[13px] text-foreground-muted">
        Just looking around?{" "}
        <Link
          href="/research"
          className="text-foreground underline underline-offset-4"
        >
          Browse without anything
        </Link>
      </p>
    </div>
  );
}
