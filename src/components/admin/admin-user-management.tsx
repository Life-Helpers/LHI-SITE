"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Key,
  Search,
  Shield,
  ShieldCheck,
  UserPlus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type AdminUser, type AuditLog } from "@/lib/cms-crm-store";

export function AdminUserManagementSection({
  users,
  auditLogs,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
}: {
  users: AdminUser[];
  auditLogs: AuditLog[];
  onAddUser: (user: AdminUser) => void;
  onUpdateUser: (user: AdminUser) => void;
  onDeleteUser: (id: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [resetKeyAlert, setResetKeyAlert] = useState<{ name: string; key: string } | null>(null);

  // Add user state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AdminUser["role"]>("Field Officer");
  const [department, setDepartment] = useState("Programs & Field Operations");
  const [state, setState] = useState("Sokoto HQ");
  const [status] = useState<AdminUser["status"]>("Active");

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newUser: AdminUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      department,
      state,
      status,
      lastLogin: "Never",
      createdAt: new Date().toISOString().split("T")[0],
    };

    onAddUser(newUser);
    setIsAddModalOpen(false);
    setName("");
    setEmail("");
  }

  function handleToggleStatus(user: AdminUser) {
    const nextStatus: AdminUser["status"] = user.status === "Active" ? "Suspended" : "Active";
    onUpdateUser({
      ...user,
      status: nextStatus,
    });
  }

  function handleResetPassword(user: AdminUser) {
    const tempKey = `LHI-${Math.random().toString(36).slice(-8).toUpperCase()}-2026`;
    setResetKeyAlert({ name: user.name, key: tempKey });
  }

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            Admin User & Access Governance
          </h2>
          <p className="text-xs text-muted-foreground">
            Provision staff credentials, designate role-based access levels (RBAC), and review security audit logs.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          size="sm"
          className="text-xs gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Provision New User
        </Button>
      </div>

      {/* Password Reset Alert Banner */}
      {resetKeyAlert && (
        <div className="flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>
              Temporary access key generated for <strong>{resetKeyAlert.name}</strong>:{" "}
              <code className="rounded bg-black/10 dark:bg-white/10 px-2 py-0.5 font-mono font-bold">
                {resetKeyAlert.key}
              </code>
            </span>
          </div>
          <button
            onClick={() => setResetKeyAlert(null)}
            className="rounded p-1 hover:bg-emerald-500/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search staff accounts by name, email, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-xs text-muted-foreground"
          >
            <option value="All">All Roles</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Senior Editor">Senior Editor</option>
            <option value="CRM Coordinator">CRM Coordinator</option>
            <option value="Field Officer">Field Officer</option>
            <option value="Auditor">Auditor</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Staff Member</th>
                <th className="px-4 py-3">Role & Scope</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Last Active</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-foreground">{user.name}</div>
                    <div className="text-[11px] text-muted-foreground">{user.email}</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        user.role === "Super Admin"
                          ? "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                          : user.role === "Senior Editor"
                          ? "bg-blue-500/15 text-blue-700 dark:text-blue-300"
                          : user.role === "CRM Coordinator"
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Shield className="h-3 w-3" />
                      {user.role}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="text-foreground">{user.department}</div>
                    <div className="text-[10px] text-muted-foreground">{user.state}</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        user.status === "Active"
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                          : "bg-destructive/15 text-destructive"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-muted-foreground">
                    {user.lastLogin}
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleResetPassword(user)}
                        title="Generate temporary password"
                        className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                      >
                        <Key className="h-3 w-3" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(user)}
                        className={`h-7 px-2 text-xs font-semibold ${
                          user.status === "Active"
                            ? "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                            : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                        }`}
                      >
                        {user.status === "Active" ? "Suspend" : "Activate"}
                      </Button>

                      {user.role !== "Super Admin" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm(`Remove user account for ${user.name}?`)) {
                              onDeleteUser(user.id);
                            }
                          }}
                          className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10"
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Audit Trail */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Security & Administration Audit Trail
          </CardTitle>
          <CardDescription className="text-xs">
            Immutable log of backend data modifications and administrative events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-3.5 py-2 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground">{log.action}:</span>{" "}
                    <span className="text-muted-foreground">{log.target}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span>{log.userEmail}</span>
                  <span>·</span>
                  <span className="font-mono">{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* PROVISION USER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold text-foreground">Provision Staff Account</h3>
            <p className="text-xs text-muted-foreground">Create secure administrative credentials with scoped permissions.</p>

            <form onSubmit={handleCreateUser} className="mt-4 space-y-3">
              <div>
                <Label className="text-xs">Full Name *</Label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Zainab Lawal"
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs">Official Email Address *</Label>
                <Input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="z.lawal@lifehelpersinitiative.org"
                  className="mt-1 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Role</Label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as AdminUser["role"])}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Senior Editor">Senior Editor</option>
                    <option value="CRM Coordinator">CRM Coordinator</option>
                    <option value="Field Officer">Field Officer</option>
                    <option value="Auditor">Auditor</option>
                  </select>
                </div>

                <div>
                  <Label className="text-xs">State / Base</Label>
                  <Input
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Sokoto HQ"
                    className="mt-1 text-xs"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs">Department</Label>
                <Input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. WASH & Infrastructure"
                  className="mt-1 text-xs"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Create & Issue Key
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
