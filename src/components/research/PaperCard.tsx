import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Paper } from "@/lib/types";
import { areaLabel } from "@/lib/types";
import { formatDate } from "@/lib/utils/dates";

export function PaperCard({ paper }: { paper: Paper }) {
  return (
    <Link
      href={`/research/${paper.slug}`}
      className="paper-card group flex h-full flex-col rounded-[10px] border rule bg-surface p-5"
    >
      <p className="meta-label" style={{ fontSize: 10 }}>
        {areaLabel(paper.area)}
      </p>
      <h3 className="mt-2.5 text-[15px] font-semibold leading-snug tracking-tight">
        {paper.title}
      </h3>
      <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-foreground-muted">
        {paper.abstract}
      </p>
      <p className="mt-auto flex items-center justify-between pt-5 text-[11.5px] text-foreground-muted">
        <span>
          {formatDate(paper.publishedAt)} · {paper.readTimeMinutes ?? 8} min read
        </span>
        <ArrowRight
          size={14}
          aria-hidden="true"
          className="card-arrow opacity-0 group-hover:opacity-100"
        />
      </p>
    </Link>
  );
}
