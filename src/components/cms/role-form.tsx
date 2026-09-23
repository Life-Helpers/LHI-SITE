"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Save, Trash2 } from "lucide-react";

import { deleteRoleAction, saveRoleAction } from "@/app/admin/actions";
import { buttonClass, Card, inputClass } from "@/components/cms/ui";
import { PERMISSION_GROUPS, type CmsRole, type Permission } from "@/lib/cms/schema";

export function RoleForm({ role, userCount = 0 }: { role?: CmsRole; userCount?: number }) {
  const router = useRouter();
  const locked = role?.id === "administrator";
  const [name, setName] = useState(role?.name ?? "");
  const [description, setDescription] = useState(role?.description ?? "");
  const [permissions, setPermissions] = useState<Permission[]>(role?.permissions ?? []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const toggle = (p: Permission) => setPermissions((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));
  const toggleGroup = (ids: Permission[], on: boolean) =>
    setPermissions((cur) => (on ? Array.from(new Set([...cur, ...ids])) : cur.filter((p) => !ids.includes(p))));

  const save = () =>
    startTransition(async () => {
      const res = await saveRoleAction(role?.id ?? null, { name, description, permissions });
      setErrors(res.errors ?? {});
      if (!res.ok) return setNotice({ ok: false, text: res.error ?? "Save failed." });
      if (!role) router.push("/admin/users/roles");
      else setNotice({ ok: true, text: "Role saved. Changes apply to its users immediately." });
      router.refresh();
    });

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="max-w-4xl space-y-6"
    >
      {notice && (
        <p
          role={notice.ok ? "status" : "alert"}
          className={`rounded-lg px-4 py-3 text-sm ${notice.ok ? "bg-admin-success-soft text-admin-success" : "bg-admin-danger-soft text-admin-danger"}`}
        >
          {notice.text}
        </p>
      )}
      {locked && (
        <p className="flex items-center gap-2 rounded-lg bg-admin-bg px-4 py-3 text-sm text-admin-muted">
          <Lock className="h-4 w-4" /> The Administrator role always has every permission and can&apos;t be edited.
        </p>
      )}
      <Card bodyClassName="grid gap-5 p-6 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          Role name
          <input value={name} onChange={(e) => setName(e.target.value)} disabled={locked} maxLength={60} className={`${inputClass} mt-1.5`} placeholder="e.g. Communications Officer" />
          {errors.name && <span className="mt-1 block text-xs text-admin-danger">{errors.name}</span>}
        </label>
        <label className="block text-sm font-semibold">
          Description
          <input value={description} onChange={(e) => setDescription(e.target.value)} disabled={locked} maxLength={200} className={`${inputClass} mt-1.5`} placeholder="What this role is for" />
        </label>
      </Card>

      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-admin-muted">Permissions</h2>
          <span className="text-xs text-admin-muted">
            {locked ? "All" : permissions.length} selected{userCount ? ` · ${userCount} user${userCount > 1 ? "s" : ""} with this role` : ""}
          </span>
        </div>
        {errors.permissions && <p className="text-xs text-admin-danger">{errors.permissions}</p>}
        {PERMISSION_GROUPS.map((group) => {
          const ids = group.items.map((i) => i.id) as Permission[];
          const all = locked || ids.every((p) => permissions.includes(p));
          return (
            <Card
              key={group.label}
              title={group.label}
              action={
                !locked && (
                  <button type="button" onClick={() => toggleGroup(ids, !all)} className="text-xs font-semibold text-admin-primary hover:underline">
                    {all ? "Clear all" : "Select all"}
                  </button>
                )
              }
              bodyClassName="grid gap-2 p-4 sm:grid-cols-2"
            >
              {group.items.map((item) => {
                const on = locked || permissions.includes(item.id);
                return (
                  <label
                    key={item.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm ${on ? "border-admin-primary bg-admin-primary-soft" : "border-admin-border"} ${locked ? "cursor-default" : ""}`}
                  >
                    <input type="checkbox" checked={on} disabled={locked} onChange={() => toggle(item.id)} className="mt-0.5 h-4 w-4 accent-[var(--a-primary)]" />
                    <span>
                      <span className="block font-semibold">{item.label}</span>
                      <span className="block text-xs text-admin-muted">{item.help}</span>
                    </span>
                  </label>
                );
              })}
            </Card>
          );
        })}
      </div>

      {!locked && (
        <div className="flex items-center justify-between">
          {role && !role.builtIn ? (
            <button
              type="button"
              className={buttonClass.danger}
              disabled={pending}
              onClick={() => {
                if (!window.confirm(`Delete the ${role.name} role?`)) return;
                startTransition(async () => {
                  const res = await deleteRoleAction(role.id);
                  if (!res.ok) return setNotice({ ok: false, text: res.error ?? "Delete failed." });
                  router.push("/admin/users/roles");
                  router.refresh();
                });
              }}
            >
              <Trash2 className="h-4 w-4" /> Delete role
            </button>
          ) : (
            <span />
          )}
          <button type="submit" className={buttonClass.primary} disabled={pending}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {role ? "Save role" : "Create role"}
          </button>
        </div>
      )}
    </form>
  );
}
