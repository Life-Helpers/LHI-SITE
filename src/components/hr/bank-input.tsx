"use client";

import { useId, useRef, useState } from "react";
import { Building2 } from "lucide-react";

import { inputClass } from "@/components/hr/ui";
import { canonicalBankName, matchBanks } from "@/lib/hr/nigerian-banks";

/**
 * Bank name with suggestions from Nigeria's banks as you type (full names, or short forms like
 * GTB, FBN, UBA). Pick one with the mouse or the arrow keys and Enter; a short form typed in full
 * is filled in with the bank's usual name. Any other bank can still be typed.
 */
export function BankInput({ name = "bankName", defaultValue = "" }: { name?: string; defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  const input = useRef<HTMLInputElement>(null);
  const options = matchBanks(value);
  const choose = (bank: string) => {
    setValue(bank);
    setOpen(false);
    input.current?.focus();
  };

  return (
    <div className="relative">
      <input
        ref={input}
        name={name}
        value={value}
        role="combobox"
        aria-expanded={open && options.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && options[active] ? `${listId}-${active}` : undefined}
        autoComplete="off"
        placeholder="Start typing, e.g. GTB, Zenith, OPay"
        className={inputClass}
        onChange={(e) => {
          setValue(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          // Let a click on a suggestion land first; then tidy a short form into the bank's name.
          setTimeout(() => {
            setOpen(false);
            setValue((v) => canonicalBankName(v));
          }, 150);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setActive((i) => Math.min(i + 1, options.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
          } else if (e.key === "Enter" && open && options[active]) {
            e.preventDefault();
            choose(options[active].name);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
      />
      {open && options.length > 0 && (
        // In the page flow rather than floating, so a card's edge never cuts the list off.
        <ul id={listId} role="listbox" aria-label="Nigerian banks" className="mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-admin-border bg-admin-card py-1 shadow-md">
          {options.map((b, i) => (
            <li
              key={b.name}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(b.name);
              }}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-start gap-2 px-3 py-2 text-sm ${i === active ? "bg-admin-primary-soft text-admin-text" : "text-admin-text"}`}
            >
              <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-admin-muted" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block">{b.name}</span>
                <span className="block text-[11px] text-admin-muted">{b.kind}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
