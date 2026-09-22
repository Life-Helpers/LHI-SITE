"use client";

import { useState } from "react";
import {
  AlertCircle,
  Bell,
  Check,
  CheckCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  Flame,
  HelpCircle,
  Mail,
  PlusCircle,
  Radio,
  Search,
  Trash2,
  Volume2,
  VolumeX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { AdminNotification, NotificationCategory } from "@/types/admin";
import { playNotificationChime } from "@/lib/admin-data";

interface AdminNotificationsProps {
  notifications: AdminNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onClearRead: () => void;
  onApproveTask: (id: string, taskTitle: string) => void;
  onTriggerSimulation: (type?: NotificationCategory) => void;
  isStreamActive: boolean;
  onToggleStream: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function AdminNotificationsCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onClearRead,
  onApproveTask,
  onTriggerSimulation,
  isStreamActive,
  onToggleStream,
  soundEnabled,
  onToggleSound,
}: AdminNotificationsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const donationsCount = notifications.filter((n) => n.category === "donation").length;
  const inquiriesCount = notifications.filter((n) => n.category === "inquiry").length;
  const approvalsCount = notifications.filter((n) => n.category === "approval").length;

  const filteredNotifications = notifications.filter((n) => {
    if (filterUnreadOnly && n.read) return false;
    if (selectedCategory !== "all" && n.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = n.title.toLowerCase().includes(q);
      const matchMsg = n.message.toLowerCase().includes(q);
      const matchSender = n.metadata?.senderName?.toLowerCase().includes(q);
      const matchDonor = n.metadata?.donorName?.toLowerCase().includes(q);
      const matchState = n.metadata?.state?.toLowerCase().includes(q);
      return matchTitle || matchMsg || matchSender || matchDonor || matchState;
    }
    return true;
  });

  function handleTestChime() {
    playNotificationChime();
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[11px] font-bold text-destructive-foreground">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <CardTitle className="text-xl">Real-Time Notification Center</CardTitle>
                <CardDescription>
                  Live operational telemetry alerting of online donations, public inquiries, and pending field approvals
                </CardDescription>
              </div>
            </div>

            {/* Quick Actions & Live Stream Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleSound}
                className="h-8 gap-1.5 text-xs"
                title={soundEnabled ? "Audio chimes enabled" : "Audio chimes muted"}
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="h-3.5 w-3.5 text-primary" /> Sound ON
                  </>
                ) : (
                  <>
                    <VolumeX className="h-3.5 w-3.5 text-muted-foreground" /> Muted
                  </>
                )}
              </Button>

              <Button
                variant={isStreamActive ? "primary" : "outline"}
                size="sm"
                onClick={onToggleStream}
                className="h-8 gap-1.5 text-xs"
              >
                <Radio
                  className={`h-3.5 w-3.5 ${isStreamActive ? "animate-pulse text-emerald-300" : "text-muted-foreground"}`}
                />
                {isStreamActive ? "Live Stream ON" : "Stream Paused"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onTriggerSimulation();
                  if (soundEnabled) handleTestChime();
                }}
                className="h-8 gap-1.5 text-xs font-semibold text-primary border-primary/30 hover:bg-primary/5"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Simulate New Alert
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Quick Filter Category Pills */}
          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4 text-xs">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All Alerts ({notifications.length})
            </button>

            <button
              onClick={() => setSelectedCategory("donation")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-medium transition-colors ${
                selectedCategory === "donation"
                  ? "bg-emerald-600 text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <DollarSign className="h-3 w-3" />
              Donations ({donationsCount})
            </button>

            <button
              onClick={() => setSelectedCategory("inquiry")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-medium transition-colors ${
                selectedCategory === "inquiry"
                  ? "bg-blue-600 text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <Mail className="h-3 w-3" />
              Inquiries ({inquiriesCount})
            </button>

            <button
              onClick={() => setSelectedCategory("approval")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-medium transition-colors ${
                selectedCategory === "approval"
                  ? "bg-amber-600 text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <AlertCircle className="h-3 w-3" />
              Pending Approvals ({approvalsCount})
            </button>

            <div className="ml-auto flex items-center gap-2">
              <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filterUnreadOnly}
                  onChange={(e) => setFilterUnreadOnly(e.target.checked)}
                  className="rounded border-border"
                />
                Unread only ({unreadCount})
              </label>

              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={onMarkAllAsRead} className="h-7 text-xs text-primary">
                  <CheckCheck className="mr-1 h-3.5 w-3.5" />
                  Mark All Read
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={onClearRead}
                className="h-7 text-xs text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="mr-1 h-3.5 w-3.5" />
                Clear Read
              </Button>
            </div>
          </div>

          {/* Search bar inside notifications */}
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search notifications by donor, partner name, state, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs h-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card className="border-dashed border-border py-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-foreground">All caught up!</p>
              <p className="text-xs text-muted-foreground max-w-sm">
                No notifications match your current filter. You can click &quot;Simulate New Alert&quot; to test incoming events.
              </p>
            </div>
          </Card>
        ) : (
          filteredNotifications.map((notif) => {
            const isUnread = !notif.read;
            const isUrgent = notif.priority === "urgent";

            return (
              <div
                key={notif.id}
                className={`relative rounded-xl border p-4 transition-all ${
                  isUnread
                    ? "bg-card border-primary/30 shadow-xs ring-1 ring-primary/15"
                    : "bg-muted/30 border-border/80 opacity-90"
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  {/* Left Icon & Content */}
                  <div className="flex items-start gap-3.5">
                    {/* Category Icon */}
                    <div
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        notif.category === "donation"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : notif.category === "approval"
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                          : notif.category === "inquiry"
                          ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {notif.category === "donation" && <DollarSign className="h-5 w-5" />}
                      {notif.category === "approval" && <AlertCircle className="h-5 w-5" />}
                      {notif.category === "inquiry" && <Mail className="h-5 w-5" />}
                      {notif.category === "system" && <HelpCircle className="h-5 w-5" />}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{notif.title}</span>

                        {isUnread && (
                          <span className="inline-flex items-center rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                            NEW
                          </span>
                        )}

                        {isUrgent && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-destructive/15 px-2 py-0.5 text-[10px] font-bold text-destructive">
                            <Flame className="h-3 w-3" /> Urgent Action
                          </span>
                        )}

                        <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono">
                          <Clock className="h-3 w-3" />
                          {notif.timestamp}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{notif.message}</p>

                      {/* Metadata Chips if available */}
                      {notif.metadata && (
                        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px]">
                          {notif.metadata.amount && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 font-mono font-bold text-emerald-700 dark:text-emerald-300">
                              {notif.metadata.currency === "USD" ? "$" : "₦"}
                              {notif.metadata.amount}
                            </span>
                          )}

                          {notif.metadata.receiptNumber && (
                            <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 font-mono text-muted-foreground">
                              Receipt: {notif.metadata.receiptNumber}
                            </span>
                          )}

                          {notif.metadata.state && (
                            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-primary">
                              State: {notif.metadata.state}
                            </span>
                          )}

                          {notif.metadata.senderEmail && (
                            <a
                              href={`mailto:${notif.metadata.senderEmail}`}
                              className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-0.5 text-blue-700 dark:text-blue-300 hover:underline"
                            >
                              <Mail className="h-3 w-3" />
                              {notif.metadata.senderEmail}
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex shrink-0 items-center gap-2 self-end sm:self-start">
                    {/* Action required button */}
                    {notif.actionRequired && notif.category === "approval" && (
                      <Button
                        size="sm"
                        onClick={() => onApproveTask(notif.id, notif.metadata?.taskTitle || notif.title)}
                        className="h-7 gap-1 bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Approve
                      </Button>
                    )}

                    {notif.actionRequired && notif.category === "inquiry" && notif.metadata?.senderEmail && (
                      <Button asChild size="sm" variant="outline" className="h-7 gap-1 text-xs">
                        <a href={`mailto:${notif.metadata.senderEmail}?subject=Re: Life Helpers Initiative Inquiry`}>
                          <Mail className="h-3 w-3" /> Reply
                        </a>
                      </Button>
                    )}

                    {isUnread && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMarkAsRead(notif.id)}
                        className="h-7 text-xs text-muted-foreground hover:text-foreground"
                        title="Mark as read"
                      >
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Mark Read
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteNotification(notif.id)}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                      title="Dismiss notification"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
