"use client";

import { useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Lock } from "lucide-react";

import { forgotPasswordAction, loginAction, resetPasswordAction, setupAction, verifyTwoFactorLoginAction, type ActionResult } from "@/app/admin/actions";

const inputClass =
  "mt-1.5 block w-full rounded-lg border border-admin-border bg-admin-card px-3.5 py-2.5 text-sm text-admin-text outline-none placeholder:text-admin-muted focus:border-admin-primary focus:ring-3 focus:ring-admin-primary/20";

function AuthCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image src="/logo.png" alt="Life Helpers Initiative" width={180} height={52} className="h-11 w-auto" priority />
          <h1 className="mt-6 text-2xl font-bold">{title}</h1>
          <p className="mt-1.5 text-sm text-admin-muted">{subtitle}</p>
        </div>
        <div className="rounded-2xl border border-admin-border bg-admin-card p-7 shadow-sm">{children}</div>
        <p className="mt-6 text-center text-xs text-admin-muted">
          <Link href="/" className="hover:text-admin-primary">
            ← Back to lhinigeria.org
          </Link>
        </p>
      </div>
    </main>
  );
}

function ErrorBox({ state }: { state: ActionResult | null }) {
  if (!state?.error) return null;
  return (
    <p role="alert" className="rounded-lg bg-admin-danger-soft px-3.5 py-2.5 text-sm text-admin-danger">
      {state.error}
    </p>
  );
}

function SubmitButton({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-admin-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
      {children}
    </button>
  );
}

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);
  return (
    <AuthCard title="Sign in to LHI Admin" subtitle="Manage the Life Helpers Initiative website">
      <form action={action} className="space-y-4">
        <ErrorBox state={state} />
        <label className="block text-sm font-medium">
          Email
          <input name="email" type="email" autoComplete="username" required defaultValue={state?.values?.email} className={inputClass} />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
        </label>
        <SubmitButton pending={pending}>Sign in</SubmitButton>
        <p className="text-center text-xs text-admin-muted">
          <Link href="/admin/forgot" className="font-medium text-admin-primary hover:underline">
            Forgot your password?
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}

export function TwoFactorLoginForm() {
  const [state, action, pending] = useActionState(verifyTwoFactorLoginAction, null);
  return (
    <AuthCard title="Two-step verification" subtitle="Enter the 6-digit code from your authenticator app">
      <form action={action} className="space-y-4">
        <ErrorBox state={state} />
        <label className="block text-sm font-medium">
          Verification code
          <input
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9 ]{6,7}"
            maxLength={7}
            required
            autoFocus
            className={`${inputClass} text-center font-mono text-lg tracking-[0.5em]`}
          />
        </label>
        <SubmitButton pending={pending}>Verify and sign in</SubmitButton>
        <p className="text-center text-xs text-admin-muted">
          Lost your phone? Ask an administrator to reset two-step verification for your account.{" "}
          <Link href="/admin/login" className="text-admin-primary hover:underline">
            Start again
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(forgotPasswordAction, null);
  return (
    <AuthCard title="Reset your password" subtitle="We'll email you a one-time link that expires in one hour">
      {state?.ok ? (
        <div role="status" className="space-y-4 text-sm">
          <p>If that email belongs to a team account, a reset link is on its way.</p>
          <p className="text-admin-muted">No email? Ask an administrator to set a new password for you under Users.</p>
          <Link href="/admin/login" className="font-medium text-admin-primary hover:underline">
            ← Back to sign in
          </Link>
        </div>
      ) : (
        <form action={action} className="space-y-4">
          <ErrorBox state={state} />
          <label className="block text-sm font-medium">
            Email
            <input name="email" type="email" autoComplete="username" required defaultValue={state?.values?.email} className={inputClass} />
          </label>
          <SubmitButton pending={pending}>Send reset link</SubmitButton>
          <p className="text-center text-xs text-admin-muted">
            <Link href="/admin/login" className="hover:text-admin-primary">
              Back to sign in
            </Link>
          </p>
        </form>
      )}
    </AuthCard>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(resetPasswordAction, null);
  return (
    <AuthCard title="Choose a new password" subtitle="At least 10 characters, with letters and numbers">
      <form action={action} className="space-y-4">
        <ErrorBox state={state} />
        <input type="hidden" name="token" value={token} />
        <label className="block text-sm font-medium">
          New password
          <input name="password" type="password" autoComplete="new-password" required minLength={10} className={inputClass} />
        </label>
        <label className="block text-sm font-medium">
          Confirm new password
          <input name="confirm" type="password" autoComplete="new-password" required minLength={10} className={inputClass} />
        </label>
        <SubmitButton pending={pending}>Save and sign in</SubmitButton>
      </form>
    </AuthCard>
  );
}

export function SetupForm({ tokenRequired }: { tokenRequired: boolean }) {
  const [state, action, pending] = useActionState(setupAction, null);
  return (
    <AuthCard title="Welcome to LHI Admin" subtitle="Create the first administrator account to finish setup.">
      <form action={action} className="space-y-4">
        <ErrorBox state={state} />
        {tokenRequired && (
          <label className="block text-sm font-medium">
            Setup token
            <input name="token" type="password" required className={inputClass} />
            <span className="mt-1 block text-xs font-normal text-admin-muted">The value of CMS_SETUP_TOKEN on the server.</span>
          </label>
        )}
        <label className="block text-sm font-medium">
          Your name
          <input name="name" autoComplete="name" required defaultValue={state?.values?.name} className={inputClass} />
        </label>
        <label className="block text-sm font-medium">
          Email
          <input name="email" type="email" autoComplete="username" required defaultValue={state?.values?.email} className={inputClass} />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input name="password" type="password" autoComplete="new-password" minLength={10} required className={inputClass} />
          <span className="mt-1 block text-xs font-normal text-admin-muted">At least 10 characters, with letters and numbers.</span>
        </label>
        <SubmitButton pending={pending}>Create administrator</SubmitButton>
      </form>
    </AuthCard>
  );
}
