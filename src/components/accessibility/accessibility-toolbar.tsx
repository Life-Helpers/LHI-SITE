"use client";

import { Accessibility, Minus, Plus } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAccessibility } from "@/components/accessibility/accessibility-context";

export function AccessibilityToolbar() {
  const {
    fontScale,
    dyslexiaFont,
    reducedMotion,
    increaseFontSize,
    decreaseFontSize,
    toggleDyslexiaFont,
    toggleReducedMotion,
  } = useAccessibility();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Accessibility settings"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground hover:border-accent focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Accessibility className="h-4.5 w-4.5" aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent aria-label="Accessibility settings">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-semibold">Text size</p>
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={decreaseFontSize}
                aria-label="Decrease text size"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:border-accent focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">A-</span>
              </button>
              <span
                className="min-w-12 text-center text-sm text-muted-foreground"
                aria-live="polite"
              >
                {Math.round(fontScale * 100)}%
              </span>
              <button
                type="button"
                onClick={increaseFontSize}
                aria-label="Increase text size"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:border-accent focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">A+</span>
              </button>
            </div>
          </div>

          <label className="flex cursor-pointer items-center justify-between gap-3 text-sm">
            <span>Dyslexia-friendly font</span>
            <input
              type="checkbox"
              checked={dyslexiaFont}
              onChange={toggleDyslexiaFont}
              className="h-4 w-4 accent-accent"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between gap-3 text-sm">
            <span>Reduce motion</span>
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={toggleReducedMotion}
              className="h-4 w-4 accent-accent"
            />
          </label>
        </div>
      </PopoverContent>
    </Popover>
  );
}
