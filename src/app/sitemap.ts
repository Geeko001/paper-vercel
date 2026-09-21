import type { MetadataRoute } from "next";
import { getAllPapers } from "@/lib/data/papers";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/research`, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
    ...getAllPapers().map((p) => ({
      url: `${base}/research/${p.slug}`,
      lastModified: new Date(p.publishedAt),
    })),
  ];
}
