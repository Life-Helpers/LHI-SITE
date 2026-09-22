"use client";

import { useRef, useState } from "react";
import {
  AlertTriangle,
  Archive,
  CheckCircle2,
  Clock,
  Database,
  Download,
  FileCode,
  FileSpreadsheet,
  FileText,
  History,
  RefreshCw,
  Search,
  Shield,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type {
  AdminAuditLog,
  AdminBackupData,
  AdminBlogPost,
  AdminNotification,
  CrmContact,
} from "@/types/admin";
import {
  exportAuditLogs,
  exportBlogPosts,
  exportCrmContacts,
  generateFullBackup,
} from "@/lib/admin-data";

interface AdminBackupAuditProps {
  contacts: CrmContact[];
  posts: AdminBlogPost[];
  notifications: AdminNotification[];
  auditLogs: AdminAuditLog[];
  currentUser: string;
  onRestoreBackup: (backup: AdminBackupData) => void;
  onLogAudit: (action: string, target: string, category: "Export & Backup" | "Security") => void;
  onResetDemoData: () => void;
}

export function AdminBackupAudit({
  contacts,
  posts,
  notifications,
  auditLogs,
  currentUser,
  onRestoreBackup,
  onLogAudit,
  onResetDemoData,
}: AdminBackupAuditProps) {
  const [searchLog, setSearchLog] = useState("");
  const [selectedLogCategory, setSelectedLogCategory] = useState<string>("All");
  const [restorePreview, setRestorePreview] = useState<AdminBackupData | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredLogs = auditLogs.filter((log) => {
    if (selectedLogCategory !== "All" && log.category !== selectedLogCategory) return false;
    if (searchLog.trim()) {
      const q = searchLog.toLowerCase();
      const matchAction = log.action.toLowerCase().includes(q);
      const matchTarget = log.target.toLowerCase().includes(q);
      const matchUser = log.userEmail.toLowerCase().includes(q);
      const matchDetails = (log.details || "").toLowerCase().includes(q);
      return matchAction || matchTarget || matchUser || matchDetails;
    }
    return true;
  });

  function handleFullBackup() {
    generateFullBackup(contacts, posts, notifications, auditLogs, currentUser);
    onLogAudit("Generated Complete System Backup", "Full Archive (JSON)", "Export & Backup");
  }

  function handleExportContacts(format: "csv" | "json") {
    exportCrmContacts(contacts, format);
    onLogAudit(`Exported CRM Contacts (${format.toUpperCase()})`, `${contacts.length} records`, "Export & Backup");
  }

  function handleExportPosts(format: "csv" | "json") {
    exportBlogPosts(posts, format);
    onLogAudit(`Exported Blog Posts (${format.toUpperCase()})`, `${posts.length} articles`, "Export & Backup");
  }

  function handleExportLogs(format: "csv" | "json") {
    exportAuditLogs(auditLogs, format);
    onLogAudit(`Exported Audit Log (${format.toUpperCase()})`, `${auditLogs.length} entries`, "Export & Backup");
  }

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    setRestoreError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text) as AdminBackupData;

        if (!parsed.data || !Array.isArray(parsed.data.contacts) || !Array.isArray(parsed.data.posts)) {
          throw new Error("Invalid backup structure: Missing 'contacts' or 'posts' data arrays.");
        }

        setRestorePreview(parsed);
      } catch (err: unknown) {
        setRestoreError(
          err instanceof Error
            ? `Failed to read backup file: ${err.message}`
            : "Unknown parsing error reading backup file."
        );
        setRestorePreview(null);
      }
    };
    reader.readAsText(file);
  }

  function handleConfirmRestore() {
    if (!restorePreview) return;
    onRestoreBackup(restorePreview);
    onLogAudit(
      "Restored System Backup",
      `Archive dated ${restorePreview.exportedAt} (${restorePreview.contactsCount} contacts, ${restorePreview.postsCount} posts)`,
      "Export & Backup"
    );
    setRestorePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="space-y-6">
      {/* Backup & Export Hub */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xl">Local Backups & Data Portability</CardTitle>
              <CardDescription>
                Export immutable archives for regulatory auditing, donor reporting, and disaster recovery
              </CardDescription>
            </div>

            <Button
              onClick={handleFullBackup}
              size="sm"
              className="gap-2 bg-primary font-semibold text-primary-foreground"
            >
              <Archive className="h-4 w-4" />
              Download Full System Backup (JSON)
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Quick Export Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* CRM Contacts Export Card */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">CRM Contacts Directory</h4>
                  <p className="text-[11px] text-muted-foreground">{contacts.length} constituent records</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Donors, institutional partners, grant officers, and field volunteers with giving totals and notes.
              </p>
              <div className="flex gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportContacts("csv")}
                  className="flex-1 text-xs gap-1"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportContacts("json")}
                  className="flex-1 text-xs gap-1"
                >
                  <FileCode className="h-3.5 w-3.5 text-blue-600" />
                  JSON
                </Button>
              </div>
            </div>

            {/* Blog & CMS Export Card */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Field Blog & CMS Posts</h4>
                  <p className="text-[11px] text-muted-foreground">{posts.length} authored articles</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Humanitarian dispatches, nutrition research, tags, read times, and editorial publication history.
              </p>
              <div className="flex gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportPosts("csv")}
                  className="flex-1 text-xs gap-1"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportPosts("json")}
                  className="flex-1 text-xs gap-1"
                >
                  <FileCode className="h-3.5 w-3.5 text-blue-600" />
                  JSON
                </Button>
              </div>
            </div>

            {/* Audit Trail Export Card */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Administrative Audit Trail</h4>
                  <p className="text-[11px] text-muted-foreground">{auditLogs.length} recorded events</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Official compliance log of user logins, approvals, data exports, and governance actions.
              </p>
              <div className="flex gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportLogs("csv")}
                  className="flex-1 text-xs gap-1"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportLogs("json")}
                  className="flex-1 text-xs gap-1"
                >
                  <FileCode className="h-3.5 w-3.5 text-blue-600" />
                  JSON
                </Button>
              </div>
            </div>
          </div>

          {/* Import / Restore Backup Panel */}
          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Upload className="h-4 w-4 text-primary" />
                  Restore / Import System Backup (JSON)
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Load a previously exported JSON backup file to restore contacts, articles, and notifications
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json,application/json"
                  onChange={handleFileSelected}
                  className="hidden"
                  id="backup-file-upload"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-1.5 text-xs"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Select Backup File
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onResetDemoData}
                  className="text-xs text-muted-foreground hover:text-destructive"
                  title="Reset to initial demo data"
                >
                  <RefreshCw className="mr-1 h-3.5 w-3.5" />
                  Reset to Defaults
                </Button>
              </div>
            </div>

            {restoreError && (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{restoreError}</span>
              </div>
            )}

            {restorePreview && (
              <div className="mt-4 rounded-xl border border-primary/30 bg-card p-4 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Valid Backup Archive Identified
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Exported: {restorePreview.exportedAt}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                  <div className="rounded-lg bg-muted/40 p-2 text-center">
                    <span className="text-[11px] text-muted-foreground block">Contacts</span>
                    <span className="font-bold text-foreground">
                      {restorePreview.data.contacts.length} records
                    </span>
                  </div>
                  <div className="rounded-lg bg-muted/40 p-2 text-center">
                    <span className="text-[11px] text-muted-foreground block">Blog Posts</span>
                    <span className="font-bold text-foreground">{restorePreview.data.posts.length} articles</span>
                  </div>
                  <div className="rounded-lg bg-muted/40 p-2 text-center">
                    <span className="text-[11px] text-muted-foreground block">Notifications</span>
                    <span className="font-bold text-foreground">
                      {restorePreview.data.notifications.length} alerts
                    </span>
                  </div>
                  <div className="rounded-lg bg-muted/40 p-2 text-center">
                    <span className="text-[11px] text-muted-foreground block">Audit Logs</span>
                    <span className="font-bold text-foreground">
                      {restorePreview.data.auditLogs.length} entries
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setRestorePreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleConfirmRestore}
                    className="bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    Confirm & Restore Archive
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Administrative Audit Trail */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <History className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-lg">Governance & Audit Trail</CardTitle>
                <CardDescription>
                  Immutable tracking of administrative actions, data exports, disbursements, and account changes
                </CardDescription>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportLogs("csv")}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              <Download className="h-3.5 w-3.5" />
              Export Audit Log (CSV)
            </Button>
          </div>

          {/* Filter & Search */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search audit trail by user, action, target, or details..."
                value={searchLog}
                onChange={(e) => setSearchLog(e.target.value)}
                className="pl-9 text-xs h-9"
              />
            </div>

            <select
              value={selectedLogCategory}
              onChange={(e) => setSelectedLogCategory(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary sm:w-48"
            >
              <option value="All">All Categories ({auditLogs.length})</option>
              <option value="Export & Backup">Export & Backup</option>
              <option value="Approval">Approval</option>
              <option value="Donation">Donation</option>
              <option value="CMS">CMS</option>
              <option value="CRM">CRM</option>
              <option value="User">User</option>
              <option value="Security">Security</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground uppercase font-semibold text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Administrator</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Target / Resource</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono text-[11px]">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground font-sans text-xs">
                      No audit events matching current criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {log.timestamp}
                        </span>
                      </td>

                      <td className="px-4 py-2.5 text-foreground font-sans font-medium whitespace-nowrap">
                        {log.userEmail}
                      </td>

                      <td className="px-4 py-2.5 font-sans font-semibold text-foreground">
                        {log.action}
                      </td>

                      <td className="px-4 py-2.5 text-muted-foreground font-sans">{log.target}</td>

                      <td className="px-4 py-2.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-sans font-semibold ${
                            log.category === "Export & Backup"
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                              : log.category === "Approval"
                              ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                              : log.category === "Donation"
                              ? "bg-blue-500/15 text-blue-700 dark:text-blue-300"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {log.category}
                        </span>
                      </td>

                      <td className="px-4 py-2.5 text-muted-foreground font-sans max-w-xs truncate">
                        {log.details || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
