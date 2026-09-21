"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useGuest } from "./GuestProvider";

export function GuestMenu() {
  const { guest, ready, endGuest } = useGuest();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open ]);

  if (!ready || !guest) return null;

  return (
    <div className="relative hidden md:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`Guest menu — browsing as ${guest.name}`}
        title={`Browsing as ${guest.name} (guest)`}
        className="anim-pop block h-8 w-8 overflow-hidden rounded-full border rule"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={guest.avatar} alt="" className="h-full w-full" />
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-label="Close guest menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default bg-transparent"
          />
          <div
            role="menu"
            aria-label="Guest session"
            className="anim-pop absolute right-0 z-50 mt-2 w-64 rounded-[10px] border rule bg-surface p-4 shadow-lg"
          >
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={guest.avatar}
                alt=""
                className="h-10 w-10 rounded-full border rule"
              />
              <div>
                <p className="text-[13.5px] font-semibold">{guest.name}</p>
                <p className="text-[12px] text-foreground-muted">
                  Guest · this tab only
                </p>
              </div>
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-foreground-muted">
              Nothing is stored or sent anywhere. Closing this tab erases this
              identity completely.
            </p>
            <Link
              href="/sign-in"
              onClick={() => setOpen(false)}
              className="mt-3 block rounded-[7px] bg-inverse px-3 py-2 text-center text-[13px] font-medium text-inverse-foreground"
            >
              Create an account
            </Link>
            <button
              type="button"
              onClick={() => {
                endGuest();
                setOpen(false);
              }}
              className="mt-2 w-full rounded-[7px] border rule px-3 py-2 text-[13px] hover:border-border-strong"
            >
              End guest session
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function MobileGuestRow({ onNavigate }: { onNavigate: () => void }) {
  const { guest, ready, endGuest } = useGuest();
  if (!ready || !guest) return null;

  return (
    <li className="mt-1 flex items-center justify-between gap-3 rounded-[7px] border rule bg-background px-3 py-2.5">
      <span className="inline-flex items-center gap-2 text-[13.5px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={guest.avatar} alt="" className="h-6 w-6 rounded-full border rule" />
        {guest.name}
        <span className="text-[11.5px] text-foreground-muted">(guest)</span>
      </span>
      <button
        type="button"
        onClick={() => {
          endGuest();
          onNavigate();
        }}
        className="text-[12.5px] underline underline-offset-4"
      >
        End
      </button>
    </li>
  );
}
