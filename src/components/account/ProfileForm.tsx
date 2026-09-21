"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Profile {
  display_name: string;
  username: string;
  avatar_url: string;
  bio: string;
}

const USERNAME_RE = /^[a-z0-9_]{3,30}$/;

export function ProfileForm({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Profile>({
    display_name: "",
    username: "",
    avatar_url: "",
    bio: "",
  });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, username, avatar_url, bio")
        .eq("id", userId)
        .maybeSingle();
      if (error) {
        // Most likely the migration hasn't been run yet.
        setUnavailable(true);
      } else if (data) {
        setForm({
          display_name: data.display_name ?? "",
          username: data.username ?? "",
          avatar_url: data.avatar_url ?? "",
          bio: data.bio ?? "",
        });
      }
      setLoading(false);
    }
    load();
  }, [userId]);

  function set<K extends keyof Profile>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    const username = form.username.trim().toLowerCase();
    if (username && !USERNAME_RE.test(username)) {
      setError(
        "Username must be 3–30 characters: lowercase letters, numbers, underscores.",
      );
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("profiles").upsert(
      {
        id: userId,
        display_name: form.display_name.trim() || null,
        username: username || null,
        avatar_url: form.avatar_url.trim() || null,
        bio: form.bio.trim() || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );
    setSaving(false);

    if (error) {
      setError(
        error.code === "23505"
          ? "That username is taken. Try another."
          : "Couldn't save. Please try again.",
      );
      return;
    }
    setForm((f) => ({ ...f, username }));
    setSaved(true);
  }

  const input =
    "mt-1.5 w-full rounded-[8px] border rule bg-background px-3.5 py-2.5 text-[14px] outline-none placeholder:text-foreground-muted/70 disabled:opacity-60";

  if (loading) {
    return (
      <div className="space-y-3" aria-label="Loading profile">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-12 animate-pulse rounded-[8px] bg-surface-muted" />
        ))}
      </div>
    );
  }

  if (unavailable) {
    return (
      <p className="rounded-[8px] border rule bg-surface px-4 py-3 text-[13.5px] text-foreground-muted">
        Profiles aren&apos;t available yet — run{" "}
        <code className="font-mono text-[12.5px]">supabase/migrations/0001_schema.sql</code>{" "}
        in the Supabase SQL Editor first.
      </p>
    );
  }

  const initial = (form.display_name || form.username || "G")
    .slice(0, 1)
    .toUpperCase();

  return (
    <form onSubmit={save} className="space-y-4">
      <div className="flex items-center gap-4">
        {form.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={form.avatar_url}
            alt="Avatar preview"
            className="h-12 w-12 rounded-full border rule object-cover"
          />
        ) : (
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-inverse text-[16px] font-semibold text-inverse-foreground">
            {initial}
          </span>
        )}
        <div className="flex-1">
          <label className="block text-[13px] font-medium" htmlFor="avatar_url">
            Avatar image URL
          </label>
          <input
            id="avatar_url"
            type="url"
            value={form.avatar_url}
            onChange={(e) => set("avatar_url", e.target.value)}
            placeholder="https://…"
            className={input}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-[13px] font-medium" htmlFor="display_name">
          Display name
          <input
            id="display_name"
            type="text"
            maxLength={60}
            value={form.display_name}
            onChange={(e) => set("display_name", e.target.value)}
            placeholder="Aashirwad Sharma"
            className={input}
          />
        </label>
        <label className="block text-[13px] font-medium" htmlFor="username">
          Username
          <input
            id="username"
            type="text"
            maxLength={30}
            value={form.username}
            onChange={(e) => set("username", e.target.value)}
            placeholder="aashirwad"
            className={input}
          />
        </label>
      </div>

      <label className="block text-[13px] font-medium" htmlFor="bio">
        Bio
        <textarea
          id="bio"
          rows={3}
          maxLength={280}
          value={form.bio}
          onChange={(e) => set("bio", e.target.value)}
          placeholder="A line or two about what you like…"
          className={`${input} resize-none`}
        />
      </label>

      {error && (
        <p role="alert" className="rounded-[8px] border border-red-300/60 bg-red-50 px-3.5 py-2.5 text-[13px] text-red-900">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-[7px] bg-inverse px-4 py-2 text-[13.5px] font-medium text-inverse-foreground transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save profile"}
        </button>
        {saved && (
          <p role="status" className="text-[13px] text-foreground-muted">
            Saved ✓
          </p>
        )}
      </div>
    </form>
  );
}
