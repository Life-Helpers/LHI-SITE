/** A small green label above an icon button on hover or keyboard focus (CSS only). */
export function Tip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <span className="group/tip relative inline-flex">
      {children}
      <span
        role="presentation"
        className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-admin-primary px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow transition-opacity group-hover/tip:opacity-100 group-focus-within/tip:opacity-100"
      >
        {label}
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-admin-primary" aria-hidden="true" />
      </span>
    </span>
  );
}
