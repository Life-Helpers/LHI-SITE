"use client";

import { useState } from "react";
import { type UseFormReturn } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DonationFormValues } from "@/lib/validations/donation";
import { PRESET_AMOUNTS } from "@/types/donation";

const frequencies = [
  { value: "one_time", label: "One-time" },
  { value: "monthly", label: "Monthly" },
] as const;

export function AmountStep({
  form,
}: {
  form: UseFormReturn<DonationFormValues>;
}) {
  const { register, watch, setValue, formState } = form;
  const amount = watch("amount");
  const [customSelected, setCustomSelected] = useState(
    () => !PRESET_AMOUNTS.includes(amount as (typeof PRESET_AMOUNTS)[number]),
  );

  return (
    <div className="flex flex-col gap-6">
      <fieldset>
        <legend className="text-sm font-medium">Frequency</legend>
        <div
          role="radiogroup"
          aria-label="Donation frequency"
          className="mt-2 grid grid-cols-2 gap-2"
        >
          {frequencies.map((freq) => (
            <label
              key={freq.value}
              className={cn(
                "flex cursor-pointer items-center justify-center rounded-md border border-input px-4 py-2 text-sm font-medium has-checked:border-primary has-checked:bg-primary has-checked:text-primary-foreground has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-offset-2",
              )}
            >
              <input
                type="radio"
                value={freq.value}
                className="sr-only"
                {...register("frequency")}
              />
              {freq.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium">Amount (USD)</legend>
        <div
          role="radiogroup"
          aria-label="Preset donation amount"
          className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4"
        >
          {PRESET_AMOUNTS.map((preset) => (
            <label
              key={preset}
              className="flex cursor-pointer items-center justify-center rounded-md border border-input px-4 py-3 text-sm font-medium has-checked:border-primary has-checked:bg-primary has-checked:text-primary-foreground has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-offset-2"
            >
              <input
                type="radio"
                name="amount-preset"
                className="sr-only"
                checked={!customSelected && amount === preset}
                onChange={() => {
                  setCustomSelected(false);
                  setValue("amount", preset, { shouldValidate: true });
                }}
              />
              ${preset}
            </label>
          ))}
        </div>

        <div className="mt-3">
          <label
            className={cn(
              "mb-1 flex cursor-pointer items-center gap-2 text-sm",
            )}
          >
            <input
              type="radio"
              name="amount-preset"
              className="h-4 w-4"
              checked={customSelected}
              onChange={() => setCustomSelected(true)}
            />
            Custom amount
          </label>

          {customSelected && (
            <div className="mt-2 max-w-40">
              <Label htmlFor="amount" className="sr-only">
                Custom donation amount in US dollars
              </Label>
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                >
                  $
                </span>
                <Input
                  id="amount"
                  type="number"
                  min={5}
                  max={50000}
                  step="1"
                  className="pl-6"
                  aria-invalid={!!formState.errors.amount}
                  aria-describedby={
                    formState.errors.amount ? "amount-error" : undefined
                  }
                  {...register("amount", { valueAsNumber: true })}
                />
              </div>
            </div>
          )}
        </div>

        {formState.errors.amount && (
          <p id="amount-error" role="alert" className="mt-2 text-sm text-destructive">
            {formState.errors.amount.message}
          </p>
        )}
      </fieldset>
    </div>
  );
}
