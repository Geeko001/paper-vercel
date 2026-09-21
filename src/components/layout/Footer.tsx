import Link from "next/link";
import { activeSocials, type SocialKey } from "@/lib/site";

function GithubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-label="GitHub">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.7 5.39-5.26 5.68.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-label="LinkedIn">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

const SOCIAL_ICONS: Record<SocialKey, () => React.JSX.Element> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  x: XIcon,
  email: EmailIcon,
};

export function Footer() {
  const socials = activeSocials();
  return (
    <footer className="border-t rule bg-surface">
      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-display text-lg tracking-tight">GEEK</p>
            <p className="mt-1 text-[13px] text-foreground-muted">
              Aashirwad Sharma — I tinker and write
            </p>
          </div>
          <nav aria-label="Footer" className="flex gap-10 text-[13px]">
            <div className="flex flex-col gap-2.5">
              <Link href="/research" className="text-foreground-muted hover:text-foreground">
                Writing
              </Link>
              <Link href="/about" className="text-foreground-muted hover:text-foreground">
                About
              </Link>
              <Link href="/about#connect" className="text-foreground-muted hover:text-foreground">
                Contact
              </Link>
            </div>
            <div className="flex items-start gap-4 pt-0.5 text-foreground-muted">
              {socials.length > 0 ? (
                socials.map((s) => {
                  const Icon = SOCIAL_ICONS[s.key];
                  return (
                    <a
                      key={s.key}
                      href={s.href}
                      aria-label={s.label}
                      className="hover:text-foreground"
                    >
                      <Icon />
                    </a>
                  );
                })
              ) : (
                <span className="text-[12.5px]">Profiles coming soon</span>
              )}
            </div>
          </nav>
        </div>
        <div className="mt-10 border-t rule pt-5 text-[12px] text-foreground-muted">
          © 2026 GEEK. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
