import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-xs font-semibold text-accent uppercase tracking-[4px]",
        className,
      )}
    >
      {children}
    </p>
  );
}
