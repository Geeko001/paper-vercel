# GEEK — Personal Research Platform

Independent research publication platform by **Aashirwad Sharma**.
Next.js + React + TypeScript + Tailwind CSS + Supabase (email/password auth live).

## Getting started

```bash
pnpm install
pnpm dev --port 8000
```

Open `http://localhost:8000`. Auth reads `.env.local` (git-ignored, never
committed) — copy `.env.example` for the variable names.

## Adding your first paper

1. Drop the PDF in `public/papers/<slug>.pdf`
   (e.g. `public/papers/my-first-paper.pdf`)
   — or point `pdfPath` at a public remote file, e.g. a GitHub raw URL
   (`https://raw.githubusercontent.com/<owner>/<repo>/main/<file>.pdf`).
   Remote PDFs are fetched directly from the host: no copy in the build,
   no auth, no backend needed.
2. Add an entry in `src/lib/data/papers.ts` (a filled-in template is commented
   at the top of the file):
   - `slug` must match the PDF filename
   - `pdfPath: "/papers/<slug>.pdf"`
   - `status: "published"`, `featured: true` to show it on the homepage
3. Rebuild / reload — the paper appears in Latest Research, the `/research`
   archive, its own `/research/<slug>` page, and the sitemap. The
   **Download PDF** button downloads that exact file.

Send over the paper (PDF + title, abstract, area, tags) and it gets hooked in.

## Scripts

```bash
pnpm dev     # local dev
pnpm build   # production build
pnpm lint    # eslint
```

## Supabase setup (one-time, in your dashboard)

1. Open the project SQL Editor and run `supabase/migrations/0001_schema.sql`
   (tables, RLS, profile trigger, `papers` storage bucket).
2. Auth → Users: create your account via the site's sign-up form, or invite it.
3. Auth → Sign In / Up: email provider is on by default. To skip email
   confirmation during testing: Auth → Sign In / Up → uncheck
   “Confirm email”.
4. Auth → URL Configuration: add the Site URL and redirect URLs
   (`http://localhost:8000/auth/callback`, plus the production URL later).

## Env

`.env.local` holds the live keys (git-ignored). `.env.example` documents the
names. Never commit real keys.

## Deploy: GitHub → Vercel

Yes — this project is Vercel-ready as-is:

1. Push to GitHub (`git add -A`, commit, push). `node_modules`, `.next` and
   `.env*` are already git-ignored, so secrets can&apos;t leak.
2. Vercel → Add New Project → import the repo. Framework preset: Next.js.
   Build command `pnpm build` is auto-detected.
3. Project → Settings → Environment Variables, add for Production (and
   Preview if you want previews to hit Supabase too):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your production domain, e.g.
     `https://geek-research.vercel.app`)
4. Deploy. Then in Supabase → Auth → URL Configuration, add the production
   URL plus `https://<your-domain>/auth/callback` as a redirect URL.

No `vercel.json` needed — defaults are correct.
