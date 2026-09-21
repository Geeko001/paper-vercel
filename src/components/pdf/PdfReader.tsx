"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import {
  ChevronLeft,
  ChevronRight,
  Eraser,
  Highlighter,
  Loader2,
  Maximize,
  Minimize,
  Minus,
  Moon,
  MousePointer2,
  Pen,
  Plus,
  Sun,
  Sunset,
  Trash2,
  Undo2,
} from "lucide-react";
import { PdfPage, type PdfPageLike, type ReaderTool } from "./PdfPage";
import { DownloadButton } from "@/components/research/DownloadButton";
import {
  loadAnnotations,
  saveAnnotations,
  type Stroke,
} from "@/lib/annotations";
import { cn } from "@/lib/utils/cn";

type Theme = "light" | "sepia" | "dark";
type Status = "loading" | "ready" | "error";

const WORKER_SRC = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_SRC;
}

const THEMES: Record<
  Theme,
  { root: string; pageFilter: string; ink: string; label: string }
> = {
  light: { root: "bg-surface-muted", pageFilter: "", ink: "#1E2428", label: "Light" },
  sepia: {
    root: "bg-[#E7DCC3]",
    pageFilter: "sepia(0.35)",
    ink: "#3B2F1E",
    label: "Sepia paper",
  },
  dark: {
    root: "bg-[#0E1012]",
    pageFilter: "invert(1) hue-rotate(180deg)",
    ink: "#F5F4EF",
    label: "Dark",
  },
};

const HIGHLIGHT_COLOR = "rgba(250, 204, 21, 0.45)";

function ToolButton({
  active,
  label,
  onClick,
  children,
}: {
  active?: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-[7px] transition-colors",
        active
          ? "bg-inverse text-inverse-foreground"
          : "text-foreground-muted hover:bg-surface-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function PdfReader({
  url,
  title,
  slug,
  fileName,
}: {
  url: string;
  title: string;
  slug: string;
  fileName: string;
}) {
  const [status, setStatus] = useState<Status>("loading");
  const [reloadKey, setReloadKey] = useState(0);
  const [pages, setPages] = useState<PdfPageLike[]>([]);
  const [zoom, setZoom] = useState(1);
  const [fitScale, setFitScale] = useState(1);
  const [theme, setTheme] = useState<Theme>("light");
  const [tool, setTool] = useState<ReaderTool>("pan");
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [jump, setJump] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const wrappersRef = useRef(new Map<number, HTMLDivElement>());

  const numPages = pages.length;
  const renderScale = fitScale * zoom;
  const activeTheme = THEMES[theme];

  // Load the document (public URL, no auth — GitHub raw serves CORS *).
  // Initial state is already "loading"/empty; resets on retry happen in
  // the retry handler and on paper change via key={slug} remount.
  useEffect(() => {
    let cancelled = false;

    const loadingTask = pdfjsLib.getDocument({ url });
    loadingTask.promise.then(
      async (doc) => {
        try {
          const loaded: PdfPageLike[] = [];
          for (let i = 1; i <= doc.numPages; i++) {
            if (cancelled) break;
            loaded.push(await doc.getPage(i));
          }
          if (cancelled) {
            await doc.destroy();
            return;
          }
          setPages(loaded);
          setStrokes(loadAnnotations(slug));
          setStatus("ready");
        } catch {
          if (!cancelled) setStatus("error");
          try {
            await doc.destroy();
          } catch {
            // Ignore.
          }
        }
      },
      () => {
        if (!cancelled) setStatus("error");
      },
    );

    return () => {
      cancelled = true;
      try {
        void loadingTask.destroy();
      } catch {
        // Ignore.
      }
    };
  }, [url, slug, reloadKey]);

  // Persist annotations locally (this browser only).
  useEffect(() => {
    if (status === "ready") saveAnnotations(slug, strokes);
  }, [strokes, slug, status]);

  // Measure fit-to-width scale; recompute on resize.
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || pages.length === 0) return;
    const measure = () => {
      const available = container.clientWidth - 64;
      const natural = pages[0].getViewport({ scale: 1 }).width;
      if (natural > 0) setFitScale(Math.min(2.5, available / natural));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, [pages]);

  // Fullscreen state.
  useEffect(() => {
    function onChange() {
      setIsFullscreen(document.fullscreenElement != null);
    }
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const strokesByPage = useMemo(() => {
    const map = new Map<number, Stroke[]>();
    strokes.forEach((s) => {
      const list = map.get(s.page) ?? [];
      list.push(s);
      map.set(s.page, list);
    });
    return map;
  }, [strokes]);

  const registerWrapper = useCallback(
    (pageNumber: number, el: HTMLDivElement | null) => {
      if (el) wrappersRef.current.set(pageNumber, el);
      else wrappersRef.current.delete(pageNumber);
    },
    [],
  );

  function scrollToPage(n: number) {
    const clamped = Math.min(numPages, Math.max(1, n));
    const container = scrollRef.current;
    const el = wrappersRef.current.get(clamped);
    if (!container || !el) return;
    container.scrollTo({ top: el.offsetTop - 16, behavior: "smooth" });
    setCurrentPage(clamped);
  }

  function onScroll() {
    const container = scrollRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const max = scrollHeight - clientHeight;
    setProgress(max > 0 ? Math.min(1, scrollTop / max) : 0);
    let current = 1;
    wrappersRef.current.forEach((el, n) => {
      if (el.offsetTop - scrollTop <= 120) current = Math.max(current, n);
    });
    setCurrentPage(current);
  }

  async function toggleFullscreen() {
    const el = rootRef.current;
    if (!el) return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await el.requestFullscreen();
    } catch {
      // Fullscreen unavailable — reader still works inline.
    }
  }

  function commitStroke(stroke: Omit<Stroke, "id" | "page">, page: number) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setStrokes((prev) => [...prev, { ...stroke, id, page }]);
  }

  function eraseStroke(id: string) {
    setStrokes((prev) => prev.filter((s) => s.id !== id));
  }

  function undo() {
    setStrokes((prev) => prev.slice(0, -1));
  }

  function clearPage() {
    if (strokes.every((s) => s.page !== currentPage)) return;
    if (!confirm(`Clear all markings on page ${currentPage}?`)) return;
    setStrokes((prev) => prev.filter((s) => s.page !== currentPage));
  }

  const annotatedPages = useMemo(
    () => new Set(strokes.map((s) => s.page)),
    [strokes],
  );

  return (
    <div
      ref={rootRef}
      className={cn(
        "flex h-[82vh] min-h-[560px] flex-col overflow-hidden rounded-[10px] border rule fullscreen:h-screen fullscreen:rounded-none",
        activeTheme.root,
      )}
    >
      {/* macOS-style toolbar */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-2 border-b rule bg-background/90 px-3 py-2 backdrop-blur">
        <span aria-hidden="true" className="hidden items-center gap-1.5 sm:flex">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        </span>
        <p className="min-w-0 max-w-[220px] truncate text-[13px] font-medium">
          {title}
        </p>

        <div className="flex items-center gap-1" role="group" aria-label="Pages">
          <ToolButton label="Previous page" onClick={() => scrollToPage(currentPage - 1)}>
            <ChevronLeft size={15} />
          </ToolButton>
          <form
            className="flex items-center gap-1 text-[12.5px] text-foreground-muted"
            onSubmit={(e) => {
              e.preventDefault();
              const n = parseInt(jump, 10);
              if (!Number.isNaN(n)) scrollToPage(n);
              setJump("");
            }}
          >
            <input
              value={jump}
              onChange={(e) => setJump(e.target.value)}
              placeholder={String(currentPage)}
              aria-label="Go to page"
              inputMode="numeric"
              className="w-10 rounded-[6px] border rule bg-surface px-1.5 py-1 text-center text-[12.5px] outline-none"
            />
            <span>/ {numPages || "–"}</span>
          </form>
          <ToolButton label="Next page" onClick={() => scrollToPage(currentPage + 1)}>
            <ChevronRight size={15} />
          </ToolButton>
        </div>

        <div className="flex items-center gap-1" role="group" aria-label="Zoom">
          <ToolButton
            label="Zoom out"
            onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))}
          >
            <Minus size={15} />
          </ToolButton>
          <button
            type="button"
            title="Reset zoom to fit width"
            aria-label={`Zoom ${Math.round(zoom * 100)} percent. Activate to reset.`}
            onClick={() => {
              setZoom(1);
              scrollRef.current?.scrollTo({ top: 0 });
            }}
            className="min-w-12 rounded-[6px] px-1.5 py-1 text-center font-mono text-[12px] text-foreground-muted hover:bg-surface-muted hover:text-foreground"
          >
            {Math.round(zoom * 100)}%
          </button>
          <ToolButton
            label="Zoom in"
            onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))}
          >
            <Plus size={15} />
          </ToolButton>
        </div>

        <div
          role="group"
          aria-label="Reading theme"
          className="flex items-center rounded-[8px] border rule bg-background p-0.5"
        >
          {(
            [
              { id: "light", Icon: Sun },
              { id: "sepia", Icon: Sunset },
              { id: "dark", Icon: Moon },
            ] as const
          ).map(({ id, Icon }) => (
            <button
              key={id}
              type="button"
              title={THEMES[id].label}
              aria-label={`${THEMES[id].label} theme`}
              aria-pressed={theme === id}
              onClick={() => setTheme(id)}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-[6px] transition-colors",
                theme === id
                  ? "bg-inverse text-inverse-foreground"
                  : "text-foreground-muted hover:text-foreground",
              )}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1" role="group" aria-label="Annotation tools">
          <ToolButton
            label="Select and scroll"
            active={tool === "pan"}
            onClick={() => setTool("pan")}
          >
            <MousePointer2 size={15} />
          </ToolButton>
          <ToolButton label="Pen" active={tool === "pen"} onClick={() => setTool("pen")}>
            <Pen size={15} />
          </ToolButton>
          <ToolButton
            label="Highlighter"
            active={tool === "highlight"}
            onClick={() => setTool("highlight")}
          >
            <Highlighter size={15} />
          </ToolButton>
          <ToolButton
            label="Eraser"
            active={tool === "eraser"}
            onClick={() => setTool("eraser")}
          >
            <Eraser size={15} />
          </ToolButton>
          <ToolButton label="Undo last mark" onClick={undo}>
            <Undo2 size={15} />
          </ToolButton>
          <ToolButton label={`Clear markings on page ${currentPage}`} onClick={clearPage}>
            <Trash2 size={15} />
          </ToolButton>
        </div>

        <div className="ms-auto flex items-center gap-1">
          <ToolButton
            label={isFullscreen ? "Exit fullscreen" : "Fullscreen reader"}
            active={isFullscreen}
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
          </ToolButton>
          <DownloadButton url={url} filename={fileName} label="PDF" />
        </div>
      </div>

      {/* Pages */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex-1 space-y-6 overflow-y-auto px-3 py-6 sm:px-6"
      >
        {status === "loading" && (
          <div aria-label="Loading paper" className="mx-auto max-w-[720px] space-y-6">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="anim-rise aspect-[3/4] w-full rounded-[4px] bg-background/60"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="shimmer h-full w-full rounded-[4px]" />
              </div>
            ))}
            <p className="flex items-center justify-center gap-2 text-[13px] text-foreground-muted">
              <Loader2 size={14} className="animate-spin" /> Opening paper…
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="anim-fade mx-auto max-w-[480px] rounded-[10px] border rule bg-surface p-8 text-center">
            <p className="text-[15px] font-medium">Couldn&apos;t load the reader</p>
            <p className="mx-auto mt-1 max-w-[360px] text-[13px] text-foreground-muted">
              The PDF didn&apos;t open here. You can still read it in your
              browser or download it directly.
            </p>
            <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-[7px] bg-inverse px-4 py-2 text-[13.5px] font-medium text-inverse-foreground"
              >
                Read
              </a>
              <DownloadButton url={url} filename={fileName} variant="secondary" />
              <button
                type="button"
                onClick={() => {
                  setStatus("loading");
                  setPages([]);
                  setCurrentPage(1);
                  setReloadKey((k) => k + 1);
                }}
                className="rounded-[7px] border rule px-4 py-2 text-[13.5px] hover:border-border-strong"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {status === "ready" &&
          pages.map((page, i) => (
            <PdfPage
              key={i + 1}
              page={page}
              pageNumber={i + 1}
              scale={renderScale}
              pageFilter={activeTheme.pageFilter}
              tool={tool}
              ink={activeTheme.ink}
              highlightColor={HIGHLIGHT_COLOR}
              strokes={strokesByPage.get(i + 1) ?? []}
              onCommitStroke={(s) => commitStroke(s, i + 1)}
              onEraseStroke={eraseStroke}
              registerWrapper={registerWrapper}
            />
          ))}

        {status === "ready" && annotatedPages.size > 0 && (
          <p className="pb-2 text-center text-[12px] text-foreground-muted">
            {strokes.length} {strokes.length === 1 ? "mark" : "marks"} on{" "}
            {annotatedPages.size} {annotatedPages.size === 1 ? "page" : "pages"} ·
            saved in this browser only
          </p>
        )}
      </div>

      {/* Progress */}
      <div
        className="h-0.5 shrink-0 bg-border"
        role="progressbar"
        aria-label="Reading progress"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-foreground transition-[width] duration-150"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
