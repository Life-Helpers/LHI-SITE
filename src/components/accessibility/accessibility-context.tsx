"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "lhi-accessibility";
const FONT_SCALE_STEPS = [0.875, 1, 1.125, 1.25, 1.375];
const DEFAULT_FONT_SCALE = 1;

type AccessibilityState = {
  fontScale: number;
  dyslexiaFont: boolean;
  reducedMotion: boolean;
};

type AccessibilityContextValue = AccessibilityState & {
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  toggleDyslexiaFont: () => void;
  toggleReducedMotion: () => void;
};

const AccessibilityContext = createContext<AccessibilityContextValue | null>(
  null,
);

function loadStoredState(): AccessibilityState {
  if (typeof window === "undefined") {
    return {
      fontScale: DEFAULT_FONT_SCALE,
      dyslexiaFont: false,
      reducedMotion: false,
    };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("no stored preferences");
    const parsed = JSON.parse(raw) as Partial<AccessibilityState>;
    return {
      fontScale: parsed.fontScale ?? DEFAULT_FONT_SCALE,
      dyslexiaFont: parsed.dyslexiaFont ?? false,
      reducedMotion: parsed.reducedMotion ?? false,
    };
  } catch {
    return {
      fontScale: DEFAULT_FONT_SCALE,
      dyslexiaFont: false,
      reducedMotion: false,
    };
  }
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AccessibilityState>({
    fontScale: DEFAULT_FONT_SCALE,
    dyslexiaFont: false,
    reducedMotion: false,
  });

  useEffect(() => {
    setState(loadStoredState());
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--font-scale", String(state.fontScale));
    root.dataset.dyslexiaFont = String(state.dyslexiaFont);
    root.dataset.reducedMotion = String(state.reducedMotion);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Private browsing / storage disabled — preferences just won't persist.
    }
  }, [state]);

  const increaseFontSize = useCallback(() => {
    setState((prev) => {
      const next = FONT_SCALE_STEPS.find((step) => step > prev.fontScale);
      return next ? { ...prev, fontScale: next } : prev;
    });
  }, []);

  const decreaseFontSize = useCallback(() => {
    setState((prev) => {
      const next = [...FONT_SCALE_STEPS]
        .reverse()
        .find((step) => step < prev.fontScale);
      return next ? { ...prev, fontScale: next } : prev;
    });
  }, []);

  const toggleDyslexiaFont = useCallback(() => {
    setState((prev) => ({ ...prev, dyslexiaFont: !prev.dyslexiaFont }));
  }, []);

  const toggleReducedMotion = useCallback(() => {
    setState((prev) => ({ ...prev, reducedMotion: !prev.reducedMotion }));
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{
        ...state,
        increaseFontSize,
        decreaseFontSize,
        toggleDyslexiaFont,
        toggleReducedMotion,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider",
    );
  }
  return ctx;
}
