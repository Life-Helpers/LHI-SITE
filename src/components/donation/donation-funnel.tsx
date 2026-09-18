"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AmountStep } from "@/components/donation/amount-step";
import { DonorStep } from "@/components/donation/donor-step";
import { PaymentStep } from "@/components/donation/payment-step";
import {
  amountStepFields,
  donationSchema,
  donorStepFields,
  type DonationFormValues,
} from "@/lib/validations/donation";
import { PRESET_AMOUNTS } from "@/types/donation";

const steps = [
  { title: "Amount", description: "Choose how much and how often." },
  { title: "Your information", description: "Who this gift is from." },
  { title: "Review", description: "Confirm before payment." },
] as const;

export function DonationFunnel() {
  const [step, setStep] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    mode: "onBlur",
    defaultValues: {
      frequency: "one_time",
      amount: PRESET_AMOUNTS[1],
      donorName: "",
      donorEmail: "",
      message: "",
    },
  });

  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  async function goNext() {
    const fields = step === 0 ? amountStepFields : donorStepFields;
    const valid = await form.trigger(fields);
    if (valid) setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  const current = steps[step];
  const errorCount = Object.keys(form.formState.errors).length;

  return (
    <Card>
      <CardContent className="p-6 sm:p-8">
        <ol className="mb-6 flex items-center gap-2" aria-label="Progress">
          {steps.map((s, i) => (
            <li key={s.title} className="flex flex-1 items-center gap-2">
              <span
                aria-current={i === step ? "step" : undefined}
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  i <= step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </span>
              <span
                className={`hidden text-sm sm:inline ${
                  i === step ? "font-medium text-foreground" : "text-muted-foreground"
                }`}
              >
                {s.title}
              </span>
              {i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`h-px flex-1 ${i < step ? "bg-primary" : "bg-border"}`}
                />
              )}
            </li>
          ))}
        </ol>

        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-xl font-semibold tracking-tight outline-none"
        >
          {current.title}
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          {current.description}
        </p>

        {errorCount > 0 && (
          <p role="alert" className="mb-4 text-sm font-medium text-destructive">
            Please fix {errorCount === 1 ? "1 field" : `${errorCount} fields`}{" "}
            below.
          </p>
        )}

        <form
          onSubmit={(e) => e.preventDefault()}
          noValidate
          className="flex flex-col gap-6"
        >
          {step === 0 && <AmountStep form={form} />}
          {step === 1 && <DonorStep form={form} />}
          {step === 2 && <PaymentStep values={form.getValues()} />}

          <div className="flex justify-between gap-3 border-t border-border pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={step === 0}
            >
              Back
            </Button>

            {step < steps.length - 1 && (
              <Button type="button" onClick={goNext}>
                Continue
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
