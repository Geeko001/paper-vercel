import Link from "next/link";
import { notFound } from "next/navigation";
import { Bookmark, BookOpen, Calendar, Clock, ExternalLink, FileText } from "lucide-react";
import { DownloadButton } from "@/components/research/DownloadButton";
import { PdfReader } from "@/components/pdf/ReaderLoader";
import type { Metadata } from "next";
import {
  getAllPapers,
  getPaperBySlug,
  getRelatedPapers,
  hasPdf,
} from "@/lib/data/papers";
import { areaLabel } from "@/lib/types";
import { formatDate } from "@/lib/utils/dates";
import { PaperCard } from "@/components/research/PaperCard";

export async function generateStaticParams() {
  return getAllPapers().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const paper = getPaperBySlug(slug);
  if (!paper) return { title: "Piece not found" };
  return {
    title: paper.title,
    description: paper.abstract,
    openGraph: {
      title: `${paper.title} — GEEK`,
      description: paper.abstract,
      type: "article",
    },
  };
}

export default async function PaperPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const paper = getPaperBySlug(slug);
  if (!paper) notFound();

  const related = getRelatedPapers(paper);
  const pdfAvailable = hasPdf(paper);
  const fileName = pdfAvailable
    ? paper.pdfPath.split("/").pop() ?? `${paper.slug}.pdf`
    : null;

  return (
    <article className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6">
      <Link
        href="/research"
        className="text-[13px] text-foreground-muted hover:text-foreground"
      >
        ← Back to writing
      </Link>

      <p className="meta-label mt-6">{areaLabel(paper.area)}</p>
      <div className="mt-2 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="font-display max-w-[640px] text-[clamp(1.9rem,3.5vw,2.9rem)] leading-[1.08] tracking-tight">
            {paper.title}
          </h1>
          {paper.subtitle && (
            <p className="mt-2 max-w-[640px] text-[15px] text-foreground-muted">
              {paper.subtitle}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {pdfAvailable ? (
            <>
              <a
                href={paper.pdfPath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-[7px] bg-inverse px-3.5 py-2 text-[13px] font-medium text-inverse-foreground transition-opacity hover:opacity-90"
              >
                <BookOpen size={14} aria-hidden="true" /> Read
              </a>
              <DownloadButton
                url={paper.pdfPath}
                filename={fileName ?? `${paper.slug}.pdf`}
                variant="secondary"
              />
            </>
          ) : (
            <span
              aria-disabled="true"
              title="PDF not available yet"
              className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-[7px] bg-inverse px-3.5 py-2 text-[13px] font-medium text-inverse-foreground opacity-40"
            >
              <FileText size={14} aria-hidden="true" /> PDF coming soon
            </span>
          )}
          <Link
            href="/sign-in"
            title="Sign in to save pieces"
            className="inline-flex items-center gap-1.5 rounded-[7px] border rule bg-surface px-3.5 py-2 text-[13px] hover:border-border-strong"
          >
            <Bookmark size={14} aria-hidden="true" /> Save
          </Link>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-foreground-muted">
        <span className="inline-flex items-center gap-1.5">
          <Calendar size={13} aria-hidden="true" /> {formatDate(paper.publishedAt)}
        </span>
        {paper.readTimeMinutes != null && (
          <span className="inline-flex items-center gap-1.5">
            <Clock size={13} aria-hidden="true" /> {paper.readTimeMinutes} min read
          </span>
        )}
        <span className="inline-flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-muted text-[10px] font-semibold">
            AS
          </span>
          Aashirwad Sharma · Tinkerer & writer
        </span>
      </div>

      {paper.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {paper.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border rule bg-surface px-2.5 py-1 font-mono text-[11px] text-foreground-muted"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">
        <div>
          <h2 className="text-[16px] font-semibold tracking-tight">In short</h2>
          <p className="mt-3 text-[14.5px] leading-relaxed text-foreground/90">
            {paper.abstract}
          </p>

          {paper.content && (
            <div className="mt-6 space-y-4 text-[14.5px] leading-relaxed text-foreground/90">
              {paper.content.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}

          {(paper.citationText || paper.doi) && (
            <div className="mt-8 rounded-[10px] border rule bg-surface p-5">
              <h3 className="text-[13px] font-semibold">How to cite</h3>
              {paper.citationText && (
                <p className="mt-2 text-[13px] leading-relaxed text-foreground-muted">
                  {paper.citationText}
                </p>
              )}
              {paper.doi && (
                <p className="mt-1 font-mono text-[12px] text-foreground-muted">
                  DOI: {paper.doi}
                </p>
              )}
            </div>
          )}

          {related.length > 0 && (
            <div className="mt-10">
              <h3 className="text-[13px] font-semibold">More to read</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {related.map((r) => (
                  <PaperCard key={r.id} paper={r} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          {pdfAvailable ? (
            <div className="overflow-hidden rounded-[10px] border rule bg-surface">
              <div className="flex items-center gap-3 border-b rule p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-surface-muted">
                  <FileText
                    size={20}
                    aria-hidden="true"
                    className="text-foreground-muted"
                  />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-semibold">
                    {fileName}
                  </p>
                  <p className="mt-0.5 text-[12px] text-foreground-muted">
                    PDF{paper.pdfSizeLabel ? ` · ${paper.pdfSizeLabel}` : ""} ·
                    Hosted on GitHub · Public
                  </p>
                </div>
              </div>
              <div className="space-y-2 p-4">
                <a
                  href={paper.pdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-[7px] bg-inverse px-3.5 py-2.5 text-[13.5px] font-medium text-inverse-foreground transition-opacity hover:opacity-90"
                >
                <BookOpen size={14} aria-hidden="true" /> Read
                </a>
                <DownloadButton
                  url={paper.pdfPath}
                  filename={fileName ?? `${paper.slug}.pdf`}
                  variant="secondary"
                  className="w-full py-2.5"
                />
                {paper.codeUrl && (
                  <a
                    href={paper.codeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-[7px] px-3.5 py-2 text-[13px] text-foreground-muted hover:text-foreground"
                  >
                    <ExternalLink size={13} aria-hidden="true" /> Code &amp;
                    evidence
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-[10px] border rule bg-surface p-6 text-center">
              <FileText
                size={20}
                aria-hidden="true"
                className="mx-auto text-foreground-muted"
              />
              <p className="mt-3 text-[14px] font-medium">
                PDF not available yet
              </p>
              <p className="mt-1 text-[13px] text-foreground-muted">
                The original PDF will appear here for preview and download once
                published.
              </p>
            </div>
          )}
          <p className="mt-3 text-[12px] leading-relaxed text-foreground-muted">
            Read opens the PDF in your browser&apos;s viewer
            (page navigation, zoom, find-in-page included). The original file
            on GitHub is the main copy.
          </p>
        </div>
      </div>

      {pdfAvailable && (
        <section aria-label="In-page reader" className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-display text-[24px] tracking-tight">
              Read on this page
            </h2>
            <p className="meta-label">scroll · zoom · annotate</p>
          </div>
          <div className="mt-4">
            <PdfReader
              key={paper.slug}
              url={paper.pdfPath}
              title={paper.title}
              slug={paper.slug}
              fileName={fileName ?? `${paper.slug}.pdf`}
            />
          </div>
          <p className="mt-3 text-[12px] text-foreground-muted">
            Themes, pen and highlighter live here. Markings save in this
            browser only — nothing is uploaded anywhere.
          </p>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: paper.title,
            description: paper.abstract,
            author: { "@type": "Person", name: "Aashirwad Sharma" },
            datePublished: paper.publishedAt,
          }),
        }}
      />
    </article>
  );
}
