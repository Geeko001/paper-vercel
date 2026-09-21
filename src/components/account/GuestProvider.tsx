"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  clearGuest,
  createGuestIdentity,
  loadGuest,
  saveGuest,
  type GuestIdentity,
} from "@/lib/guest";

interface GuestContext {
  guest: GuestIdentity | null;
  ready: boolean;
  startGuest: () => void;
  endGuest: () => void;
}

const Context = createContext<GuestContext>({
  guest: null,
  ready: false,
  startGuest: () => {},
  endGuest: () => {},
});

export function useGuest(): GuestContext {
  return useContext(Context);
}

export function GuestProvider({ children }: { children: React.ReactNode }) {
  const [guest, setGuest] = useState<GuestIdentity | null>(null);
  const [ready, setReady] = useState(false);

  // Deferred to a task so the first client render matches the server HTML.
  useEffect(() => {
    const t = setTimeout(() => {
      setGuest(loadGuest());
      setReady(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const startGuest = useCallback(() => {
    const identity = createGuestIdentity();
    saveGuest(identity);
    setGuest(identity);
  }, []);

  const endGuest = useCallback(() => {
    clearGuest();
    setGuest(null);
  }, []);

  return (
    <Context.Provider value={{ guest, ready, startGuest, endGuest }}>
      {children}
    </Context.Provider>
  );
}
