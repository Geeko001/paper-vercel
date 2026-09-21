"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Downloads a (possibly cross-origin) PDF via fetch → blob → object URL,
 * so the file actually saves with the right filename instead of just
 * opening. Works with public GitHub raw URLs (CORS open, no auth).
 * Falls back to a plain direct link if the fetch fails.
 */
export function DownloadButton({
  url,
  filename,
  label = "Download PDF",
  variant = "primary",
  className = "",
}: {
  url: string;
  filename: string;
  label?: string;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "busy" | "error">("idle");

  async function download() {
    if (state === "busy") return;
    setState("busy");
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
      setState("idle");
    } catch {
      setState("error");
    }
  }

  const styles =
    variant === "primary"
      ? "bg-inverse text-inverse-foreground hover:opacity-90"
      : "border rule bg-surface hover:border-border-strong";

  if (state === "error") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded-[7px] px-3.5 py-2 text-[13px] font-medium",
          styles,
          className,
        )}
      >
        <Download size={14} aria-hidden="true" /> Open file directly
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={download}
      disabled={state === "busy"}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-[7px] px-3.5 py-2 text-[13px] font-medium transition-opacity disabled:cursor-wait disabled:opacity-60",
        styles,
        className,
      )}
    >
      <Download size={14} aria-hidden="true" />
      {state === "busy" ? "Preparing…" : label}
    </button>
  );
}
