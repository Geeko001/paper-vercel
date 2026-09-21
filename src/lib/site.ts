// Single source of truth for site-wide public details.
// Fill in real URLs when available — entries with an empty href are hidden,
// never rendered as dead links.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://geek.example.com";

export const SITE = {
  name: "GEEK",
  researcher: "Aashirwad Sharma",
  role: "Independent Researcher",
  description:
    "Exploring the intersection of AI, Computer Science, Finance and Quantitative Research.",
} as const;

export type SocialKey = "github" | "linkedin" | "x" | "email";

export const SOCIAL_LINKS: { key: SocialKey; label: string; href: string }[] = [
  // { key: "github", label: "GitHub", href: "https://github.com/..." },
  // { key: "linkedin", label: "LinkedIn", href: "https://linkedin.com/in/..." },
  // { key: "x", label: "X (Twitter)", href: "https://x.com/..." },
  // { key: "email", label: "Email", href: "mailto:..." },
];

export function activeSocials() {
  return SOCIAL_LINKS.filter((s) => s.href.trim() !== "");
}
