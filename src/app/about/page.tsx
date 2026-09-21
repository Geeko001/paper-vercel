import Link from "next/link";
import { activeSocials } from "@/lib/site";

export const metadata = {
  title: "About",
  description: "A little about Aashirwad Sharma, research interests and GEEK.",
};

export default function AboutPage() {
  const socials = activeSocials();
  return (
    <div className="mx-auto w-full max-w-[1080px] px-4 py-12 sm:px-6">
      <p className="meta-label">About</p>
      <h1 className="font-display mt-2 max-w-[640px] text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] tracking-tight">
        A little about me, my research and what drives this platform.
      </h1>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[1fr_320px]">
        <div>
          <p className="text-[15px] font-semibold">Aashirwad Sharma</p>
          <p className="text-[13.5px] text-foreground-muted">Independent Researcher</p>
          <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-foreground/90">
            <p>
              I&apos;m a researcher and builder with a deep interest in Artificial
              Intelligence, Computer Science, Finance and Quantitative Research.
            </p>
            <p>
              This platform is where I publish my work, ideas and findings for
              anyone who is curious to learn and explore.
            </p>
          </div>

          <h2 className="mt-10 text-[15px] font-semibold">My Research Interests</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[14px] text-foreground-muted">
            <li>Artificial Intelligence &amp; Machine Learning</li>
            <li>Computer Science &amp; Systems</li>
            <li>Financial Markets &amp; Investing</li>
            <li>Quantitative Analysis &amp; Modeling</li>
          </ul>

          <h2 id="connect" className="mt-10 text-[15px] font-semibold">
            Connect
          </h2>
          {socials.length > 0 ? (
            <ul className="mt-3 flex gap-5 text-[13.5px]">
              {socials.map((s) => (
                <li key={s.key}>
                  <a
                    href={s.href}
                    className="text-foreground-muted underline underline-offset-4 hover:text-foreground"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[13.5px] text-foreground-muted">
              Social profiles coming soon.
            </p>
          )}
        </div>
        <div
          className="flex h-[380px] flex-col items-center justify-center rounded-[12px] border rule bg-surface px-8 text-center"
          aria-label="About Aashirwad Sharma"
        >
          <p className="font-display text-[88px] leading-none tracking-tight">
            AS
          </p>
          <p className="meta-label mt-5">Aashirwad Sharma</p>
          <p className="mt-2 text-[12.5px] text-foreground-muted">
            Independent Researcher — portrait coming soon
          </p>
        </div>
      </div>

      <p className="mt-12 text-[13px] text-foreground-muted">
        <Link href="/" className="underline underline-offset-4">
          ← Back home
        </Link>
      </p>
    </div>
  );
}
