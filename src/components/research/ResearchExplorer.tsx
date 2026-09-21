"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import type { Paper, ResearchArea } from "@/lib/types";
import { RESEARCH_AREAS, areaLabel } from "@/lib/types";
import { formatDate, formatYear } from "@/lib/utils/dates";
import { cn } from "@/lib/utils/cn";

type Sort = "newest" | "oldest" | "az";

export function ResearchExplorer({ papers }: { papers: Paper[] }) {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState<ResearchArea | "all">("all");
  const [year, setYear] = useState<string>("all");
  const [sort, setSort] = useState<Sort>("newest");

  const years = useMemo(
    () =>
      [...new Set(papers.map((p) => formatYear(p.publishedAt)))].sort().reverse(),
    [papers],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = papers.filter((p) => {
      if (area !== "all" && p.area !== area) return false;
      if (year !== "all" && formatYear(p.publishedAt) !== year) return false;
      if (!q) return true;
      const hay =
        `${p.title} ${p.abstract} ${p.area} ${p.tags.join(" ")} ${p.keywords.join(" ")}`.toLowerCase();
      return q.split(/\s+/).every((w) => hay.includes(w));
    });
    return filtered.sort((a, b) => {
      if (sort === "oldest")
        return +new Date(a.publishedAt) - +new Date(b.publishedAt);
      if (sort === "az") return a.title.localeCompare(b.title);
      return +new Date(b.publishedAt) - +new Date(a.publishedAt);
    });
  }, [papers, query, area, year, sort]);

  const hasActiveFilters =
    query.trim() !== "" || area !== "all" || year !== "all";

  function clearFilters() {
    setQuery("");
    setArea("all");
    setYear("all");
  }

  const pill =
    "rounded-full border px-3 py-1.5 text-[12.5px] transition-colors whitespace-nowrap";

  return (
    <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
      <aside aria-label="Writing filters">
        <p className="text-[13px] font-semibold">Topics</p>
        <ul className="mt-3 space-y-1">
          <li>
            <button
              type="button"
              onClick={() => setArea("all")}
              aria-pressed={area === "all"}
              className={cn(
                "inline-flex items-center gap-2 rounded-[6px] px-2 py-1 text-[13.5px]",
                area === "all"
                  ? "bg-surface-muted font-medium text-foreground"
                  : "text-foreground-muted hover:text-foreground",
              )}
            >
              All
            </button>
          </li>
          {RESEARCH_AREAS.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => setArea(a.id)}
                aria-pressed={area === a.id}
                className={cn(
                  "inline-flex items-center gap-2 rounded-[6px] px-2 py-1 text-[13.5px]",
                  area === a.id
                    ? "bg-surface-muted font-medium text-foreground"
                    : "text-foreground-muted hover:text-foreground",
                )}
              >
                {a.label}
              </button>
            </li>
          ))}
        </ul>

        {years.length > 0 && (
          <>
            <p className="mt-8 text-[13px] font-semibold">Year</p>
            <ul className="mt-3 space-y-1">
              {["all", ...years].map((y) => (
                <li key={y}>
                  <button
                    type="button"
                    onClick={() => setYear(y)}
                    aria-pressed={year === y}
                    className={cn(
                      "rounded-[6px] px-2 py-1 text-[13.5px]",
                      year === y
                        ? "bg-surface-muted font-medium text-foreground"
                        : "text-foreground-muted hover:text-foreground",
                    )}
                  >
                    {y === "all" ? "All" : y}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </aside>

      <div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search pieces</span>
            <Search
              size={15}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search writing, topics, or keywords…"
              className="w-full rounded-[8px] border rule bg-surface py-2.5 pl-10 pr-3.5 text-[13.5px] outline-none placeholder:text-foreground-muted/70 focus:border-border-strong"
            />
          </label>
          <label className="text-[13px]">
            <span className="sr-only">Sort pieces</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="w-full rounded-[8px] border rule bg-surface px-3 py-2.5 sm:w-auto"
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="az">Sort: A–Z</option>
            </select>
          </label>
        </div>

        {papers.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2" aria-label="Quick topic filter">
            {(["all", ...RESEARCH_AREAS.map((a) => a.id)] as const).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setArea(id)}
                aria-pressed={area === id}
                className={cn(
                  pill,
                  "rule bg-surface",
                  area === id
                    ? "border-foreground font-medium text-foreground"
                    : "text-foreground-muted hover:text-foreground",
                )}
              >
                {id === "all" ? "All topics" : areaLabel(id)}
              </button>
            ))}
          </div>
        )}

        {papers.length === 0 ? (
          <div className="mt-4 rounded-[10px] border rule bg-surface p-8 text-center">
            <p className="text-[15px] font-medium">Nothing here yet</p>
            <p className="mx-auto mt-1 max-w-[440px] text-[13.5px] text-foreground-muted">
              The first piece is on its way. Once published, it will appear
              here for reading and download.
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="mt-4 rounded-[10px] border rule bg-surface p-8 text-center">
            <p className="text-[15px] font-medium">Nothing found.</p>
            <p className="mx-auto mt-1 max-w-[440px] text-[13.5px] text-foreground-muted">
              Try changing your search or filters.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 rounded-[7px] border rule bg-background px-3.5 py-2 text-[13px] hover:border-border-strong"
              >
                Clear search &amp; filters
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="mt-4 text-[12.5px] text-foreground-muted" role="status">
              {results.length} {results.length === 1 ? "piece" : "pieces"}
            </p>
            <ul className="divide-y divide-[var(--border)]">
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/research/${p.slug}`}
                    className="group flex items-center justify-between gap-6 py-6"
                  >
                    <div>
                      <p className="meta-label" style={{ fontSize: 10 }}>
                        {areaLabel(p.area)}
                      </p>
                      <h2 className="mt-1.5 max-w-[560px] text-[17px] font-semibold leading-snug tracking-tight group-hover:underline underline-offset-4">
                        {p.title}
                      </h2>
                      <p className="mt-1 line-clamp-2 max-w-[560px] text-[13.5px] text-foreground-muted">
                        {p.abstract}
                      </p>
                      <p className="mt-2 text-[12px] text-foreground-muted">
                        {formatDate(p.publishedAt)}
                        {p.readTimeMinutes != null &&
                          ` · ${p.readTimeMinutes} min read`}
                      </p>
                    </div>
                    <ArrowRight
                      size={16}
                      className="shrink-0 text-foreground-muted transition-transform group-hover:translate-x-1 group-hover:text-foreground"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
