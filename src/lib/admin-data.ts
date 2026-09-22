import type {
  AdminAuditLog,
  AdminBlogPost,
  AdminNotification,
  CrmContact,
  AdminBackupData,
} from "@/types/admin";

export const initialCrmContacts: CrmContact[] = [
  {
    id: "ct-001",
    fullName: "Alhaji Garba Shehu",
    email: "g.shehu@zamfaradev.org",
    phone: "+234 803 241 8901",
    organization: "Zamfara Agricultural Recovery Initiative",
    category: "Corporate Donor",
    state: "Zamfara",
    status: "Champion",
    totalContributionsNgn: 4500000,
    totalContributionsUsd: 3200,
    lastInteractionDate: "2026-09-18",
    notes: "Committed matching funds for dry-season irrigation seeds in Anka LGA.",
    tags: ["Agriculture", "IDP Relief", "High Net Worth"],
    createdAt: "2024-03-12",
  },
  {
    id: "ct-002",
    fullName: "Dr. Hadiza Bala Usman",
    email: "dr.hadiza@sokotohealth.gov.ng",
    phone: "+234 802 884 1290",
    organization: "Sokoto State Ministry of Health",
    category: "Institutional Partner",
    state: "Sokoto",
    status: "Active Supporter",
    totalContributionsNgn: 0,
    totalContributionsUsd: 0,
    lastInteractionDate: "2026-09-15",
    notes: "Focal point for LHI Tom Brown malnutrition clinic referrals across 8 primary health centers.",
    tags: ["Ministry", "Nutrition", "MOH"],
    createdAt: "2023-08-20",
  },
  {
    id: "ct-003",
    fullName: "Elena Van Der Beek",
    email: "e.vanderbeek@echo-nigeria.eu",
    phone: "+234 814 990 4421",
    organization: "European Civil Protection and Humanitarian Operations (ECHO)",
    category: "Grant Officer",
    state: "FCT Abuja",
    status: "Committed",
    totalContributionsNgn: 48000000,
    totalContributionsUsd: 34500,
    lastInteractionDate: "2026-09-19",
    notes: "Managing the 2026 North-East Emergency WASH & Child Protection multi-sector grant.",
    tags: ["International Grant", "ECHO", "WASH"],
    createdAt: "2025-01-10",
  },
  {
    id: "ct-004",
    fullName: "Bukar Mohammed Kyari",
    email: "bukar.kyari@maidugurirelief.ng",
    phone: "+234 706 551 2284",
    organization: "Borno Community Resilience Forum",
    category: "Field Coordinator",
    state: "Borno",
    status: "Active Supporter",
    totalContributionsNgn: 0,
    totalContributionsUsd: 0,
    lastInteractionDate: "2026-09-20",
    notes: "Oversees community protection volunteers in Monguno & Bama camps.",
    tags: ["Field Team", "Protection", "Camp Liaison"],
    createdAt: "2024-06-01",
  },
  {
    id: "ct-005",
    fullName: "Amina Yusuf Gwandu",
    email: "amina.gwandu@kebbiwomen.org",
    phone: "+234 809 332 9918",
    organization: "Kebbi Women Farmers Cooperative",
    category: "Community Beneficiary",
    state: "Kebbi",
    status: "Champion",
    totalContributionsNgn: 150000,
    totalContributionsUsd: 0,
    lastInteractionDate: "2026-09-10",
    notes: "VSLA Chairperson; leading 42 women in peanut butter processing and micro-savings.",
    tags: ["VSLA", "Livelihoods", "Women Leader"],
    createdAt: "2024-11-14",
  },
  {
    id: "ct-006",
    fullName: "Engr. Nnamdi Okeke",
    email: "n.okeke@solargridnigeria.com",
    phone: "+234 803 771 9082",
    organization: "Solar Grid Solutions Ltd",
    category: "Corporate Donor",
    state: "Kaduna",
    status: "Engaged",
    totalContributionsNgn: 2200000,
    totalContributionsUsd: 1500,
    lastInteractionDate: "2026-09-05",
    notes: "Donated 12 solar-powered borehole pumps for drought-impacted rural schools in Katsina.",
    tags: ["Solar", "Clean Water", "Corporate CSR"],
    createdAt: "2025-04-18",
  },
  {
    id: "ct-007",
    fullName: "Fatima Zahra Dahiru",
    email: "zahra.dahiru@gmail.com",
    phone: "+234 818 223 9104",
    organization: "Independent Medical Volunteer",
    category: "Volunteer",
    state: "Kano",
    status: "Active Supporter",
    totalContributionsNgn: 50000,
    totalContributionsUsd: 0,
    lastInteractionDate: "2026-09-17",
    notes: "Pediatric nurse volunteering 16 hours/month on LHI mobile immunisation outreaches.",
    tags: ["Medical Volunteer", "Immunization", "Nursing"],
    createdAt: "2025-07-22",
  },
  {
    id: "ct-008",
    fullName: "Chief Dr. Michael Adeleke",
    email: "adeleke.foundations@adelekegroup.com",
    phone: "+234 802 111 8899",
    organization: "Adeleke Philanthropic Trust",
    category: "Individual Donor",
    state: "FCT Abuja",
    status: "Committed",
    totalContributionsNgn: 12500000,
    totalContributionsUsd: 8900,
    lastInteractionDate: "2026-09-12",
    notes: "Supporter of NIDAKE Menstrual Hygiene Factory equipment acquisition.",
    tags: ["NIDAKE", "Education", "Major Donor"],
    createdAt: "2024-09-05",
  },
];

export const initialBlogPosts: AdminBlogPost[] = [
  {
    id: "post-001",
    slug: "tom-brown-nutrition-breakthrough",
    title: "The Tom Brown Revolution: Combating Child Malnutrition with Indigenous Nigerian Crops",
    author: "Dr. Salisu Kangiwa",
    authorRole: "MIYCN Nutrition Lead",
    category: "Health & Nutrition",
    date: "2026-02-14",
    readTime: "5 min read",
    status: "Published",
    excerpt:
      "Rather than relying permanently on imported therapeutic paste, LHI champions community-led Tom Brown formulation using locally farmed soybeans, guinea corn, and groundnuts.",
    tags: ["Nutrition", "Tom Brown", "Maternal Health", "Sokoto"],
    views: 4890,
    featured: true,
    createdAt: "2026-02-10",
    updatedAt: "2026-02-14",
  },
  {
    id: "post-002",
    slug: "reusable-pads-menstrual-dignity-nidake",
    title: "Menstrual Dignity as Education Infrastructure: How NIDAKE Keeps Northern Girls in School",
    author: "Zainab Mohammed",
    authorRole: "Gender & Social Inclusion Directorate",
    category: "Education & NIDAKE",
    date: "2026-01-22",
    readTime: "4 min read",
    status: "Published",
    excerpt:
      "When a girl lacks sanitary items, she misses 20% of the school year. Our NIDAKE reusable pad social enterprise combines vocational tailoring with dignified protection.",
    tags: ["Education", "NIDAKE", "Girls Rights", "Dignity"],
    views: 3120,
    featured: true,
    createdAt: "2026-01-18",
    updatedAt: "2026-01-22",
  },
  {
    id: "post-003",
    slug: "community-child-protection-traditional-rulers",
    title: "Community-Anchored Child Protection: Partnering with Traditional and Faith Leaders",
    author: "Musa Ibrahim",
    authorRole: "Child Protection Lead",
    category: "Child Protection",
    date: "2025-12-08",
    readTime: "6 min read",
    status: "Published",
    excerpt:
      "By seating village elders, district heads, imams, and pastors at the center of Child Protection Committees, LHI has cultivated a grassroots network that actively halts abuse.",
    tags: ["Child Protection", "Community Leadership", "Peacebuilding"],
    views: 2450,
    featured: false,
    createdAt: "2025-12-01",
    updatedAt: "2025-12-08",
  },
  {
    id: "post-004",
    slug: "vsla-women-economic-resilience-kebbi",
    title: "The Architecture of Village Savings: Building Economic Shock-Absorbers for Displaced Women",
    author: "Hauwa Abdullahi",
    authorRole: "Livelihoods Specialist",
    category: "Livelihoods",
    date: "2025-11-19",
    readTime: "5 min read",
    status: "Published",
    excerpt:
      "A lockbox with three keys, a strict constitution, and peer accountability: how over 120 VSLAs established by LHI empower rural women to self-finance clinics and farm inputs.",
    tags: ["VSLA", "Microfinance", "Women Empowerment", "Kebbi"],
    views: 1980,
    featured: false,
    createdAt: "2025-11-15",
    updatedAt: "2025-11-19",
  },
  {
    id: "post-005",
    slug: "rapid-wash-response-in-borno-idp-settlements",
    title: "Rapid WASH Surge: Solarizing Boreholes and Halting Cholera in Borno IDP Settlements",
    author: "Engr. Tukur Danladi",
    authorRole: "WASH Infrastructure Advisor",
    category: "WASH & Infrastructure",
    date: "2026-03-01",
    readTime: "4 min read",
    status: "Draft",
    excerpt:
      "Technical breakdown of how retrofitting 14 abandoned diesel pumps with solar photovoltaic systems brought clean, reliable potable water to 38,000 displaced people in Gwoza.",
    tags: ["WASH", "Solar Water", "Borno", "Cholera Prevention"],
    views: 142,
    featured: false,
    createdAt: "2026-02-28",
    updatedAt: "2026-03-01",
  },
  {
    id: "post-006",
    slug: "safeguarding-psea-institutional-lifestyle",
    title: "Safeguarding as an Institutional Lifestyle: Beyond Paper Compliance in Humanitarian Action",
    author: "Amina Aliyu",
    authorRole: "Internal Audit & Safeguarding Lead",
    category: "Governance & PSEA",
    date: "2026-03-15",
    readTime: "5 min read",
    status: "Scheduled",
    excerpt:
      "How mandatory survivor-centered reporting, whistleblowing protection, and continuous staff vetting safeguard our community participants across 11 northern states.",
    tags: ["PSEA", "Safeguarding", "Compliance", "Humanitarian Ethics"],
    views: 89,
    featured: false,
    createdAt: "2026-03-10",
    updatedAt: "2026-03-12",
  },
];

export const initialNotifications: AdminNotification[] = [
  {
    id: "notif-001",
    title: "New Online Donation Received",
    message: "₦250,000 received from Alhaji Danjuma Musa for Sokoto Emergency Malnutrition Relief.",
    category: "donation",
    priority: "normal",
    timestamp: "2026-09-20 08:42:15",
    read: false,
    actionRequired: true,
    actionType: "review_donation",
    metadata: {
      donorName: "Alhaji Danjuma Musa",
      amount: "250,000",
      currency: "NGN",
      receiptNumber: "LHI-DN-2026-8910",
      state: "Sokoto",
    },
  },
  {
    id: "notif-002",
    title: "Institutional Partnership Inquiry",
    message: "New message from Global Food Security Fund requesting meeting regarding 2026 dry-season seed grants.",
    category: "inquiry",
    priority: "urgent",
    timestamp: "2026-09-20 07:15:30",
    read: false,
    actionRequired: true,
    actionType: "reply_inquiry",
    metadata: {
      senderName: "Claire Dupont",
      senderEmail: "c.dupont@globalfoodfund.org",
      taskTitle: "Grant Dialogue on Dry Season Inputs",
    },
  },
  {
    id: "notif-003",
    title: "Pending Emergency Fund Disbursement Approval",
    message: "Field Director submitted voucher #DISB-2026-44: ₦1,850,000 for emergency grain purchase in Kebbi State.",
    category: "approval",
    priority: "urgent",
    timestamp: "2026-09-20 06:30:00",
    read: false,
    actionRequired: true,
    actionType: "approve_disbursement",
    metadata: {
      amount: "1,850,000",
      currency: "NGN",
      state: "Kebbi",
      taskTitle: "Grain Purchase Voucher #DISB-2026-44",
    },
  },
  {
    id: "notif-004",
    title: "USD Donation Confirmed",
    message: "$500.00 USD contribution processed via Stripe from Diaspora Friends of Northern Nigeria.",
    category: "donation",
    priority: "normal",
    timestamp: "2026-09-19 22:18:40",
    read: true,
    metadata: {
      donorName: "Diaspora Friends of Northern Nigeria",
      amount: "500.00",
      currency: "USD",
      receiptNumber: "LHI-DN-INT-4491",
    },
  },
  {
    id: "notif-005",
    title: "Draft Article Submitted for Editorial Review",
    message: "Engr. Tukur Danladi requested sign-off on draft dispatch 'Rapid WASH Surge in Borno IDP Settlements'.",
    category: "approval",
    priority: "normal",
    timestamp: "2026-09-19 18:05:12",
    read: true,
    actionRequired: true,
    actionType: "sign_off_report",
    metadata: {
      senderName: "Engr. Tukur Danladi",
      taskTitle: "WASH Field Dispatch Sign-off",
      entityId: "post-005",
    },
  },
  {
    id: "notif-006",
    title: "Volunteer Application from Borno",
    message: "Fatima S. Goni (Licensed Midwife, Maiduguri) submitted volunteer credentials for maternal health unit.",
    category: "inquiry",
    priority: "normal",
    timestamp: "2026-09-19 14:12:00",
    read: true,
    actionRequired: false,
    metadata: {
      senderName: "Fatima S. Goni",
      senderEmail: "f.goni@gmail.com",
      state: "Borno",
    },
  },
];

export const initialAuditLogs: AdminAuditLog[] = [
  {
    id: "log-001",
    timestamp: "2026-09-20 08:45:00",
    userEmail: "admin@lhinigeria.org",
    action: "System Backup Generated",
    target: "Full Database Snapshot (JSON)",
    category: "Export & Backup",
    details: "Automated pre-audit verification backup archive downloaded.",
  },
  {
    id: "log-002",
    timestamp: "2026-09-20 07:30:15",
    userEmail: "auditor@lhinigeria.org",
    action: "Exported CRM Contacts",
    target: "8 Active Constituent Records (CSV)",
    category: "Export & Backup",
    details: "Exported for quarterly donor compliance documentation.",
  },
  {
    id: "log-003",
    timestamp: "2026-09-19 16:20:00",
    userEmail: "editor@lhinigeria.org",
    action: "Updated Blog Post Status",
    target: "Tom Brown Revolution Article",
    category: "CMS",
    details: "Scheduled post updated to Published status.",
  },
  {
    id: "log-004",
    timestamp: "2026-09-19 11:10:45",
    userEmail: "finance@lhinigeria.org",
    action: "Approved Disbursement",
    target: "Voucher #DISB-2026-41 (₦2,400,000)",
    category: "Approval",
    details: "Authorized agricultural seed acquisition for Zamfara farming clusters.",
  },
];

// ==========================================
// EXPORT HELPERS (CSV & JSON)
// ==========================================

function sanitizeCsvField(field: unknown): string {
  if (field === null || field === undefined) return '""';
  const str = Array.isArray(field) ? field.join("; ") : String(field);
  // If field contains comma, quote, or newline, escape quotes and wrap in quotes
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

export function exportToCsv(filename: string, headers: string[], rows: (string | number | boolean | string[])[][]): void {
  // Add UTF-8 BOM so Microsoft Excel properly displays currency symbols like Naira ₦
  const bom = "\uFEFF";
  const headerRow = headers.map(sanitizeCsvField).join(",");
  const dataRows = rows.map((row) => row.map(sanitizeCsvField).join(","));
  const csvContent = [bom + headerRow, ...dataRows].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToJson(filename: string, data: unknown): void {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith(".json") ? filename : `${filename}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportCrmContacts(contacts: CrmContact[], format: "csv" | "json"): void {
  const dateStr = new Date().toISOString().split("T")[0];
  const filename = `lhi_crm_contacts_${dateStr}`;

  if (format === "json") {
    const payload = {
      exportType: "LHI CRM Contacts",
      exportedAt: new Date().toISOString(),
      recordCount: contacts.length,
      contacts,
    };
    exportToJson(filename, payload);
    return;
  }

  // CSV
  const headers = [
    "Contact ID",
    "Full Name",
    "Email",
    "Phone",
    "Organization",
    "Category",
    "State / Region",
    "Lifecycle Status",
    "Total Given (NGN)",
    "Total Given (USD)",
    "Last Interaction",
    "Tags",
    "Notes",
    "Created Date",
  ];

  const rows = contacts.map((c) => [
    c.id,
    c.fullName,
    c.email,
    c.phone,
    c.organization,
    c.category,
    c.state,
    c.status,
    c.totalContributionsNgn,
    c.totalContributionsUsd,
    c.lastInteractionDate,
    c.tags.join("; "),
    c.notes,
    c.createdAt,
  ]);

  exportToCsv(filename, headers, rows);
}

export function exportBlogPosts(posts: AdminBlogPost[], format: "csv" | "json"): void {
  const dateStr = new Date().toISOString().split("T")[0];
  const filename = `lhi_blog_posts_${dateStr}`;

  if (format === "json") {
    const payload = {
      exportType: "LHI Field Blog & CMS Posts",
      exportedAt: new Date().toISOString(),
      recordCount: posts.length,
      posts,
    };
    exportToJson(filename, payload);
    return;
  }

  // CSV
  const headers = [
    "Post ID",
    "Slug",
    "Title",
    "Author",
    "Author Role",
    "Category",
    "Publication Date",
    "Status",
    "Read Time",
    "Views",
    "Featured",
    "Tags",
    "Excerpt",
    "Created At",
    "Updated At",
  ];

  const rows = posts.map((p) => [
    p.id,
    p.slug,
    p.title,
    p.author,
    p.authorRole,
    p.category,
    p.date,
    p.status,
    p.readTime,
    p.views,
    p.featured ? "Yes" : "No",
    p.tags.join("; "),
    p.excerpt,
    p.createdAt,
    p.updatedAt,
  ]);

  exportToCsv(filename, headers, rows);
}

export function exportAuditLogs(logs: AdminAuditLog[], format: "csv" | "json"): void {
  const dateStr = new Date().toISOString().split("T")[0];
  const filename = `lhi_audit_logs_${dateStr}`;

  if (format === "json") {
    const payload = {
      exportType: "LHI Administrative Audit Trail",
      exportedAt: new Date().toISOString(),
      recordCount: logs.length,
      logs,
    };
    exportToJson(filename, payload);
    return;
  }

  const headers = ["Log ID", "Timestamp", "User Email", "Action", "Target", "Category", "Details"];
  const rows = logs.map((l) => [l.id, l.timestamp, l.userEmail, l.action, l.target, l.category, l.details || ""]);
  exportToCsv(filename, headers, rows);
}

export function generateFullBackup(
  contacts: CrmContact[],
  posts: AdminBlogPost[],
  notifications: AdminNotification[],
  auditLogs: AdminAuditLog[],
  userEmail: string
): void {
  const dateStr = new Date().toISOString().split("T")[0];
  const filename = `lhi_complete_system_backup_${dateStr}`;

  const backupData: AdminBackupData = {
    version: "2.5.0",
    systemName: "Life Helpers Initiative (LHI) Governance & Operations Suite",
    exportedAt: new Date().toISOString(),
    exportedBy: userEmail,
    contactsCount: contacts.length,
    postsCount: posts.length,
    notificationsCount: notifications.length,
    auditLogsCount: auditLogs.length,
    data: {
      contacts,
      posts,
      notifications,
      auditLogs,
    },
  };

  exportToJson(filename, backupData);
}

// Subtle synthesized audio chime using Web Audio API (cross-browser safe, zero external mp3 files)
export function playNotificationChime(): void {
  try {
    if (typeof window === "undefined") return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Harmonic two-tone subtle bell
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(880, now);
    osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.12); // D6

    gainNode.gain.setValueAtTime(0.08, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.45);
    osc2.stop(now + 0.45);
  } catch {
    // Gracefully handle browser auto-play restrictions or disabled audio
  }
}
