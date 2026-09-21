import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export function Logo({
  variant = "default",
}: {
  variant?: "default" | "compact" | "footer" | "mobile";
}) {
  return (
    <Link
      href="/"
      aria-label="GEEK home"
      className={cn(
        "font-display tracking-tight text-foreground select-none",
        variant === "footer" ? "text-xl" : "text-[22px] leading-none",
      )}
      style={{ letterSpacing: "-0.03em" }}
    >
      GEEK
    </Link>
  );
}
