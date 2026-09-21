-- GEEK initial schema: profiles, papers, bookmarks, reading_history,
-- RLS policies, auto-profile trigger, and the `papers` storage bucket.
-- Run this in the Supabase Dashboard (SQL Editor) on your project.

-- ── Tables ────────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  username text unique,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.papers (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  abstract text not null,
  content text,
  pdf_path text not null,
  cover_image_path text,
  area text not null check (area in ('ai', 'computer-science', 'finance', 'quant')),
  tags text[] not null default '{}',
  keywords text[] not null default '{}',
  published_at timestamptz,
  updated_at timestamptz,
  read_time_minutes integer,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  citation_text text,
  doi text,
  created_at timestamptz not null default now()
);

create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  paper_id uuid not null references public.papers (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, paper_id)
);

create table if not exists public.reading_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  paper_id uuid not null references public.papers (id) on delete cascade,
  progress numeric,
  last_read_at timestamptz not null default now(),
  unique (user_id, paper_id)
);

create index if not exists papers_status_published_idx
  on public.papers (status, published_at desc);
create index if not exists papers_area_idx on public.papers (area);
create index if not exists papers_slug_idx on public.papers (slug);
create index if not exists bookmarks_user_idx on public.bookmarks (user_id);
create index if not exists history_user_idx on public.reading_history (user_id);

-- ── Auto-create a profile row for every new auth user ─────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, split_part(new.email, '@', 1))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Row Level Security ────────────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.papers enable row level security;
alter table public.bookmarks enable row level security;
alter table public.reading_history enable row level security;

-- Public can read published papers; only the service role writes papers.
drop policy if exists "Public reads published papers" on public.papers;
create policy "Public reads published papers"
  on public.papers for select
  using (status = 'published');

-- Users read/update their own profile.
drop policy if exists "Users manage own profile" on public.profiles;
create policy "Users manage own profile"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Users manage their own bookmarks and history.
drop policy if exists "Users manage own bookmarks" on public.bookmarks;
create policy "Users manage own bookmarks"
  on public.bookmarks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users manage own history" on public.reading_history;
create policy "Users manage own history"
  on public.reading_history for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── Storage: `papers` bucket for original PDFs ────────────────────────────
-- Path convention: papers/{paper-id}/paper.pdf, papers/{paper-id}/cover.webp

insert into storage.buckets (id, name, public)
values ('papers', 'papers', true)
on conflict (id) do nothing;

drop policy if exists "Public reads paper files" on storage.objects;
create policy "Public reads paper files"
  on storage.objects for select
  using (bucket_id = 'papers');

-- Uploads/deletes go through the service role (server-side admin actions).
