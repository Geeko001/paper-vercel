// Guest identities: random name + generated avatar, tab-session only.
// Stored in sessionStorage (cleared when the tab closes) — nothing is ever
// sent to Supabase or any server. Full privacy by construction.

export interface GuestIdentity {
  name: string;
  avatar: string; // SVG data URI
  createdAt: string;
}

const ADJECTIVES = [
  "Curious",
  "Quiet",
  "Bright",
  "Calm",
  "Eager",
  "Gentle",
  "Keen",
  "Lucid",
  "Nimble",
  "Patient",
  "Rapid",
  "Silent",
  "Steady",
  "Vivid",
  "Wise",
];

const NOUNS = [
  "Fox",
  "Comet",
  "Lens",
  "River",
  "Sparrow",
  "Theorem",
  "Beacon",
  "Meadow",
  "Prism",
  "Voyager",
  "Willow",
  "Cipher",
  "Harbor",
  "Juniper",
  "Orbit",
];

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function generateGuestName(): string {
  const a = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const n = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${a} ${n}`;
}

/** Deterministic pastel avatar from the name — same name, same picture. */
export function guestAvatarDataUri(name: string): string {
  const hue = hashString(name) % 360;
  const initial = (name.trim().slice(0, 1) || "G").toUpperCase();
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'>` +
    `<rect width='64' height='64' rx='32' fill='hsl(${hue},30%,88%)'/>` +
    `<text x='32' y='43' font-family='Georgia,serif' font-size='30' fill='#111315' text-anchor='middle'>${initial}</text>` +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const KEY = "geek-guest";

export function loadGuest(): GuestIdentity | null {
  try {
    if (typeof window === "undefined" || !("sessionStorage" in window))
      return null;
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<GuestIdentity>;
    if (!parsed.name || !parsed.avatar) return null;
    return parsed as GuestIdentity;
  } catch {
    return null;
  }
}

export function saveGuest(guest: GuestIdentity): void {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(guest));
  } catch {
    // Private mode without storage — guest still works for this render.
  }
}

export function clearGuest(): void {
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    // Ignore.
  }
}

export function createGuestIdentity(): GuestIdentity {
  const name = generateGuestName();
  return {
    name,
    avatar: guestAvatarDataUri(name),
    createdAt: new Date().toISOString(),
  };
}
