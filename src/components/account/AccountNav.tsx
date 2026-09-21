"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { href: "/account", label: "Overview" },
  { href: "/account/saved", label: "Saved" },
  { href: "/account/history", label: "History" },
  { href: "/account/settings", label: "Settings" },
];

export function AccountNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Account sections"
      className="flex gap-1 overflow-x-auto border-b rule"
    >
      {TABS.map((t) => {
        const active =
          t.href === "/account" ? pathname === t.href : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "whitespace-nowrap border-b-2 px-3 pb-2.5 pt-1 text-[13.5px] transition-colors",
              active
                ? "border-foreground text-foreground"
                : "border-transparent text-foreground-muted hover:text-foreground",
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
