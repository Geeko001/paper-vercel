"use client";

import dynamic from "next/dynamic";

// Client-only boundary: pdf.js needs `window` (canvas + worker), so the
// reader chunk loads in the browser only, keeping the paper page itself
// light and server-rendered.
export const PdfReader = dynamic(
  () => import("./PdfReader").then((m) => m.PdfReader),
  {
    ssr: false,
    loading: () => (
      <div
        aria-label="Loading reader"
        className="rounded-[10px] border rule bg-surface p-10"
      >
        <div className="shimmer mx-auto h-64 max-w-[720px] rounded-[4px]" />
      </div>
    ),
  },
);
