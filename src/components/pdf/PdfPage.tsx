"use client";

import { useEffect, useRef } from "react";
import type { AnnotTool, Stroke } from "@/lib/annotations";

export type ReaderTool = "pan" | AnnotTool | "eraser";

// Minimal structural types for pdf.js — avoids depending on its type
// package layout; the real objects are passed through untouched.
export interface PdfViewportLike {
  width: number;
  height: number;
}

export interface PdfPageLike {
  getViewport(params: { scale: number }): PdfViewportLike;
  render(params: {
    canvasContext: CanvasRenderingContext2D;
    viewport: PdfViewportLike;
  }): { promise: Promise<void>; cancel(): void };
}

const ERASER_RADIUS_PX = 14;

function distPx(
  a: { x: number; y: number },
  b: { x: number; y: number },
  w: number,
  h: number,
): number {
  const dx = (a.x - b.x) * w;
  const dy = (a.y - b.y) * h;
  return Math.hypot(dx, dy);
}

export function PdfPage({
  page,
  pageNumber,
  scale,
  pageFilter,
  tool,
  ink,
  highlightColor,
  strokes,
  onCommitStroke,
  onEraseStroke,
  registerWrapper,
}: {
  page: PdfPageLike;
  pageNumber: number;
  scale: number;
  pageFilter: string;
  tool: ReaderTool;
  ink: string;
  highlightColor: string;
  strokes: Stroke[];
  onCommitStroke: (stroke: Omit<Stroke, "id" | "page">) => void;
  onEraseStroke: (id: string) => void;
  registerWrapper: (pageNumber: number, el: HTMLDivElement | null) => void;
}) {
  const viewport = page.getViewport({ scale });
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef<{
    tool: AnnotTool;
    color: string;
    width: number;
    points: { x: number; y: number }[];
  } | null>(null);
  const erasingRef = useRef(false);

  const cssW = viewport.width;
  const cssH = viewport.height;

  // Render the PDF page itself.
  useEffect(() => {
    const canvas = pdfCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const task = page.render({ canvasContext: ctx, viewport });
    let cancelled = false;
    task.promise.catch(() => {
      // Cancelled by a re-render (zoom/theme change) — safe to ignore.
    });
    return () => {
      cancelled = true;
      try {
        task.cancel();
      } catch {
        // Already finished — safe to ignore.
      }
    };
    void cancelled;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, scale]);

  // Paint saved strokes + the stroke currently being drawn.
  useEffect(() => {
    const canvas = overlayRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const paint = (s: {
      tool: AnnotTool;
      color: string;
      width: number;
      points: { x: number; y: number }[];
    }) => {
      if (s.points.length === 0) return;
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.width * scale;
      ctx.beginPath();
      if (s.points.length === 1) {
        const p = s.points[0];
        ctx.arc(p.x * cssW, p.y * cssH, (s.width * scale) / 2, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.fill();
        return;
      }
      s.points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x * cssW, p.y * cssH);
        else ctx.lineTo(p.x * cssW, p.y * cssH);
      });
      ctx.stroke();
    };

    strokes.forEach(paint);
    if (drawingRef.current) paint(drawingRef.current);
  }, [strokes, scale, cssW, cssH, ink, highlightColor]);

  function toNormalized(e: React.PointerEvent): { x: number; y: number } {
    const rect = overlayRef.current!.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height)),
    };
  }

  function eraseAt(point: { x: number; y: number }) {
    const hit = strokes.find((s) =>
      s.points.some(
        (p) => distPx(p, point, cssW, cssH) <= ERASER_RADIUS_PX + s.width * scale,
      ),
    );
    if (hit) onEraseStroke(hit.id);
  }

  function onPointerDown(e: React.PointerEvent) {
    if (tool === "pan" || e.button !== 0) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    if (tool === "eraser") {
      erasingRef.current = true;
      eraseAt(toNormalized(e));
      return;
    }
    drawingRef.current = {
      tool,
      color: tool === "pen" ? ink : highlightColor,
      width: tool === "pen" ? 2.5 : 16,
      points: [toNormalized(e)],
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    const point = toNormalized(e);
    if (tool === "eraser") {
      if (erasingRef.current) eraseAt(point);
      return;
    }
    const active = drawingRef.current;
    if (!active) return;
    const last = active.points[active.points.length - 1];
    if (distPx(last, point, cssW, cssH) < 1.5) return;
    active.points.push(point);
    // Repaint overlay with the live stroke.
    const canvas = overlayRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const paint = (s: typeof active) => {
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.width * scale;
      ctx.beginPath();
      s.points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x * cssW, p.y * cssH);
        else ctx.lineTo(p.x * cssW, p.y * cssH);
      });
      ctx.stroke();
    };
    strokes.forEach((s) =>
      paint({
        tool: s.tool,
        color: s.color,
        width: s.width,
        points: s.points,
      }),
    );
    paint(active);
  }

  function endStroke(e: React.PointerEvent) {
    if (tool === "eraser") {
      erasingRef.current = false;
      return;
    }
    const active = drawingRef.current;
    drawingRef.current = null;
    if (active && active.points.length > 0) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Already released — safe to ignore.
      }
      onCommitStroke({
        tool: active.tool,
        color: active.color,
        width: active.width,
        points: active.points,
      });
    }
  }

  const interactive = tool !== "pan";

  return (
    <div
      ref={(el) => registerWrapper(pageNumber, el)}
      data-page={pageNumber}
      className="relative mx-auto w-fit shadow-[0_2px_16px_rgba(0,0,0,0.12)]"
      style={{ width: cssW, height: cssH }}
    >
      <canvas
        ref={pdfCanvasRef}
        style={{ width: cssW, height: cssH, filter: pageFilter || undefined }}
        aria-label={`Page ${pageNumber}`}
        role="img"
      />
      <canvas
        ref={overlayRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endStroke}
        onPointerCancel={endStroke}
        className="absolute inset-0"
        style={{
          width: cssW,
          height: cssH,
          touchAction: interactive ? "none" : "auto",
          pointerEvents: interactive ? "auto" : "none",
          cursor: interactive
            ? tool === "eraser"
              ? "cell"
              : "crosshair"
            : "default",
        }}
      />
    </div>
  );
}
