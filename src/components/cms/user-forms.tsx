"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Save, Trash2 } from "lucide-react";

import { deleteUserAction, saveUserAction, updateProfileAction } from "@/app/admin/actions";
import { buttonClass, Card, inputClass } from "@/components/cms/ui";
import type { PublicUser } from "@/lib/cms/schema";

export type RoleOption = { id: string; name: string; description: string; count: number; canManageUsers: boolean };

function Row({ label, error, children, help }: { label: string; error?: string; help?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <div className="mt-1.5">{children}</div>
      {help && <span className="mt-1 block text-xs font-normal text-admin-muted">{help}</span>}
      {error && <span className="mt-1 block text-xs font-medium text-admin-danger">{error}</span>}
    </label>
  );
}

function Notice({ state }: { state: { ok: boolean; text: string } | null }) {
  if (!state) return null;
  return (
    <p
      role={state.ok ? "status" : "alert"}
      className={`rounded-lg px-4 py-3 text-sm ${state.ok ? "bg-admin-success-soft text-admin-success" : "bg-admin-danger-soft text-admin-danger"}`}
    >
      {state.text}
    </p>
  );
}

export function UserForm({ user, isSelf, roles }: { user?: PublicUser; isSelf?: boolean; roles: RoleOption[] }) {
  const router = useRouter();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [role, setRole] = useState<string>(user?.role ?? roles.find((r) => r.id === "author")?.id ?? roles[0]?.id ?? "");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = () =>
    startTransition(async () => {
      const res = await saveUserAction(user?.id ?? null, { name, email, role, password: password || undefined });
      setErrors(res.errors ?? {});
      if (!res.ok) {
        setNotice({ ok: false, text: res.error ?? "Save failed." });
        return;
      }
      setPassword("");
      if (!user) {
        router.push("/admin/users");
      } else {
        setNotice({ ok: true, text: "User updated." });
      }
      router.refresh();
    });

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="max-w-2xl space-y-6"
    >
      <Notice state={notice} />
      <Card bodyClassName="space-y-5 p-6">
        <Row label="Name" error={errors.name}>
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} autoComplete="off" />
        </Row>
        <Row label="Email" error={errors.email}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} autoComplete="off" />
        </Row>
        <fieldset>
          <legend className="text-sm font-semibold">Role</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {roles.map((r) => {
              const locked = isSelf && !r.canManageUsers;
              return (
                <label
                  key={r.id}
                  className={`cursor-pointer rounded-lg border p-3 text-sm ${
                    role === r.id ? "border-admin-primary bg-admin-primary-soft" : "border-admin-border"
                  } ${locked ? "opacity-50" : ""}`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r.id}
                    checked={role === r.id}
                    disabled={locked}
                    onChange={() => setRole(r.id)}
                    className="sr-only"
                  />
                  <span className="block font-semibold">{r.name}</span>
                  <span className="mt-1 block text-xs text-admin-muted">{r.description}</span>
                </label>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-admin-muted">
            Need different access? <Link href="/admin/users/roles" className="font-medium text-admin-primary hover:underline">Create or edit roles</Link>.
          </p>
          {errors.role && <p className="mt-1 text-xs text-admin-danger">{errors.role}</p>}
        </fieldset>
        <Row
          label={user ? "New password" : "Password"}
          error={errors.password}
          help={user ? "Leave blank to keep the current password." : "At least 10 characters, with letters and numbers. Share it securely."}
        >
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} autoComplete="new-password" />
        </Row>
      </Card>
      <div className="flex items-center justify-between">
        {user && !isSelf ? (
          <button
            type="button"
            className={buttonClass.danger}
            disabled={pending}
            onClick={() => {
              if (!window.confirm(`Delete ${user.name}'s account?`)) return;
              startTransition(async () => {
                const res = await deleteUserAction(user.id);
                if (!res.ok) return setNotice({ ok: false, text: res.error ?? "Delete failed." });
                router.push("/admin/users");
                router.refresh();
              });
            }}
          >
            <Trash2 className="h-4 w-4" /> Delete user
          </button>
        ) : (
          <span />
        )}
        <button type="submit" className={buttonClass.primary} disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {user ? "Update user" : "Add user"}
        </button>
      </div>
    </form>
  );
}

export function ProfileForm({ user }: { user: PublicUser }) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      noValidate
      className="max-w-2xl space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const res = await updateProfileAction({ name, currentPassword, newPassword });
          setErrors(res.errors ?? {});
          setNotice(res.ok ? { ok: true, text: "Profile saved." } : { ok: false, text: res.error ?? "Please fix the highlighted fields." });
          if (res.ok) {
            setCurrentPassword("");
            setNewPassword("");
            router.refresh();
          }
        });
      }}
    >
      <Notice state={notice} />
      <Card title="Profile" bodyClassName="space-y-5 p-6">
        <Row label="Name" error={errors.name}>
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </Row>
        <Row label="Email" help="Ask an administrator to change your email.">
          <input value={user.email} readOnly className={`${inputClass} opacity-70`} />
        </Row>
      </Card>
      <Card title="Change password" bodyClassName="space-y-5 p-6">
        <Row label="Current password" error={errors.currentPassword}>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputClass} autoComplete="current-password" />
        </Row>
        <Row label="New password" error={errors.newPassword} help="Leave blank to keep your current password.">
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} autoComplete="new-password" />
        </Row>
      </Card>
      <div className="flex justify-end">
        <button type="submit" className={buttonClass.primary} disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save profile
        </button>
      </div>
    </form>
  );
}
