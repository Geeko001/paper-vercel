"use client";

import { useRef, useState } from "react";

const SOUNDS = [
  "/sounds/oof.mp3",
  "/sounds/fbiopenup.mp3",
  "/sounds/missionfailed.mp3",
  "/sounds/xpstartup.mp3",
  "/sounds/2sad4me.mp3",
];

const QUIPS = [
  "nope.",
  "nice try.",
  "budget says no.",
  "momos > auth.",
  "the machine broke. allegedly.",
  "denied with love.",
];

/** Decorative joke buttons. They do nothing except play a meme sound. */
export function AuthJoke() {
  const [denied, setDenied] = useState(0);
  const [quip, setQuip] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function blast() {
    const src = SOUNDS[Math.floor(Math.random() * SOUNDS.length)];
    try {
      audioRef.current?.pause();
      const audio = new Audio(src);
      audioRef.current = audio;
      void audio.play().catch(() => {
        // Autoplay blocked or file missing — the joke still lands visually.
      });
    } catch {
      // No audio support — shake on regardless.
    }
    setQuip(QUIPS[Math.floor(Math.random() * QUIPS.length)]);
    setShakeKey((k) => k + 1);
    setDenied((d) => d + 1);
  }

  const btn =
    "flex-1 rounded-[8px] border rule bg-background px-4 py-2.5 text-[13.5px] font-medium transition-colors hover:border-border-strong active:scale-[0.98]";

  return (
    <div className="mt-6">
      <div key={shakeKey} className="anim-shake flex gap-2.5">
        <button type="button" onClick={blast} className={btn}>
          Sign In
        </button>
        <button type="button" onClick={blast} className={btn}>
          Sign Up
        </button>
      </div>
      <p className="mt-2.5 min-h-5 text-[12.5px] text-foreground-muted" aria-live="polite">
        {quip ?? "go on. press one."}
        {denied > 0 && ` · login attempts denied: ${denied}`}
      </p>
    </div>
  );
}
