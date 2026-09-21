# GEEK — Personal Research Platform
## OpenCode Implementation Specification

> Build this as a production-quality, fully functional personal academic/research publication website for **Aashirwad Sharma**, branded as **GEEK**.
>
> The reference visual direction is the selected minimalist/high-fidelity concept: premium editorial typography, warm off-white surfaces, near-black text, fine borders, generous whitespace, subtle technical/academic visual language, responsive desktop/mobile layouts, and restrained motion.

---

## 1. Product Definition

**Brand:** GEEK  
**Researcher:** Aashirwad Sharma  
**Positioning:** Independent research publication platform

### Research areas

- Artificial Intelligence
- Computer Science
- Finance
- Quantitative Research

### Core model

Aashirwad Sharma is the only publisher/author.

Visitors can:

- Browse all published research
- Search and filter papers
- Open a paper
- Read the paper on the web
- View/download the original PDF
- Save/bookmark papers
- Create an account
- Sign in with Google
- Sign in with Apple
- Maintain reading history
- Manage their profile/preferences

The system must be structured so additional features can be added later without rewriting the core architecture.

---

# 2. Primary Design Goal

The website should feel:

**Minimal · Clean · Premium · Editorial · Technical · Academic · Brandable**

Do NOT make it look like:

- A generic SaaS dashboard
- A university administration portal
- A flashy AI startup landing page
- A template-heavy blog
- A neon/futuristic crypto website

The visual personality should communicate serious independent research while still feeling contemporary and personal.

---

# 3. Required Technology

Use a modern TypeScript-first React architecture.

## Preferred stack

- Next.js
- React
- TypeScript
- Tailwind CSS where useful
- CSS variables for design tokens
- Supabase
- Supabase Auth
- Supabase Postgres
- Supabase Storage
- React Server Components where appropriate
- Server Actions / Route Handlers where appropriate
- PDF.js or a production-ready PDF viewer
- Lucide React for icons
- Zod for validation
- ESLint
- Prettier

### Important

Do not create separate implementations for Vue, plain JS, and React.

The production implementation should be:

**Next.js + React + TypeScript**

Keep components framework-agnostic in design and behavior where practical, so the design system can later be ported to Vue if required.

Avoid unnecessary dependencies.

---

# 4. Application Routes

Implement at minimum:

```text
/
├── /research
├── /research/[slug]
├── /about
├── /sign-in
├── /account
├── /account/saved
├── /account/history
└── /account/settings
```

Optional future-ready routes:

```text
/admin
/admin/papers
/admin/papers/new
/admin/papers/[id]/edit
```

The admin/publishing system can initially be protected and minimal because only Aashirwad publishes papers.

---

# 5. Global Navigation

Desktop header:

```text
GEEK                 Home   Research   About          Search   Sign In
```

After authentication:

```text
GEEK                 Home   Research   About          Search   Avatar
```

Header requirements:

- Sticky or intelligently persistent
- Thin bottom border
- Warm/off-white background
- Minimal height
- Logo is text-based initially
- `GEEK` should have strong typographic presence
- Search opens a polished search UI
- Avatar opens account menu
- Mobile uses logo + search + hamburger/menu

Do not overcrowd navigation.

---

# 6. Design System

## Color philosophy

Use a restrained palette.

Suggested tokens:

```css
--background: #F7F6F2;
--surface: #FBFAF7;
--surface-muted: #F0EEE8;
--foreground: #111315;
--foreground-muted: #62645F;
--border: #D9D7D0;
--border-strong: #BEBBB2;
--inverse: #111315;
--inverse-foreground: #F7F6F2;
--accent: #1E2428;
```

These are starting values, not rigid requirements.

The site should remain mostly monochrome.

Avoid gradients unless extremely subtle and purposeful.

Avoid bright colors.

---

# 7. Typography

Use a premium editorial type system.

Recommended:

### Display / editorial

Use a high-quality serif such as:

- Instrument Serif
- DM Serif Display
- Cormorant Garamond

### UI / body

Use:

- Inter
- Geist
- Manrope

### Technical metadata

Use a monospace font:

- Geist Mono
- IBM Plex Mono

Typography hierarchy:

```text
Display:
72–96px desktop
48–64px tablet
40–48px mobile

H1:
52–72px

H2:
32–44px

H3:
20–28px

Body:
16–18px

Metadata:
11–13px
```

Use fluid typography with `clamp()`.

Do not blindly follow these sizes if optical hierarchy requires adjustment.

---

# 8. Spacing

Use a consistent spacing system.

Prefer multiples of:

```text
4
8
12
16
24
32
48
64
80
96
128
```

Large sections should have generous vertical breathing room.

The design should never feel cramped.

---

# 9. Border Radius

Keep corners subtle.

Suggested:

```text
small controls: 6px
cards: 8–12px
large surfaces: 12–16px
buttons: 6–8px
```

Avoid excessive rounded cards.

This is an editorial website, not a bubbly SaaS UI.

---

# 10. Homepage

## Hero

The first screen should closely follow the selected reference.

Structure:

```text
INDEPENDENT RESEARCH BY AASHIRWAD SHARMA

GEEK

Exploring the intersection
of AI, Computer Science,
Finance and Quantitative Research.

I write and publish research papers, technical notes
and analysis on topics that interest me. This platform
is a space for my work and for anyone who wants to
read, learn and explore.

[ Explore Research → ]

                         abstract technical line/wave
                         visualization
```

The hero visual should be subtle.

Do NOT use a generic stock photo.

Create an abstract mathematical/technical line-field visual using:

- SVG
- CSS
- Canvas
- or a lightweight generated asset

It should resemble a scientific data landscape / flowing mathematical field.

---

# 11. Homepage — Featured Research

Section:

```text
Featured Research                                  View all →

[ Paper ] [ Paper ] [ Paper ] [ Paper ]
```

Each card contains:

```text
AI

Paper title

Short description...

Apr 12, 2026 · 24 min read
```

Cards should be editorial rather than overly decorative.

Hover:

- Slight translate
- Border transition
- Arrow movement
- No exaggerated scaling

---

# 12. Homepage — Research Areas

Create a visually distinct section:

```text
Research Areas

Focused on key areas that shape the work.

[ AI ]
LLMs, deep learning,
optimization, AI systems.

[ Computer Science ]
Algorithms, systems,
software and data.

[ Finance ]
Markets, derivatives,
financial modeling.

[ Quantitative Research ]
Statistics, modeling,
backtesting and data analysis.
```

Use subtle technical icons.

Suggested icons:

- Brain / Network
- Code
- Trending Up
- Sigma

---

# 13. Homepage — Philosophy / Statement

Add a restrained editorial statement.

Example:

```text
Better questions.
Deeper research.
Greater understanding.

— GEEK
```

This can sit over a subtle grayscale technical/mountain/data visualization.

Do not make it motivational or corporate.

---

# 14. Homepage — Footer

Footer:

```text
GEEK

Independent Research by Aashirwad Sharma

Research
About
Contact

GitHub
LinkedIn
X

© 2026 GEEK. All rights reserved.
```

Use actual configured URLs when available.

Do not invent social URLs.

---

# 15. Research Archive

Route:

```text
/research
```

Header:

```text
RESEARCH

All Research Papers

Browse all published papers and research work.
```

Search:

```text
Search papers, topics, or keywords...
```

Controls:

```text
All Fields
All Years
Sort by: Newest
```

Sidebar/filters on desktop:

```text
Research Areas

All
Artificial Intelligence
Computer Science
Finance
Quantitative Research

Year

All
2026
2025
2024
...
```

Mobile:

- Convert sidebar to filter button/sheet
- Keep search prominent

---

# 16. Research List

Use a clean vertical publication index.

Example:

```text
AI

LLM Fine-Tuning Techniques
for Domain Specific Applications

A study of fine-tuning techniques for large
language models...

Apr 12, 2026 · 24 min read                         →

────────────────────────────────────────────

FINANCE

Option Pricing Models and the Role
of Volatility in Modern Markets

Mar 28, 2026 · 18 min read                         →

────────────────────────────────────────────
```

Requirements:

- Keyboard accessible
- Entire row clickable
- Clear focus state
- Smooth hover state
- Pagination or infinite loading
- Empty state
- Loading skeleton
- Error state

---

# 17. Search

Implement real search, not a visual-only input.

Search should search:

- Title
- Abstract
- Tags
- Research area
- Author
- Keywords

Use Supabase/Postgres search initially.

Structure code so full-text search can later be upgraded to:

- PostgreSQL FTS
- pgvector
- semantic search

Search UI:

- Desktop command-style overlay
- Keyboard shortcut `/` or `⌘K`
- Mobile full-screen/search sheet
- Results grouped or listed cleanly

---

# 18. Paper Detail Page

Route:

```text
/research/[slug]
```

This is one of the most important pages.

Header:

```text
← Back to Research

AI

LLM Fine-Tuning Techniques
for Domain Specific Applications

Apr 12, 2026 · 24 min read

Aashirwad Sharma
Independent Researcher

[ Save ]   [ Download PDF ↓ ]
```

Then:

```text
Abstract

...
```

Then paper content.

---

# 19. Paper Reading Experience

The PDF must be a first-class experience.

Desktop layout:

```text
┌───────────────────────────────────────────────────────┐
│ Paper title                                Save PDF   │
├───────────────────────────────┬───────────────────────┤
│                               │ Table of Contents     │
│ Paper content                 │                       │
│                               │ 1. Introduction       │
│                               │ 2. Methodology        │
│                               │ 3. Results            │
│                               │ 4. Discussion         │
│                               │ 5. Conclusion         │
│                               │ References            │
└───────────────────────────────┴───────────────────────┘
```

Requirements:

- Excellent reading width
- Sticky table of contents
- Section highlighting
- Progress indicator
- PDF download
- PDF preview/viewer
- Related papers
- References
- Citation information
- Save/bookmark
- Mobile optimized

Do not make the reader visually noisy.

---

# 20. PDF Viewer

Use a robust PDF viewer.

Required features:

- Page navigation
- Zoom
- Search inside PDF
- Fullscreen
- Download
- Page count
- Thumbnail navigation where practical
- Mobile usability

If PDF.js is used, isolate the viewer in its own component:

```text
components/pdf/PdfViewer.tsx
```

The original PDF should remain downloadable.

Store files in Supabase Storage.

---

# 21. Paper Metadata Model

Each paper should support:

```ts
type ResearchArea =
  | "ai"
  | "computer-science"
  | "finance"
  | "quant";

interface Paper {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  abstract: string;
  content?: string;
  pdfPath: string;
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
```

Do not hardcode papers in UI components.

---

# 22. Supabase Architecture

Use Supabase for:

- Authentication
- PostgreSQL
- Storage

## Authentication providers

Primary:

- Google
- Apple

Also support email/password if useful.

The UI should prioritize:

```text
Continue with Google
Continue with Apple
```

Then divider:

```text
or
```

Then email/password.

---

# 23. Database Schema

Create migrations for:

## profiles

```sql
id uuid primary key references auth.users(id)
display_name text
username text unique
avatar_url text
bio text
created_at timestamptz
updated_at timestamptz
```

## papers

```sql
id uuid primary key
slug text unique not null
title text not null
subtitle text
abstract text not null
content text
pdf_path text not null
cover_image_path text
area text not null
tags text[]
keywords text[]
published_at timestamptz
updated_at timestamptz
read_time_minutes integer
featured boolean default false
status text default 'draft'
citation_text text
doi text
created_at timestamptz default now()
```

## bookmarks

```sql
id uuid primary key
user_id uuid references auth.users(id)
paper_id uuid references papers(id)
created_at timestamptz default now()

unique(user_id, paper_id)
```

## reading_history

```sql
id uuid primary key
user_id uuid references auth.users(id)
paper_id uuid references papers(id)
progress numeric
last_read_at timestamptz default now()

unique(user_id, paper_id)
```

Add appropriate indexes.

---

# 24. Supabase Row Level Security

RLS is mandatory.

Users:

- Can read/update their own profile
- Can create/delete their own bookmarks
- Can read/write their own reading history

Public:

- Can read published papers

Only the owner/admin account should be able to:

- Create papers
- Update papers
- Delete papers
- Upload/change publication assets

Never expose service-role credentials to the client.

Use environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Never commit `.env`.

Provide `.env.example`.

---

# 25. Account System

## Sign-in

Screen should feel premium and minimal.

```text
GEEK

Welcome back

Sign in to save research and
keep track of your reading.

[ Google icon   Continue with Google ]

[ Apple icon    Continue with Apple ]

────────── or ──────────

Email
[________________]

Password
[________________]

Forgot password?

[ Sign in ]

Don't have an account?
Create one
```

Handle:

- Loading
- OAuth errors
- Invalid credentials
- Network errors
- Redirect after authentication
- Existing session
- Sign out

---

# 26. Account Dashboard

Route:

```text
/account
```

Example:

```text
Good morning, Aashirwad

Your research activity.

[ Saved Papers ] [ Reading History ] [ Profile ]

Recently Read

Paper
Paper
Paper
```

For normal users, do not expose publishing controls.

If the logged-in user is the owner/admin, show:

```text
Publisher
Manage Research
```

---

# 27. Saved Papers

Route:

```text
/account/saved
```

Users can:

- Bookmark a paper
- Remove bookmark
- Open paper
- See saved date

Unauthenticated users clicking Save should receive a small sign-in prompt.

Do not force account creation merely to read papers.

---

# 28. Reading History

Track:

- Paper
- Last opened
- Approximate progress

Do not track unnecessary personal data.

Allow users to clear history.

---

# 29. About Page

Design should feel personal but restrained.

Structure:

```text
ABOUT

A little about me,
my research and what drives this platform.

Aashirwad Sharma
Independent Researcher

[Portrait / abstract image]

I'm a researcher and builder with a deep interest in
Artificial Intelligence, Computer Science, Finance
and Quantitative Research.

This platform is where I publish my work, ideas and
findings for anyone who is curious to learn and explore.

My Research Interests

Artificial Intelligence
Computer Science
Finance
Quantitative Research

Connect
GitHub
LinkedIn
X
Email
```

Do not invent biographical facts.

Use placeholders where information is not yet supplied.

---

# 30. Mobile Design

Mobile is not an afterthought.

Target:

```text
320px+
375px
390px
430px
768px
1024px
1280px
1440px+
```

Mobile homepage should preserve the editorial hierarchy.

Header:

```text
GEEK                    Search   Menu
```

Hero:

```text
GEEK

Exploring the intersection
of AI, Computer Science,
Finance and Quantitative
Research.

[ Explore Research → ]
```

Research cards become vertical.

Research archive sidebar becomes a filter sheet.

Paper page:

- Single column
- Sticky compact paper header if useful
- TOC becomes expandable
- PDF viewer adapts to viewport
- Large tap targets

---

# 31. Responsive Breakpoints

Use sensible breakpoints rather than designing only for fixed devices.

Suggested:

```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

Main content max width:

```text
1200–1400px
```

Reading content:

```text
680–820px
```

Do not make long-form paper text span the entire screen.

---

# 32. Accessibility

Target WCAG 2.2 AA where practical.

Must include:

- Semantic HTML
- Proper heading hierarchy
- Keyboard navigation
- Visible focus states
- ARIA labels where required
- Accessible dialogs
- Accessible dropdowns
- Accessible mobile menu
- Alt text
- Reduced motion support
- Sufficient contrast
- Buttons with meaningful labels

Never rely on color alone.

---

# 33. Motion

Motion should be subtle.

Use:

```text
150–250ms
ease-out
```

Examples:

- Navigation hover
- Card hover
- Arrow movement
- Dialog appearance
- Mobile menu
- Search overlay

Avoid:

- Excessive parallax
- Bouncing
- Large page transitions
- Constant animated backgrounds

Support:

```css
@media (prefers-reduced-motion: reduce)
```

---

# 34. Components

Create reusable components.

Suggested structure:

```text
components/
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── MobileNav.tsx
│
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Badge.tsx
│   ├── Dialog.tsx
│   ├── Dropdown.tsx
│   ├── Skeleton.tsx
│   └── EmptyState.tsx
│
├── research/
│   ├── PaperCard.tsx
│   ├── PaperList.tsx
│   ├── PaperHeader.tsx
│   ├── PaperMetadata.tsx
│   ├── ResearchFilters.tsx
│   ├── ResearchSearch.tsx
│   ├── RelatedPapers.tsx
│   └── ResearchArea.tsx
│
├── pdf/
│   ├── PdfViewer.tsx
│   ├── PdfToolbar.tsx
│   └── PdfThumbnails.tsx
│
├── account/
│   ├── AuthButtons.tsx
│   ├── AccountMenu.tsx
│   ├── BookmarkButton.tsx
│   └── ReadingHistory.tsx
│
└── visual/
    └── ResearchField.tsx
```

---

# 35. Suggested App Structure

Use Next.js App Router.

```text
app/
├── layout.tsx
├── page.tsx
├── globals.css
│
├── research/
│   ├── page.tsx
│   └── [slug]/
│       └── page.tsx
│
├── about/
│   └── page.tsx
│
├── sign-in/
│   └── page.tsx
│
├── account/
│   ├── page.tsx
│   ├── saved/
│   │   └── page.tsx
│   ├── history/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
│
└── auth/
    └── callback/
        └── route.ts
```

---

# 36. Data Access

Separate data access from UI.

Suggested:

```text
lib/
├── supabase/
│   ├── client.ts
│   ├── server.ts
│   └── middleware.ts
│
├── queries/
│   ├── papers.ts
│   ├── bookmarks.ts
│   └── history.ts
│
├── auth/
│   └── actions.ts
│
└── utils/
    ├── dates.ts
    ├── reading-time.ts
    └── cn.ts
```

Do not put database calls directly throughout presentation components.

---

# 37. Authentication Flow

Implement Supabase SSR authentication correctly for Next.js.

Requirements:

1. User clicks Google/Apple.
2. OAuth redirect occurs.
3. Supabase callback exchanges the authorization code.
4. Session is established securely.
5. User is redirected to the intended destination.
6. Header updates without requiring a manual refresh.
7. Protected account pages redirect unauthenticated users to sign-in.
8. Sign-out clears the session.

Do not store auth tokens manually in localStorage.

---

# 38. Search / Filtering Behavior

URL should reflect filters.

Example:

```text
/research?q=llm&area=ai&year=2026&sort=newest
```

This makes search/filter state:

- Shareable
- Refreshable
- Browser-history friendly

Debounce search input.

Do not fetch the entire paper database into the browser.

---

# 39. SEO

Every public paper needs excellent metadata.

Implement:

- Dynamic title
- Description
- Open Graph metadata
- Twitter/X metadata
- Canonical URL
- JSON-LD structured data for scholarly articles where appropriate
- Sitemap
- Robots configuration

Paper page title:

```text
Paper Title — GEEK
```

Description should use the paper abstract or a concise generated metadata description.

---

# 40. Performance

Target excellent Core Web Vitals.

Requirements:

- Optimize images
- Lazy load heavy PDF components
- Do not load PDF.js on pages that don't need it
- Use Next.js image optimization
- Use server rendering where beneficial
- Minimize client components
- Avoid unnecessary hydration
- Paginate research results
- Cache public paper queries where appropriate

The homepage should remain fast even when the research archive grows to hundreds/thousands of papers.

---

# 41. Error / Loading / Empty States

Every async feature needs all three.

Examples:

### Research loading

Show editorial skeleton rows.

### No research

```text
No papers found.

Try changing your search or filters.
```

### PDF unavailable

```text
This paper is temporarily unavailable.

Please try again later.
```

### Account loading

Use subtle skeletons.

### Search error

```text
Something went wrong.

Please try again.
```

Do not expose raw Supabase errors to users.

---

# 42. Security

Implement:

- RLS
- Server-side authorization
- Input validation
- Safe URL handling
- Secure OAuth callback
- No service role on client
- No secrets in source
- Rate limiting where appropriate
- Safe rendering of user-generated content
- Sanitization if HTML/Markdown paper content is supported

Never use:

```text
dangerouslySetInnerHTML
```

unless the content has been properly sanitized.

---

# 43. Paper Content Strategy

Initially, PDFs are the canonical published artifact.

A paper may optionally have structured web content.

Support:

```text
Abstract
Introduction
Methodology
Results
Discussion
Conclusion
References
```

If web content is added, it should visually resemble a scholarly publication.

Do not turn papers into ordinary blog posts.

---

# 44. PDF Storage

Use a Supabase Storage bucket such as:

```text
papers
```

Path convention:

```text
papers/{paper-id}/paper.pdf
papers/{paper-id}/cover.webp
papers/{paper-id}/figures/...
```

Do not expose unnecessary storage permissions.

If papers are public, use public assets or signed URLs according to the chosen access model.

---

# 45. Admin / Publisher Architecture

The website is single-publisher.

Create a simple role model:

```text
user
admin
```

Only admin can publish.

Admin functionality can eventually include:

```text
Create Paper
Edit Paper
Upload PDF
Set title
Set abstract
Set category
Set tags
Set publication date
Set featured
Publish / Draft
```

Do not build a giant CMS.

Keep it simple and elegant.

---

# 46. Seed Data

Create a small seed dataset for development only.

Use clearly fictional/sample papers.

Example:

```text
Towards More Efficient LLM Training Paradigms
Efficient Algorithms for Large-Scale Data Processing
Option Pricing Models and Volatility
Statistical Arbitrage in High-Frequency Trading
```

Clearly mark seed data in code so it can be removed/replaced.

Do not present fictional research as Aashirwad Sharma's real published work.

---

# 47. Brand Mark

Initial logo:

```text
GEEK
```

Use typography rather than an icon.

Create a reusable:

```tsx
<Logo />
```

component.

It should support:

```text
default
compact
footer
mobile
```

Do not invent a complex symbol unless requested later.

---

# 48. Iconography

Use Lucide icons.

Icons should be:

- Thin
- Consistent
- Small
- Functional

Examples:

```text
Search
ArrowRight
ArrowUpRight
Download
Bookmark
Menu
X
ChevronDown
Clock
Calendar
ExternalLink
Github
Linkedin
```

Avoid mixing icon families.

---

# 49. User Experience Principles

1. Reading comes before decoration.
2. Research should be discoverable immediately.
3. Authentication should never block public reading.
4. Account features should enhance the experience, not dominate it.
5. Typography is part of the brand.
6. Whitespace is intentional.
7. Every interaction should have a purpose.
8. Mobile must be equally polished.
9. The paper is the product.
10. The interface should age well as the number of papers grows.

---

# 50. Final Visual Direction

Use the selected visual reference as the design target.

Important visual characteristics:

- Warm off-white page
- Near-black typography
- Fine gray rules
- Editorial serif headings
- Clean modern sans-serif UI
- Small uppercase metadata
- Thin research-category labels
- Large whitespace
- Minimal cards
- Structured grids
- Abstract scientific visuals
- Premium but understated buttons
- Dark inverse sections used sparingly
- Responsive mobile presentation

The result should look like an independent research journal designed by a high-end editorial/product design studio.

---

# 51. Do Not

Do not:

- Add neon gradients
- Add excessive glassmorphism
- Use generic stock photography
- Overuse shadows
- Make every element a rounded card
- Add fake statistics
- Invent credentials
- Invent publications
- Invent DOI numbers
- Invent social links
- Claim papers are peer-reviewed unless explicitly provided
- Require login to read public research
- Put fake user data into production
- Hardcode production secrets
- Use Supabase service role in client components
- Build unnecessary microservices
- Over-engineer the architecture

---

# 52. Deliverables

The implementation should produce:

### Frontend

- Fully responsive Next.js application
- All routes above
- Reusable design system
- Homepage
- Research archive
- Paper detail
- PDF reader
- About
- Authentication
- Account dashboard
- Saved papers
- Reading history
- Settings

### Backend

- Supabase integration
- Auth
- Database schema
- RLS policies
- Storage structure
- Queries/actions
- Secure session handling

### Developer experience

- TypeScript
- ESLint
- Prettier
- `.env.example`
- README
- Database migrations
- Seed/development data
- Clear setup instructions

---

# 53. Environment Setup

README must explain:

```bash
npm install
npm run dev
```

Required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Document:

- Creating Supabase project
- Running migrations
- Creating storage bucket
- Configuring Google OAuth
- Configuring Apple OAuth
- Setting callback URLs
- Creating admin user
- Seeding development data

---

# 54. Definition of Done

The project is considered complete only when:

- [ ] Homepage matches the selected visual direction
- [ ] Desktop layout is polished
- [ ] Mobile layout is polished
- [ ] Research archive works
- [ ] Search works
- [ ] Filters work
- [ ] Sorting works
- [ ] Paper pages work
- [ ] PDF viewer works
- [ ] PDF download works
- [ ] Google authentication works once credentials are supplied
- [ ] Apple authentication works once credentials are supplied
- [ ] Protected account routes work
- [ ] Bookmarking works
- [ ] Reading history works
- [ ] Supabase RLS is enabled
- [ ] No secrets are exposed
- [ ] Loading states exist
- [ ] Empty states exist
- [ ] Error states exist
- [ ] Keyboard navigation works
- [ ] Basic accessibility requirements are met
- [ ] SEO metadata exists
- [ ] Sitemap exists
- [ ] README is complete
- [ ] Application builds successfully
- [ ] TypeScript has no errors
- [ ] ESLint passes
- [ ] No fake production claims/data are presented as real

---

# 55. Implementation Instruction to OpenCode

Build this application incrementally.

### Phase 1 — Foundation

1. Initialize Next.js + TypeScript.
2. Install only necessary dependencies.
3. Create design tokens.
4. Configure typography.
5. Build global layout/header/footer.
6. Build responsive primitives.

### Phase 2 — Public Research

1. Homepage.
2. Research archive.
3. Search/filter/sort.
4. Paper detail.
5. PDF viewer.
6. About page.

### Phase 3 — Supabase

1. Supabase clients.
2. Database migrations.
3. Storage.
4. RLS.
5. Paper queries.
6. Authentication.

### Phase 4 — Account

1. Sign-in.
2. OAuth callback.
3. Account dashboard.
4. Saved papers.
5. Reading history.
6. Settings.
7. Account menu.

### Phase 5 — Polish

1. Responsive QA.
2. Accessibility.
3. Loading/error/empty states.
4. SEO.
5. Performance.
6. Motion.
7. Visual consistency.
8. Production build verification.

---

# 56. Important Implementation Behavior

Do not stop after creating static mockups.

Every visible interactive control should actually work.

For example:

- Search must search.
- Filters must filter.
- Sort must sort.
- Save must save.
- Download must download.
- Login must authenticate.
- Logout must logout.
- Account pages must be protected.
- PDF viewer must display PDFs.
- Mobile menu must open/close.
- Search dialog must work.
- URLs should reflect research filters.
- Paper links should use real slugs.
- Database data should drive the UI.

Where external credentials are unavailable, implement the integration completely and provide a clear `.env.example` plus setup instructions rather than replacing functionality with fake behavior.

---

# 57. Quality Bar

The final result should feel like a real product that could be publicly launched.

Prioritize:

**Typography > spacing > layout > information hierarchy > interaction > decoration**

The site should look excellent even with all decorative visuals removed.

The most important page is the **paper reading experience**.

The second most important is **research discovery**.

The third is the **GEEK brand/homepage**.

Build the application around those priorities.

---

## End Goal

Create a premium, minimalist personal research platform called **GEEK**, authored and published by **Aashirwad Sharma**, where people can discover, read, save, and download research across AI, Computer Science, Finance, and Quantitative Research.

The product should be simple enough to launch now, but architected cleanly enough to grow into a serious long-term personal research archive.
