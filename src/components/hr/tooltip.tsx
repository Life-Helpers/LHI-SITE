/**
 * A small green label beside an icon button on hover or keyboard focus (CSS only).
 * `side="left"` wraps the text and opens to the left, for use inside scrolling panels.
 */
export function Tip({ label, children, side = "top" }: { label: string; children: React.ReactNode; side?: "top" | "left" }) {
  const left = side === "left";
  return (
    <span className="group/tip relative inline-flex">
      {children}
      <span
        role="presentation"
        className={`pointer-events-none absolute z-30 rounded-md bg-admin-primary px-2.5 py-1 text-left text-xs font-medium text-white opacity-0 shadow transition-opacity group-hover/tip:opacity-100 group-focus-within/tip:opacity-100 ${
          left ? "right-full top-1/2 mr-2 w-max max-w-52 -translate-y-1/2 whitespace-normal" : "bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap"
        }`}
      >
        {label}
        <span
          className={`absolute border-4 border-transparent ${left ? "left-full top-1/2 -translate-y-1/2 border-l-admin-primary" : "left-1/2 top-full -translate-x-1/2 border-t-admin-primary"}`}
          aria-hidden="true"
        />
      </span>
    </span>
  );
}
