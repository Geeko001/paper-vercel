// Freehand annotation model for the in-page PDF reader.
// Points are normalized (0..1) against the PDF page so strokes stay aligned
// across zoom levels. Stored in localStorage per paper slug — local only,
// nothing ever leaves the browser.

export type AnnotTool = "pen" | "highlight";

export interface StrokePoint {
  x: number;
  y: number;
}

export interface Stroke {
  id: string;
  page: number;
  tool: AnnotTool;
  color: string;
  /** Line width in CSS px at render scale 1 (multiplied by scale when drawn). */
  width: number;
  points: StrokePoint[];
}

export const PEN_WIDTH = 2.5;
export const HIGHLIGHT_WIDTH = 16;

const keyFor = (slug: string) => `geek-annotations:${slug}`;

function isStroke(value: unknown): value is Stroke {
  if (typeof value !== "object" || value === null) return false;
  const s = value as Record<string, unknown>;
  return (
    typeof s.id === "string" &&
    typeof s.page === "number" &&
    (s.tool === "pen" || s.tool === "highlight") &&
    typeof s.color === "string" &&
    typeof s.width === "number" &&
    Array.isArray(s.points) &&
    s.points.every(
      (p) =>
        typeof p === "object" &&
        p !== null &&
        typeof (p as StrokePoint).x === "number" &&
        typeof (p as StrokePoint).y === "number",
    )
  );
}

export function loadAnnotations(slug: string): Stroke[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(keyFor(slug));
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isStroke);
  } catch {
    return [];
  }
}

export function saveAnnotations(slug: string, strokes: Stroke[]): void {
  try {
    window.localStorage.setItem(keyFor(slug), JSON.stringify(strokes));
  } catch {
    // Storage full or unavailable — annotations still work for the session.
  }
}

export function clearAnnotations(slug: string): void {
  try {
    window.localStorage.removeItem(keyFor(slug));
  } catch {
    // Ignore.
  }
}
