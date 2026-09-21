import type { Paper } from "@/lib/types";

// Real published papers.
// HOW TO ADD ANOTHER PAPER:
//   1. Upload the PDF (here: push it to the public GitHub repo), then set
//      `pdfPath` to the file's public URL — a GitHub raw URL
//      (https://raw.githubusercontent.com/<owner>/<repo>/main/<file>.pdf)
//      or a local file under `public/papers/<slug>.pdf` served as
//      "/papers/<slug>.pdf". No component changes needed.
//   2. Add an entry below with `status: "published"`, and `featured: true`
//      to show it on the homepage.
// Cards, archive, paper page, download/read actions and sitemap all read
// from these helpers.
export const PAPERS: Paper[] = [
  {
    id: "paper-stress-testing-linear-attention",
    slug: "stress-testing-linear-attention",
    title:
      "Stress-Testing Linear Attention: Architectural Breakpoints and Context Failure Modes",
    subtitle:
      "A diagnostic study of fixed-capacity recurrent state: breakpoint diagnostics for a synthetic linear-attention recurrence, motivated by Linear Transformers, RetNet, RWKV, and Mamba / SSMs.",
    abstract:
      "Fixed-size recurrent state trades explicit sequence-growing KV storage for bounded memory: the entire key–value history is compressed into S ∈ ℝ^{k×d_v} (square d×d in our laboratory) instead of an explicitly stored per-token cache. This paper studies that trade-off in the synthetic additive recurrence S_t = S_{t-1} + φ(k_t)v_tᵀ and its gated synthetic controls, using controlled CPU-only NumPy experiments (base seed 42, d = 16 default).\n\nWe report three measurable stress regimes in this synthetic system: (1) associative interference — retrieval accuracy falls with binding density, with a 50%-crossing at m* = 8 across tested dimensions under standard elu+1 features and a dimension-scaled crossing (≈2d) under centered Gaussian-key conditions; (2) temporal attenuation — recall degrades over long horizons, reaching ≈0 from N ≈ 16k undecayed, with gated 50%-crossings near the e-folding scale; (3) numerical precision loss — shrinking updates go numerically ineffective first in fp16, then fp32 (≈11 and ≈24 steps), with bf16 trailing fp16 on this probe. Density, length, and precision thresholds provide breakpoint diagnostics that distinguish these mechanisms, and controlled mitigation probes (oracle latch, hybrid windows, chunk resets, multi-head banks, fp32 accumulation) move different breakpoints differently.\n\nThese findings apply directly to the studied synthetic recurrence and motivate — but do not experimentally establish — claims about production linear-attention architectures such as Mamba, RWKV, or RetNet, which were not measured here.\n\nThe contribution is diagnostic: a controlled analysis of failure regimes in a fixed-size additive recurrent state, a breakpoint-oriented diagnostic framework, and measurements separating associative interference, temporal attenuation/decay, and numerical precision loss — validated only within the synthetic conditions reported here.",
    pdfPath:
      "/papers/Sharma_Stress-Testing_Linear_Attention_Manuscript.pdf",
    pdfSizeLabel: "2.1 MB",
    codeUrl: "https://github.com/Geeko001/stress-lab-proof",
    area: "ai",
    tags: ["Linear Attention", "Long Context", "Failure Modes"],
    keywords: [
      "linear-attention",
      "associative-recall",
      "context-failure",
      "breakpoints",
      "mamba",
      "rwkv",
      "retnet",
    ],
    publishedAt: "2026-09-21T00:00:00Z",
    featured: true,
    status: "published",
    createdAt: "2026-09-21T00:00:00Z",
  },
];

function publishedOnly(papers: Paper[]): Paper[] {
  return papers.filter((p) => p.status === "published");
}

function byNewest(a: Paper, b: Paper): number {
  return +new Date(b.publishedAt) - +new Date(a.publishedAt);
}

export function getAllPapers(): Paper[] {
  return publishedOnly(PAPERS).sort(byNewest);
}

export function getFeaturedPapers(): Paper[] {
  return publishedOnly(PAPERS)
    .filter((p) => p.featured)
    .sort(byNewest);
}

export function getPaperBySlug(slug: string): Paper | undefined {
  return PAPERS.find((p) => p.slug === slug && p.status === "published");
}

export function getRelatedPapers(paper: Paper, limit = 2): Paper[] {
  return publishedOnly(PAPERS)
    .filter((p) => p.slug !== paper.slug && p.area === paper.area)
    .sort(byNewest)
    .slice(0, limit);
}

/** True when the paper has a real downloadable file (not a placeholder). */
export function hasPdf(paper: Paper): boolean {
  return !!paper.pdfPath && paper.pdfPath !== "#";
}
