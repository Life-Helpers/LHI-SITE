"use client";

import { type UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { DonationFormValues } from "@/lib/validations/donation";

export function DonorStep({
  form,
}: {
  form: UseFormReturn<DonationFormValues>;
}) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label htmlFor="donorName">Full name</Label>
        <Input
          id="donorName"
          autoComplete="name"
          className="mt-1"
          aria-invalid={!!errors.donorName}
          aria-describedby={errors.donorName ? "donorName-error" : undefined}
          {...register("donorName")}
        />
        {errors.donorName && (
          <p
            id="donorName-error"
            role="alert"
            className="mt-1 text-sm text-destructive"
          >
            {errors.donorName.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="donorEmail">Email address</Label>
        <Input
          id="donorEmail"
          type="email"
          autoComplete="email"
          className="mt-1"
          aria-invalid={!!errors.donorEmail}
          aria-describedby={
            errors.donorEmail ? "donorEmail-error" : undefined
          }
          {...register("donorEmail")}
        />
        {errors.donorEmail && (
          <p
            id="donorEmail-error"
            role="alert"
            className="mt-1 text-sm text-destructive"
          >
            {errors.donorEmail.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="message">Message (optional)</Label>
        <Textarea
          id="message"
          className="mt-1"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          {...register("message")}
        />
        {errors.message && (
          <p
            id="message-error"
            role="alert"
            className="mt-1 text-sm text-destructive"
          >
            {errors.message.message}
          </p>
        )}
      </div>
    </div>
  );
}
