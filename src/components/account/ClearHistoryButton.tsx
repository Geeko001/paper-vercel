"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ClearHistoryButton() {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  async function clear() {
    if (!confirm("Clear all reading history? This can't be undone.")) return;
    setState("busy");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setState("error");
      return;
    }
    const { error } = await supabase
      .from("reading_history")
      .delete()
      .eq("user_id", user.id);
    setState(error ? "error" : "done");
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={clear}
        disabled={state === "busy"}
        className="rounded-[7px] border border-red-300/60 px-3.5 py-2 text-[13px] text-red-900 transition-colors hover:bg-red-50 disabled:opacity-60"
      >
        {state === "busy" ? "Clearing…" : "Clear reading history"}
      </button>
      {state === "done" && (
        <p role="status" className="text-[13px] text-foreground-muted">
          History cleared ✓
        </p>
      )}
      {state === "error" && (
        <p role="alert" className="text-[13px] text-red-900">
          Couldn&apos;t clear history. Try again.
        </p>
      )}
    </div>
  );
}
