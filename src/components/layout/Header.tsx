"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { Logo } from "./Logo";
import { GuestMenu, MobileGuestRow } from "@/components/account/GuestMenu";
import { useGuest } from "@/components/account/GuestProvider";
import { cn } from "@/lib/utils/cn";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/research", label: "Writing" },
  { href: "/about", label: "About" },
];

export interface HeaderUser {
  email: string;
  initial: string;
}

export function Header({ user }: { user: HeaderUser | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { guest, ready } = useGuest();
  // Guest session fully replaces the Sign In entry — the site opens
  // as the guest profile until the tab closes or the session ends.
  const showGuest = !user && ready && guest !== null;

  return (
    <header className="sticky top-0 z-50 border-b rule bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-[13px] transition-colors",
                  active
                    ? "text-foreground underline underline-offset-8 decoration-[1px]"
                    : "text-foreground-muted hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <Link
            href="/research"
            aria-label="Search writing"
            className="flex h-8 w-8 items-center justify-center rounded-md border rule bg-surface text-foreground-muted hover:text-foreground"
          >
            <Search size={15} strokeWidth={1.75} />
          </Link>
          {user ? (
            <Link
              href="/account"
              aria-label={`Account (${user.email})`}
              title={user.email}
              className="hidden h-8 w-8 items-center justify-center rounded-full bg-inverse text-[12px] font-semibold text-inverse-foreground md:inline-flex"
            >
              {user.initial}
            </Link>
          ) : showGuest ? (
            <GuestMenu />
          ) : (
            <Link
              href="/sign-in"
              className="hidden rounded-[7px] bg-inverse px-3.5 py-1.5 text-[13px] font-medium text-inverse-foreground transition-opacity hover:opacity-90 md:inline-flex"
            >
              Sign In
            </Link>
          )}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-md border rule bg-surface md:hidden"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          aria-label="Mobile"
          className="border-t rule bg-surface px-4 py-3 md:hidden"
        >
          <ul className="flex flex-col">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-2.5 text-[15px] hover:bg-surface-muted"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {!user && <MobileGuestRow onNavigate={() => setOpen(false)} />}
            {user ? (
              <li>
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="mt-1 block rounded-[7px] bg-inverse px-3 py-2.5 text-center text-[14px] font-medium text-inverse-foreground"
                >
                  Account ({user.initial})
                </Link>
              </li>
            ) : showGuest ? (
              <li>
                <Link
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className="mt-1 block rounded-[7px] bg-inverse px-3 py-2.5 text-center text-[14px] font-medium text-inverse-foreground"
                >
                  Create account
                </Link>
              </li>
            ) : (
              <li>
                <Link
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className="mt-1 block rounded-[7px] bg-inverse px-3 py-2.5 text-center text-[14px] font-medium text-inverse-foreground"
                >
                  Sign In
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
