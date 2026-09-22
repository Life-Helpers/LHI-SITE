export type ContactCategory =
  | "Individual Donor"
  | "Corporate Donor"
  | "Institutional Partner"
  | "Grant Officer"
  | "Field Coordinator"
  | "Volunteer"
  | "Community Beneficiary";

export type ContactLifecycleStatus =
  | "Inquired"
  | "Engaged"
  | "Committed"
  | "Active Supporter"
  | "Champion"
  | "Inactive";

export interface CrmContact {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  category: ContactCategory;
  state: string; // e.g., Sokoto, Borno, Zamfara, FCT Abuja
  status: ContactLifecycleStatus;
  totalContributionsNgn: number;
  totalContributionsUsd: number;
  lastInteractionDate: string;
  notes: string;
  tags: string[];
  createdAt: string;
}

export type BlogPostStatus = "Published" | "Draft" | "Scheduled";

export interface AdminBlogPost {
  id: string;
  slug: string;
  title: string;
  author: string;
  authorRole: string;
  category: string;
  date: string;
  readTime: string;
  status: BlogPostStatus;
  excerpt: string;
  tags: string[];
  views: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type NotificationCategory = "donation" | "inquiry" | "approval" | "system";
export type NotificationPriority = "urgent" | "normal" | "low";

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  timestamp: string;
  read: boolean;
  actionRequired?: boolean;
  actionType?: "review_donation" | "reply_inquiry" | "approve_disbursement" | "sign_off_report";
  metadata?: {
    donorName?: string;
    amount?: string;
    currency?: string;
    receiptNumber?: string;
    senderName?: string;
    senderEmail?: string;
    state?: string;
    taskTitle?: string;
    entityId?: string;
  };
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  action: string;
  target: string;
  category: "Export & Backup" | "Approval" | "Donation" | "CMS" | "CRM" | "User" | "Security";
  ipAddress?: string;
  details?: string;
}

export interface AdminBackupData {
  version: string;
  systemName: string;
  exportedAt: string;
  exportedBy: string;
  contactsCount: number;
  postsCount: number;
  notificationsCount: number;
  auditLogsCount: number;
  data: {
    contacts: CrmContact[];
    posts: AdminBlogPost[];
    notifications: AdminNotification[];
    auditLogs: AdminAuditLog[];
  };
}
