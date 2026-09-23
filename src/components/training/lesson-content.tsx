import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

import type { LessonBlock } from "@/data/training/courses";

const TONES = {
  info: { icon: Info, className: "border-blue-500/30 bg-blue-500/5 text-blue-900 dark:text-blue-200" },
  warning: { icon: AlertTriangle, className: "border-primary/30 bg-primary/5 text-foreground" },
  success: { icon: CheckCircle2, className: "border-emerald-500/30 bg-emerald-500/5 text-emerald-900 dark:text-emerald-200" },
};

export function LessonContent({ blocks }: { blocks: LessonBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p key={i} className="text-base leading-relaxed text-foreground/90">
                {block.text}
              </p>
            );
          case "list":
            return (
              <div key={i}>
                {block.title && <h3 className="mb-2 font-bold text-foreground">{block.title}</h3>}
                <ul className="space-y-2">
                  {block.items.map((item) => (
                    <li key={item} className="flex gap-2.5 text-base leading-relaxed text-foreground/90">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          case "steps":
            return (
              <div key={i}>
                {block.title && <h3 className="mb-3 font-bold text-foreground">{block.title}</h3>}
                <ol className="space-y-3">
                  {block.items.map((item, n) => (
                    <li key={item} className="flex gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {n + 1}
                      </span>
                      <span className="pt-0.5 text-base leading-relaxed text-foreground/90">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            );
          case "callout": {
            const tone = TONES[block.tone];
            return (
              <div key={i} className={`flex gap-3 rounded-2xl border p-5 ${tone.className}`}>
                <tone.icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-bold">{block.title}</p>
                  <p className="mt-1 text-sm leading-relaxed">{block.text}</p>
                </div>
              </div>
            );
          }
        }
      })}
    </div>
  );
}
