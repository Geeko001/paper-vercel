export type ResearchArea = "ai" | "computer-science" | "finance" | "quant";

export interface Paper {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  abstract: string;
  content?: string;
  /** Public URL of the original PDF (e.g. "/papers/my-paper.pdf"). "" when no file yet. */
  pdfPath: string;
  /** Human-readable file size for display (e.g. "2.1 MB"). Optional. */
  pdfSizeLabel?: string;
  /** Public code/evidence repo URL shown on the paper page. Optional. */
  codeUrl?: string;
  coverImagePath?: string;
  area: ResearchArea;
  tags: string[];
  keywords: string[];
  publishedAt: string;
  updatedAt?: string;
  readTimeMinutes?: number;
  featured: boolean;
  status: "draft" | "published";
  citationText?: string;
  doi?: string;
  createdAt: string;
}

export const RESEARCH_AREAS: {
  id: ResearchArea | "all";
  label: string;
  short: string;
  description: string;
}[] = [
  {
    id: "ai",
    label: "Artificial Intelligence",
    short: "AI",
    description: "LLMs, machine learning, deep learning and beyond.",
  },
  {
    id: "computer-science",
    label: "Computer Science",
    short: "Computer Science",
    description: "Systems, algorithms, software and data.",
  },
  {
    id: "finance",
    label: "Finance",
    short: "Finance",
    description: "Markets, investing, financial modeling.",
  },
  {
    id: "quant",
    label: "Quantitative Research",
    short: "Quant",
    description: "Mathematics, statistics, modeling and data analysis.",
  },
];

export function areaLabel(area: ResearchArea): string {
  const found = RESEARCH_AREAS.find((a) => a.id === area);
  return found ? found.short : area;
}
