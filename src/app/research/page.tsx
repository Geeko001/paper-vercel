import { getAllPapers } from "@/lib/data/papers";
import { ResearchExplorer } from "@/components/research/ResearchExplorer";

export const metadata = {
  title: "All Research Papers",
  description: "Browse all published papers and research work by Aashirwad Sharma.",
};

export default function ResearchPage() {
  const papers = getAllPapers();
  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-6">
      <p className="meta-label">Research</p>
      <h1 className="font-display h1-editorial mt-2">All Research Papers</h1>
      <p className="mt-3 max-w-[560px] text-[14.5px] text-foreground-muted">
        Explore my complete collection of research papers, articles and academic
        work.
      </p>
      <ResearchExplorer papers={papers} />
    </div>
  );
}
