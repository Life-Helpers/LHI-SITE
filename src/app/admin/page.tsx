"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Archive,
  ArrowLeft,
  Bell,
  BookOpen,
  Database,
  LayoutDashboard,
  LogOut,
  Radio,
  Shield,
  Volume2,
  VolumeX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import type {
  AdminAuditLog,
  AdminBackupData,
  AdminBlogPost,
  AdminNotification,
  ContactLifecycleStatus,
  CrmContact,
  NotificationCategory,
} from "@/types/admin";
import {
  initialAuditLogs,
  initialBlogPosts,
  initialCrmContacts,
  initialNotifications,
  playNotificationChime,
} from "@/lib/admin-data";
import { AdminOverview } from "@/components/admin/admin-overview";
import { AdminNotificationsCenter } from "@/components/admin/admin-notifications";
import { AdminCrmContacts } from "@/components/admin/admin-crm-contacts";
import { AdminCmsPosts } from "@/components/admin/admin-cms-posts";
import { AdminBackupAudit } from "@/components/admin/admin-backup-audit";
import { AdminNotificationToast } from "@/components/admin/admin-notification-toast";

type AdminTab = "overview" | "notifications" | "crm" | "cms" | "backups";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [currentUser, setCurrentUser] = useState<string>("admin@lhinigeria.org");
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  // Core Data States
  const [contacts, setContacts] = useState<CrmContact[]>(initialCrmContacts);
  const [posts, setPosts] = useState<AdminBlogPost[]>(initialBlogPosts);
  const [notifications, setNotifications] = useState<AdminNotification[]>(initialNotifications);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(initialAuditLogs);

  // Real-Time Notification & Audio Stream State
  const [isStreamActive, setIsStreamActive] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeToast, setActiveToast] = useState<AdminNotification | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = sessionStorage.getItem("lhi_admin_user");
      if (storedUser) {
        setCurrentUser(storedUser);
      }

      try {
        const localContacts = localStorage.getItem("lhi_admin_contacts");
        if (localContacts) setContacts(JSON.parse(localContacts));

        const localPosts = localStorage.getItem("lhi_admin_posts");
        if (localPosts) setPosts(JSON.parse(localPosts));

        const localNotifs = localStorage.getItem("lhi_admin_notifications");
        if (localNotifs) setNotifications(JSON.parse(localNotifs));

        const localLogs = localStorage.getItem("lhi_admin_audit_logs");
        if (localLogs) setAuditLogs(JSON.parse(localLogs));
      } catch (err) {
        console.error("Failed loading admin cache", err);
      }

      setIsLoaded(true);
    }
  }, []);

  // Save changes to localStorage
  const persistContacts = (updated: CrmContact[]) => {
    setContacts(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("lhi_admin_contacts", JSON.stringify(updated));
    }
  };

  const persistPosts = (updated: AdminBlogPost[]) => {
    setPosts(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("lhi_admin_posts", JSON.stringify(updated));
    }
  };

  const persistNotifications = (updated: AdminNotification[]) => {
    setNotifications(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("lhi_admin_notifications", JSON.stringify(updated));
    }
  };

  const persistAuditLogs = useCallback((updated: AdminAuditLog[]) => {
    setAuditLogs(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("lhi_admin_audit_logs", JSON.stringify(updated));
    }
  }, []);

  const logAuditEvent = useCallback((
    action: string,
    target: string,
    category: AdminAuditLog["category"],
    details?: string
  ) => {
    const newLog: AdminAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      userEmail: currentUser,
      action,
      target,
      category,
      details,
    };
    setAuditLogs((prev) => {
      const updated = [newLog, ...prev];
      persistAuditLogs(updated);
      return updated;
    });
  }, [currentUser, persistAuditLogs]);

  // Handle Incoming New Alert Event
  const pushNewAlert = useCallback((newNotif: AdminNotification) => {
    setNotifications((prev) => {
      const updated = [newNotif, ...prev];
      if (typeof window !== "undefined") {
        localStorage.setItem("lhi_admin_notifications", JSON.stringify(updated));
      }
      return updated;
    });

    setActiveToast(newNotif);

    if (soundEnabled) {
      playNotificationChime();
    }
  }, [soundEnabled]);

  // Simulate Incoming Real-Time Events
  const triggerSimulation = useCallback((forcedCategory?: NotificationCategory) => {
    const sampleEvents: AdminNotification[] = [
      {
        id: `notif-${Date.now()}`,
        title: "New Online Contribution Logged",
        message: "₦85,000 received via Stripe from Dr. Ibrahim Waziri for NIDAKE sanitary hygiene kits in Kebbi.",
        category: "donation",
        priority: "normal",
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        read: false,
        actionRequired: true,
        actionType: "review_donation",
        metadata: {
          donorName: "Dr. Ibrahim Waziri",
          amount: "85,000",
          currency: "NGN",
          receiptNumber: `LHI-DN-${Math.floor(1000 + Math.random() * 9000)}`,
          state: "Kebbi",
        },
      },
      {
        id: `notif-${Date.now()}`,
        title: "Public Aid Referral Received",
        message: "Bama Community Clinic submitted request for emergency nutritional therapeutic supplies (40 sachets).",
        category: "inquiry",
        priority: "urgent",
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        read: false,
        actionRequired: true,
        actionType: "reply_inquiry",
        metadata: {
          senderName: "Bama Clinic Desk",
          senderEmail: "referrals@bama-clinic.org.ng",
          state: "Borno",
        },
      },
      {
        id: `notif-${Date.now()}`,
        title: "Disbursement Voucher Awaiting Sign-Off",
        message: "Field Coordinator submitted voucher #DISB-2026-62: ₦950,000 for emergency grain storage repairs.",
        category: "approval",
        priority: "urgent",
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        read: false,
        actionRequired: true,
        actionType: "approve_disbursement",
        metadata: {
          amount: "950,000",
          currency: "NGN",
          state: "Sokoto",
          taskTitle: "Grain Storage Voucher #DISB-2026-62",
        },
      },
      {
        id: `notif-${Date.now()}`,
        title: "Institutional Grant Inflow (USD)",
        message: "$1,200.00 USD received from Global Health Impact Fund earmarked for Maternal Nutrition.",
        category: "donation",
        priority: "normal",
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        read: false,
        actionRequired: false,
        metadata: {
          donorName: "Global Health Impact Fund",
          amount: "1,200.00",
          currency: "USD",
          receiptNumber: `LHI-INT-${Math.floor(1000 + Math.random() * 9000)}`,
        },
      },
    ];

    let chosen = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
    if (forcedCategory) {
      const match = sampleEvents.find((e) => e.category === forcedCategory);
      if (match) chosen = match;
    }

    pushNewAlert(chosen);
  }, [pushNewAlert]);

  // Periodic simulated live stream if active
  useEffect(() => {
    if (!isStreamActive) return;

    // Trigger an incoming event every 45 seconds for a lively realistic simulation
    const interval = setInterval(() => {
      triggerSimulation();
    }, 45000);

    return () => clearInterval(interval);
  }, [isStreamActive, triggerSimulation]);

  // Notification Actions
  function handleMarkAsRead(id: string) {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    persistNotifications(updated);
  }

  function handleMarkAllAsRead() {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    persistNotifications(updated);
    logAuditEvent("Marked All Notifications as Read", `${notifications.length} alerts`, "Security");
  }

  function handleDeleteNotification(id: string) {
    const updated = notifications.filter((n) => n.id !== id);
    persistNotifications(updated);
  }

  function handleClearRead() {
    const updated = notifications.filter((n) => !n.read);
    persistNotifications(updated);
  }

  function handleApproveTask(id: string, taskTitle: string) {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true, actionRequired: false, title: `Approved: ${n.title}` } : n
    );
    persistNotifications(updated);
    logAuditEvent("Approved Operational Task", taskTitle, "Approval", `Authorized by ${currentUser}`);
  }

  // CRM Actions
  function handleAddContact(newContact: CrmContact) {
    const updated = [newContact, ...contacts];
    persistContacts(updated);
  }

  function handleUpdateContactStatus(id: string, status: ContactLifecycleStatus) {
    const updated = contacts.map((c) => (c.id === id ? { ...c, status } : c));
    persistContacts(updated);
  }

  function handleDeleteContact(id: string) {
    const target = contacts.find((c) => c.id === id)?.fullName || id;
    const updated = contacts.filter((c) => c.id !== id);
    persistContacts(updated);
    logAuditEvent("Deleted CRM Contact", target, "CRM");
  }

  // CMS Actions
  function handleAddPost(newPost: AdminBlogPost) {
    const updated = [newPost, ...posts];
    persistPosts(updated);
  }

  function handleUpdatePost(updatedPost: AdminBlogPost) {
    const updated = posts.map((p) => (p.id === updatedPost.id ? updatedPost : p));
    persistPosts(updated);
  }

  function handleDeletePost(id: string) {
    const target = posts.find((p) => p.id === id)?.title || id;
    const updated = posts.filter((p) => p.id !== id);
    persistPosts(updated);
    logAuditEvent("Deleted Blog Article", target, "CMS");
  }

  // Backup & Restore
  function handleRestoreBackup(backup: AdminBackupData) {
    if (backup.data.contacts) persistContacts(backup.data.contacts);
    if (backup.data.posts) persistPosts(backup.data.posts);
    if (backup.data.notifications) persistNotifications(backup.data.notifications);
    if (backup.data.auditLogs) persistAuditLogs(backup.data.auditLogs);
  }

  function handleResetDemoData() {
    persistContacts(initialCrmContacts);
    persistPosts(initialBlogPosts);
    persistNotifications(initialNotifications);
    persistAuditLogs(initialAuditLogs);
    logAuditEvent("Reset All Data to System Defaults", "All collections", "Security");
  }

  function handleSignOut() {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("lhi_admin_authenticated");
      sessionStorage.removeItem("lhi_admin_user");
    }
    startTransition(() => {
      router.push("/admin/login");
    });
  }

  const handleDismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  const handleViewToast = useCallback(() => {
    setActiveToast(null);
    setActiveTab("notifications");
  }, []);

  if (!isLoaded) {
    return (
      <main className="flex flex-1 items-center justify-center py-20 text-muted-foreground">
        Loading Life Helpers Initiative administrative workspace…
      </main>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <main id="main-content" tabIndex={-1} className="flex-1 bg-muted/10 min-h-screen">
      {/* Toast popup for live notifications */}
      <AdminNotificationToast
        notification={activeToast}
        onDismiss={handleDismissToast}
        onView={handleViewToast}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Shield className="h-3.5 w-3.5" aria-hidden="true" />
                Executive Directorate Console
              </span>

              {isStreamActive && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <Radio className="h-3 w-3 animate-pulse" />
                  Live Inflow Connected
                </span>
              )}

              <span className="text-xs text-muted-foreground">
                Logged in: <strong className="text-foreground">{currentUser}</strong>
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {siteConfig.name} Coordination Portal
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Integrated CRM constituent directory, field research CMS, real-time donor telemetry, and local backup auditing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick Notification Bell in Header */}
            <Button
              variant={activeTab === "notifications" ? "primary" : "outline"}
              size="sm"
              onClick={() => setActiveTab("notifications")}
              className="relative h-9 gap-1.5 text-xs"
              title="View live notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Alerts</span>
              {unreadCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                  {unreadCount}
                </span>
              )}
            </Button>

            {/* Audio Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled((prev) => !prev)}
              className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground"
              title={soundEnabled ? "Audio chimes enabled" : "Audio chimes muted"}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4 text-primary" /> : <VolumeX className="h-4 w-4" />}
            </Button>

            {/* Public Site Link */}
            <Button asChild variant="outline" size="sm" className="h-9 text-xs">
              <Link href="/">
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                Public Site
              </Link>
            </Button>

            {/* Sign Out */}
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="h-9 text-xs text-destructive hover:bg-destructive/10 border-destructive/30"
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex overflow-x-auto rounded-xl border border-border bg-card p-1.5 shadow-xs gap-1 text-xs">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Executive Overview
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === "notifications"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            }`}
          >
            <Bell className="h-4 w-4" />
            Live Notifications
            {unreadCount > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  activeTab === "notifications"
                    ? "bg-white text-primary"
                    : "bg-destructive text-destructive-foreground"
                }`}
              >
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("crm")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === "crm"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            }`}
          >
            <Database className="h-4 w-4" />
            CRM Constituents ({contacts.length})
          </button>

          <button
            onClick={() => setActiveTab("cms")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === "cms"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Field Blog CMS ({posts.length})
          </button>

          <button
            onClick={() => setActiveTab("backups")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === "backups"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            }`}
          >
            <Archive className="h-4 w-4" />
            Data Backups & Auditing
          </button>
        </div>

        {/* Tab Content Display */}
        {activeTab === "overview" && (
          <AdminOverview
            contacts={contacts}
            posts={posts}
            notifications={notifications}
            auditLogs={auditLogs}
            currentUser={currentUser}
            onNavigateTab={(tab) => setActiveTab(tab as AdminTab)}
            onApproveTask={handleApproveTask}
            onLogAudit={logAuditEvent}
          />
        )}

        {activeTab === "notifications" && (
          <AdminNotificationsCenter
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onDeleteNotification={handleDeleteNotification}
            onClearRead={handleClearRead}
            onApproveTask={handleApproveTask}
            onTriggerSimulation={triggerSimulation}
            isStreamActive={isStreamActive}
            onToggleStream={() => setIsStreamActive((prev) => !prev)}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled((prev) => !prev)}
          />
        )}

        {activeTab === "crm" && (
          <AdminCrmContacts
            contacts={contacts}
            onAddContact={handleAddContact}
            onUpdateContactStatus={handleUpdateContactStatus}
            onDeleteContact={handleDeleteContact}
            onLogAudit={logAuditEvent}
          />
        )}

        {activeTab === "cms" && (
          <AdminCmsPosts
            posts={posts}
            onAddPost={handleAddPost}
            onUpdatePost={handleUpdatePost}
            onDeletePost={handleDeletePost}
            onLogAudit={logAuditEvent}
          />
        )}

        {activeTab === "backups" && (
          <AdminBackupAudit
            contacts={contacts}
            posts={posts}
            notifications={notifications}
            auditLogs={auditLogs}
            currentUser={currentUser}
            onRestoreBackup={handleRestoreBackup}
            onLogAudit={logAuditEvent}
            onResetDemoData={handleResetDemoData}
          />
        )}
      </div>
    </main>
  );
}
