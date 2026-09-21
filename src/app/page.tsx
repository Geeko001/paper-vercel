import Link from "next/link";
import { Brain, Code2, TrendingUp, Sigma } from "lucide-react";
import { Button, ViewAll } from "@/components/ui/primitives";
import { PaperCard } from "@/components/research/PaperCard";
import { ResearchField, MountainLines } from "@/components/visual/ResearchField";
import { getFeaturedPapers } from "@/lib/data/papers";
import { RESEARCH_AREAS } from "@/lib/types";
import { Reveal } from "@/components/visual/Reveal";

const AREA_ICONS = {
  ai: Brain,
  "computer-science": Code2,
  finance: TrendingUp,
  quant: Sigma,
} as const;

export default function Home() {
  const featured = getFeaturedPapers().slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* HERO — matches reference: editorial left, wave field right */}
      <section className="border-b rule">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
          <div className="px-4 pb-10 pt-10 sm:px-6 lg:pb-16 lg:pt-16">
            <p className="meta-label anim-rise">Independent Research by Aashirwad Sharma</p>
            <h1
              className="font-display display-hero anim-rise mt-3"
              style={{ animationDelay: "70ms" }}
              aria-label="GEEK"
            >
              GEEK
            </h1>
            <p
              className="anim-rise mt-4 max-w-[420px] font-display text-[26px] leading-[1.2] tracking-tight sm:text-[30px]"
              style={{ animationDelay: "140ms" }}
            >
              Exploring the intersection of AI, Computer Science, Finance and
              Quant.
            </p>
            <p
              className="anim-rise mt-4 max-w-[440px] text-[14px] leading-relaxed text-foreground-muted"
              style={{ animationDelay: "200ms" }}
            >
              A personal research platform where I publish my academic and
              research work for anyone to read, learn and build upon.
            </p>
            <div className="anim-rise mt-6" style={{ animationDelay: "260ms" }}>
              <Button href="/research">Explore Research</Button>
            </div>

            {/* Mobile visual */}
            <div className="mt-8 h-48 overflow-hidden rounded-[12px] border rule lg:hidden">
              <ResearchField />
            </div>
          </div>
          <div className="relative hidden min-h-[480px] overflow-hidden lg:block" aria-hidden="true">
            <div className="hero-drift absolute inset-0">
              <ResearchField />
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent" />
          </div>
        </div>
      </section>

      {/* RESEARCH AREAS */}
      <section className="border-b rule bg-surface">
        <Reveal className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
          <p className="meta-label">Research Areas</p>
          <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-[10px] border rule bg-border sm:grid-cols-2 lg:grid-cols-4">
            {RESEARCH_AREAS.map((area) => {
              const Icon = AREA_ICONS[area.id as keyof typeof AREA_ICONS];
              return (
                <Link
                  key={area.id}
                  href={`/research?area=${area.id}`}
                  className="group bg-surface p-6 transition-colors hover:bg-background"
                >
                  <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                  <h2 className="mt-4 text-[14px] font-semibold tracking-tight">
                    {area.label}
                  </h2>
                  <p className="mt-1 text-[13px] leading-relaxed text-foreground-muted">
                    {area.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </Reveal>
      </section>

      {/* LATEST RESEARCH */}
      <section className="bg-background">
        <Reveal className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-[28px] tracking-tight">
              Latest Research
            </h2>
            {featured.length > 0 && <ViewAll href="/research" />}
          </div>
          {featured.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((paper, i) => (
                <Reveal key={paper.id} delay={i * 80} className="h-full">
                  <PaperCard paper={paper} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[10px] border rule bg-surface p-8 text-center">
              <p className="text-[15px] font-medium">First paper coming soon</p>
              <p className="mx-auto mt-1 max-w-[440px] text-[13.5px] text-foreground-muted">
                Research is being prepared for publication. Check back shortly —
                new papers will appear here and in the archive.
              </p>
            </div>
          )}
        </Reveal>
      </section>

      {/* PHILOSOPHY */}
      <section className="border-t rule bg-surface">
        <Reveal className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6">
          <div className="relative overflow-hidden rounded-[14px] border rule bg-background px-6 py-16 text-center sm:py-20">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <MountainLines />
            </div>
            <div className="relative">
              <p className="mx-auto max-w-[420px] font-display text-[26px] leading-[1.35] tracking-tight sm:text-[30px]">
                Better questions.
                <br />
                Deeper research.
                <br />
                Greater understanding.
              </p>
              <p className="meta-label mt-8">— GEEK</p>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
