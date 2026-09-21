import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Button({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-[7px] px-4 py-2 text-[13.5px] font-medium transition-all",
        variant === "primary"
          ? "bg-inverse text-inverse-foreground hover:opacity-90"
          : "border rule bg-surface hover:border-border-strong",
        className,
      )}
    >
      {children}
      <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
    </Link>
  );
}

export function AreaBadge({ children }: { children: React.ReactNode }) {
  return (
    <p className="meta-label" style={{ fontSize: 10 }}>
      {children}
    </p>
  );
}

export function ViewAll({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-[13px] text-foreground-muted hover:text-foreground"
    >
      View all
      <ArrowUpRight size={14} aria-hidden="true" />
    </Link>
  );
}
