import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Inline gradient span for key words in headings (RED → Orange). */
export function GradientText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent",
        className,
      )}
    >
      {children}
    </span>
  );
}
