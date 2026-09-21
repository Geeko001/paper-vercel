import { getAllPapers } from "@/lib/data/papers";
import { ResearchExplorer } from "@/components/research/ResearchExplorer";

export const metadata = {
  title: "All Writing",
  description: "Browse all pieces and notes by Aashirwad Sharma.",
};

export default function ResearchPage() {
  const papers = getAllPapers();
  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-6">
      <p className="meta-label">Writing</p>
      <h1 className="font-display h1-editorial mt-2">All writing</h1>
      <p className="mt-3 max-w-[560px] text-[14.5px] text-foreground-muted">
        All my pieces and notes in one place — simple write-ups of what
        I&apos;m learning.
      </p>
      <ResearchExplorer papers={papers} />
    </div>
  );
}
