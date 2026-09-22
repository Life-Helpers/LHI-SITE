"use client";

import Link from "next/link";
import {
  AlertCircle,
  Archive,
  ArrowRight,
  BookOpen,
  Check,
  DollarSign,
  Download,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Radio,
  Shield,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  AdminAuditLog,
  AdminBlogPost,
  AdminNotification,
  CrmContact,
} from "@/types/admin";
import { exportBlogPosts, exportCrmContacts, generateFullBackup } from "@/lib/admin-data";

interface AdminOverviewProps {
  contacts: CrmContact[];
  posts: AdminBlogPost[];
  notifications: AdminNotification[];
  auditLogs: AdminAuditLog[];
  currentUser: string;
  onNavigateTab: (tab: string) => void;
  onApproveTask: (id: string, taskTitle: string) => void;
  onLogAudit: (action: string, target: string, category: "Export & Backup" | "Approval") => void;
}

export function AdminOverview({
  contacts,
  posts,
  notifications,
  auditLogs,
  currentUser,
  onNavigateTab,
  onApproveTask,
  onLogAudit,
}: AdminOverviewProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;
  const pendingApprovals = notifications.filter((n) => n.category === "approval" && n.actionRequired);
  const totalRaisedNgn = contacts.reduce((sum, c) => sum + c.totalContributionsNgn, 0);
  const publishedPosts = posts.filter((p) => p.status === "Published");

  function handleQuickContactsCsv() {
    exportCrmContacts(contacts, "csv");
    onLogAudit("Quick Export CRM Contacts (CSV)", `${contacts.length} records`, "Export & Backup");
  }

  function handleQuickPostsJson() {
    exportBlogPosts(posts, "json");
    onLogAudit("Quick Export Blog Posts (JSON)", `${posts.length} articles`, "Export & Backup");
  }

  function handleFullBackup() {
    generateFullBackup(contacts, posts, notifications, auditLogs, currentUser);
    onLogAudit("Full System Backup Generated", "Complete JSON Archive", "Export & Backup");
  }

  return (
    <div className="space-y-8">
      {/* Pending Approvals Alert Banner if any exist */}
      {pendingApprovals.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Action Required: {pendingApprovals.length} Pending Operational Approvals
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Emergency relief disbursements and field dispatch sign-offs require directorate verification.
                </p>
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => onNavigateTab("notifications")}
              className="shrink-0 bg-amber-600 text-xs font-semibold text-white hover:bg-amber-700"
            >
              Review Approvals Queue →
            </Button>
          </div>
        </div>
      )}

      {/* Primary KPI Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Contributions (₦)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              ₦{totalRaisedNgn.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Donor contributions logged in CRM
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              CRM Constituents
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{contacts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across 11 operational state offices
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Field Blog Dispatches
            </CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{publishedPosts.length} Live</div>
            <p className="text-xs text-muted-foreground mt-1">
              {posts.length - publishedPosts.length} drafts in editorial review
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Real-Time Alert Feed
            </CardTitle>
            <span
              className={`flex h-2.5 w-2.5 rounded-full ${
                unreadCount > 0 ? "animate-ping bg-destructive" : "bg-emerald-500"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {unreadCount}{" "}
              <span className="text-xs font-normal text-muted-foreground">unread</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {notifications.length} total events tracked in live session
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Data Export Bar */}
      <Card className="border-border bg-muted/20">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Download className="h-4 w-4 text-primary" />
                Quick Local Backup & Auditing Exports
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Download formatted CSV spreadsheets or complete JSON snapshots directly to your machine.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleQuickContactsCsv}
                className="h-8 gap-1.5 text-xs font-semibold"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                Export Contacts (CSV)
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleQuickPostsJson}
                className="h-8 gap-1.5 text-xs font-semibold"
              >
                <FileText className="h-3.5 w-3.5 text-blue-600" />
                Export Blog Posts (JSON)
              </Button>

              <Button
                size="sm"
                onClick={handleFullBackup}
                className="h-8 gap-1.5 bg-primary text-xs font-semibold text-primary-foreground"
              >
                <Archive className="h-3.5 w-3.5" />
                Full System Backup
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2-Column Split: Latest Live Activity Stream & Operational Shortcuts */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Latest Activity Stream */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Real-Time Inflow Stream</CardTitle>
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  <Radio className="h-2.5 w-2.5 animate-pulse" /> Live Telemetry
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTab("notifications")}
                className="text-xs text-primary"
              >
                View all ({notifications.length}) →
              </Button>
            </div>
            <CardDescription>
              Incoming donations, public inquiries, and emergency field requests
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {notifications.slice(0, 4).map((n) => (
              <div
                key={n.id}
                className={`flex flex-col gap-2 rounded-xl border p-3 text-xs transition-colors ${
                  !n.read
                    ? "bg-card border-primary/30 ring-1 ring-primary/10"
                    : "bg-muted/20 border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                        n.category === "donation"
                          ? "bg-emerald-500/15 text-emerald-600"
                          : n.category === "approval"
                          ? "bg-amber-500/15 text-amber-600"
                          : "bg-blue-500/15 text-blue-600"
                      }`}
                    >
                      {n.category === "donation" && <DollarSign className="h-4 w-4" />}
                      {n.category === "approval" && <AlertCircle className="h-4 w-4" />}
                      {n.category === "inquiry" && <FileText className="h-4 w-4" />}
                    </div>

                    <div>
                      <span className="font-semibold text-foreground">{n.title}</span>
                      <p className="text-muted-foreground text-[11px] line-clamp-1 mt-0.5">
                        {n.message}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">
                    {n.timestamp.split(" ")[1] || n.timestamp}
                  </span>
                </div>

                {n.actionRequired && n.category === "approval" && (
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/60">
                    <Button
                      size="sm"
                      onClick={() => onApproveTask(n.id, n.metadata?.taskTitle || n.title)}
                      className="h-6 px-2.5 bg-emerald-600 text-[11px] text-white hover:bg-emerald-700"
                    >
                      <Check className="h-3 w-3 mr-1" /> Approve
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Administration Hub & Navigation Shortcuts */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Governance & Quick Navigation</CardTitle>
            <CardDescription>
              Direct shortcuts into constituent records, content publishing, and compliance
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            <div
              onClick={() => onNavigateTab("crm")}
              className="flex items-center justify-between rounded-xl border border-border p-3 hover:bg-muted/40 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    Constituent Directory (CRM)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {contacts.length} partners, donors, and field volunteers with CSV/JSON exports
                  </p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
            </div>

            <div
              onClick={() => onNavigateTab("cms")}
              className="flex items-center justify-between rounded-xl border border-border p-3 hover:bg-muted/40 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    Field Blog & Research CMS
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Author dispatches, schedule articles, and export knowledge base archives
                  </p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
            </div>

            <div
              onClick={() => onNavigateTab("backups")}
              className="flex items-center justify-between rounded-xl border border-border p-3 hover:bg-muted/40 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    Audit Trail & Backup Center
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {auditLogs.length} logged events; JSON backup download & system restore
                  </p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border p-3 hover:bg-muted/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ExternalLink className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Live Public Site</p>
                  <p className="text-xs text-muted-foreground">
                    View public blog, emergency register, and donation funnel
                  </p>
                </div>
              </div>
              <Button asChild size="sm" variant="outline" className="h-7 text-xs">
                <Link href="/" target="_blank">
                  Visit Site
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
