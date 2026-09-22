export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole?: string;
  category: string;
  date: string;
  readTime: string;
  featuredImage: string;
  status: "published" | "draft" | "scheduled" | "Published" | "Draft" | "Scheduled";
  tags: string[];
  views: number;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  category: "Photography" | "Logos" | "Reports & Documents" | "Icons";
  dimensions: string;
  fileSize: string;
  format?: string;
  uploadedAt: string;
  altText?: string;
  alt?: string;
}

export interface CrmContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  category: "Donor" | "Partner" | "Volunteer" | "Beneficiary" | "Government";
  status: "Lead" | "Active" | "High-Value" | "Inactive";
  stage: "Inquired" | "Engaged" | "Committed" | "Active Supporter" | "Champion";
  state: string;
  country: string;
  totalDonated: number; // in NGN
  donationsCount: number;
  lastInteraction: string;
  notes: string;
  donations: Array<{
    id: string;
    amount: number;
    currency: "NGN" | "USD";
    date: string;
    campaign: string;
    paymentMethod: string;
    receiptNumber: string;
    status: "Completed" | "Pending";
  }>;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Senior Editor" | "CRM Coordinator" | "Field Officer" | "Auditor";
  department: string;
  state: string;
  status: "Active" | "Pending" | "Suspended";
  lastLogin: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  action: string;
  target: string;
  category: "CMS" | "CRM" | "User" | "Security" | "System" | "Media";
}

// Initial default blog posts
export const initialBlogPosts: BlogPost[] = [
  {
    id: "post-1",
    slug: "tom-brown-revolution",
    title: "The Tom Brown Revolution: Combating Child Malnutrition with Indigenous Nigerian Crops",
    author: "LHI MIYCN Nutrition Team",
    authorRole: "Nutrition Specialist",
    date: "2025-02-18",
    readTime: "5 min read",
    category: "Health & Nutrition",
    featuredImage: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    tags: ["Nutrition", "Maternal Health", "Community Resilience"],
    views: 1840,
    excerpt:
      "Rather than relying permanently on imported therapeutic foods, Life Helpers Initiative champions community-led Tom Brown formulation using local soybeans, guinea corn, and groundnuts.",
    content: `Malnutrition in Northern Nigeria is not simply a food shortage crisis; it is frequently an education and dietary diversity challenge. In 2024, Life Helpers Initiative expanded its Tom Brown infant and young child feeding (MIYCN) interventions across remote communities in Sokoto, Kebbi, and Zamfara.

### The Indigenous Formula
Tom Brown is an indigenous nutrient-dense cereal mix created from locally sourced agricultural produce:
- **Soybeans & Groundnuts** for high-quality plant proteins and healthy lipids
- **Guinea Corn (Sorghum) & Millet** for complex carbohydrates and sustained energy
- **Crayfish or Fish Powder** for bioavailable micronutrients including iron, zinc, and omega-3 fatty acids

### Grassroots Impact
Over 14,200 lactating mothers have graduated from our community cooking demonstrations. Rather than fostering perpetual dependency on packaged overseas paste, mothers learn to source, roast, mill, and prepare this life-saving mix directly in their household kitchens.`,
  },
  {
    id: "post-2",
    slug: "reusable-pads-education",
    title: "Menstrual Dignity as Education Infrastructure: How NIDAKE Keeps Northern Girls in School",
    author: "Hajiya Maryam Bello",
    authorRole: "Gender & Social Inclusion Directorate",
    date: "2025-01-24",
    readTime: "4 min read",
    category: "Education & NIDAKE",
    featuredImage: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    tags: ["NIDAKE", "Girls Education", "Social Enterprise"],
    views: 2310,
    excerpt:
      "When a girl lacks sanitary items, she misses up to 20% of school terms. Our NIDAKE reusable pad social enterprise combines vocational training for women with dignified school attendance.",
    content: `Period poverty is a silent barrier that systematically pushes adolescent girls out of secondary schools across rural communities. Life Helpers Initiative established the NIDAKE Social Enterprise to tackle this systemic hurdle at the source.

### The Double Dividend
1. **Economic Empowerment**: Local women receive industrial sewing and textile equipment, earning reliable living wages.
2. **Educational Retention**: Over 26,000 reusable pad kits distributed to schoolgirls, reducing absenteeism from 22% to under 3% in target local government areas.`,
  },
  {
    id: "post-3",
    slug: "traditional-rulers-protection",
    title: "Community-Anchored Child Protection: Partnering with Traditional and Faith Leaders",
    author: "Malam Ibrahim Umar",
    authorRole: "Child Protection Coordinator",
    date: "2024-12-12",
    readTime: "6 min read",
    category: "Protection & GBV",
    featuredImage: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    tags: ["Child Safeguarding", "Faith Leaders", "Traditional Rulers"],
    views: 1420,
    excerpt:
      "External edicts rarely transform centuries-old social norms. By seating village heads, imams, and pastors at the center of Child Protection Committees, LHI has cultivated a trusted grassroots defense network.",
    content: `Sustainable community development requires authentic local ownership. Life Helpers Initiative collaborates directly with the Sultanate Council of Sokoto, Christian Association of Nigeria (CAN), and local Hakimai (District Heads) to champion child safeguarding, eliminate early forced child marriages, and ensure access to formal and non-formal literacy.`,
  },
  {
    id: "post-4",
    slug: "vsla-financial-resilience",
    title: "The Architecture of Village Savings: Building Economic Shock-Absorbers for Displaced Women",
    author: "Zainab Aliyu",
    authorRole: "Livelihoods Lead",
    date: "2024-11-05",
    readTime: "5 min read",
    category: "Livelihoods",
    featuredImage: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    tags: ["VSLA", "Microfinance", "Women Empowerment"],
    views: 980,
    excerpt:
      "A lockbox with three keys, a constitution, and peer trust: how 120+ Village Savings and Loan Associations (VSLAs) empower displaced women to finance clinics, school fees, and small businesses.",
    content: `When displacement disrupts livelihoods, traditional banking systems are inaccessible. Through Village Savings and Loan Associations (VSLA), self-selected groups of 25 to 30 women save weekly, manage emergency loan funds, and build micro-enterprises with 99.4% repayment rates.`,
  },
];

// Initial default media assets
export const initialMediaAssets: MediaAsset[] = [
  {
    id: "media-1",
    name: "lhi-official-logo.png",
    url: "/logo.png",
    category: "Logos",
    dimensions: "1533 x 440",
    fileSize: "68 KB",
    format: "PNG",
    uploadedAt: "2024-10-01",
    altText: "Life Helpers Initiative Official Horizontal Logo",
  },
  {
    id: "media-2",
    name: "hero-child-learning.jpg",
    url: "https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?auto=format&fit=crop&w=1600&q=85",
    category: "Photography",
    dimensions: "1600 x 1067",
    fileSize: "245 KB",
    format: "JPEG",
    uploadedAt: "2025-01-10",
    altText: "Smiling African child holding notebook in outdoor school center",
  },
  {
    id: "media-3",
    name: "tom-brown-nutrition-clinic.jpg",
    url: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80",
    category: "Photography",
    dimensions: "1200 x 800",
    fileSize: "182 KB",
    format: "JPEG",
    uploadedAt: "2025-01-15",
    altText: "Mothers preparing nutrient-rich Tom Brown infant porridge",
  },
  {
    id: "media-4",
    name: "nidake-reusable-pads.jpg",
    url: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80",
    category: "Photography",
    dimensions: "1200 x 800",
    fileSize: "196 KB",
    format: "JPEG",
    uploadedAt: "2025-01-20",
    altText: "Adolescent girls receiving NIDAKE reusable sanitary pad kits",
  },
  {
    id: "media-5",
    name: "vsla-women-savings.jpg",
    url: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1200&q=80",
    category: "Photography",
    dimensions: "1200 x 800",
    fileSize: "210 KB",
    format: "JPEG",
    uploadedAt: "2025-02-01",
    altText: "Village Savings and Loan Association meeting in rural community",
  },
  {
    id: "media-6",
    name: "annual-impact-report-2024.pdf",
    url: "/documents/LHI-Annual-Audited-Report-2024.pdf",
    category: "Reports & Documents",
    dimensions: "A4 (28 pages)",
    fileSize: "4.2 MB",
    format: "PDF",
    uploadedAt: "2025-02-15",
    altText: "Life Helpers Initiative Audited Financial and Program Report 2024",
  },
];

// Initial default CRM contacts
export const initialCrmContacts: CrmContact[] = [
  {
    id: "crm-1",
    name: "Dr. Aminu Tambuwal",
    email: "aminu.tambuwal@northcare.org",
    phone: "+234 803 456 7890",
    organization: "Northern Health Foundation",
    category: "Donor",
    status: "High-Value",
    stage: "Active Supporter",
    state: "Sokoto",
    country: "Nigeria",
    totalDonated: 7500000,
    donationsCount: 4,
    lastInteraction: "2025-02-22",
    notes: "Committed to co-funding 3 solar-powered boreholes in Wamakko LGA.",
    donations: [
      {
        id: "don-101",
        amount: 3000000,
        currency: "NGN",
        date: "2025-02-15",
        campaign: "Solar WASH Boreholes",
        paymentMethod: "Bank Wire",
        receiptNumber: "LHI-RCP-2025-0089",
        status: "Completed",
      },
      {
        id: "don-102",
        amount: 2500000,
        currency: "NGN",
        date: "2024-11-20",
        campaign: "Tom Brown Nutrition",
        paymentMethod: "Bank Wire",
        receiptNumber: "LHI-RCP-2024-0412",
        status: "Completed",
      },
    ],
  },
  {
    id: "crm-2",
    name: "Claire Henderson",
    email: "c.henderson@globalrelief.uk",
    phone: "+44 20 7946 0912",
    organization: "Global Relief Initiative UK",
    category: "Partner",
    status: "Active",
    stage: "Champion",
    state: "London",
    country: "United Kingdom",
    totalDonated: 18500000,
    donationsCount: 6,
    lastInteraction: "2025-02-28",
    notes: "Institutional partner backing adolescent girl education & safe spaces.",
    donations: [
      {
        id: "don-103",
        amount: 8500000,
        currency: "NGN",
        date: "2025-01-10",
        campaign: "NIDAKE Girl-Child Retention",
        paymentMethod: "SWIFT Transfer",
        receiptNumber: "LHI-RCP-2025-0012",
        status: "Completed",
      },
    ],
  },
  {
    id: "crm-3",
    name: "Fatima Kabir Bature",
    email: "fatima.bature@lagosinvest.com",
    phone: "+234 812 987 6543",
    organization: "Kabir Legacy Trust",
    category: "Donor",
    status: "High-Value",
    stage: "Active Supporter",
    state: "Lagos",
    country: "Nigeria",
    totalDonated: 4200000,
    donationsCount: 3,
    lastInteraction: "2025-02-14",
    notes: "Regular quarterly contributor toward maternal health clinics in Zamfara.",
    donations: [
      {
        id: "don-104",
        amount: 1500000,
        currency: "NGN",
        date: "2025-02-01",
        campaign: "Maternal Health Clinic",
        paymentMethod: "Paystack / Card",
        receiptNumber: "LHI-RCP-2025-0044",
        status: "Completed",
      },
    ],
  },
  {
    id: "crm-4",
    name: "Usman Danfulani",
    email: "udanfulani@youthlead.ng",
    phone: "+234 809 111 2233",
    organization: "Sokoto Youth Alliance",
    category: "Volunteer",
    status: "Active",
    stage: "Committed",
    state: "Sokoto",
    country: "Nigeria",
    totalDonated: 0,
    donationsCount: 0,
    lastInteraction: "2025-02-25",
    notes: "Field volunteer team leader coordinating community flood sensitization.",
    donations: [],
  },
  {
    id: "crm-5",
    name: "Dr. Hadiza Sani",
    email: "dr.hadiza@moh-sokoto.gov.ng",
    phone: "+234 802 333 4455",
    organization: "Ministry of Health, Sokoto State",
    category: "Government",
    status: "Active",
    stage: "Champion",
    state: "Sokoto",
    country: "Nigeria",
    totalDonated: 0,
    donationsCount: 0,
    lastInteraction: "2025-03-01",
    notes: "Government focal officer for state primary healthcare board collaboration.",
    donations: [],
  },
];

// Initial default administrative users
export const initialAdminUsers: AdminUser[] = [
  {
    id: "usr-1",
    name: "Directorate Administrator",
    email: "admin@lhinigeria.org",
    role: "Super Admin",
    department: "Executive Directorate",
    state: "Sokoto (HQ)",
    status: "Active",
    lastLogin: "Just now",
    createdAt: "2024-01-01",
  },
  {
    id: "usr-2",
    name: "Aisha Mohammed",
    email: "aisha.mohammed@lhinigeria.org",
    role: "Senior Editor",
    department: "Programs",
    state: "Sokoto",
    status: "Active",
    lastLogin: "2 hours ago",
    createdAt: "2024-03-15",
  },
  {
    id: "usr-3",
    name: "Chukwudi Okonkwo",
    email: "c.okonkwo@lhinigeria.org",
    role: "CRM Coordinator",
    department: "Finance & Grants",
    state: "FCT Abuja",
    status: "Active",
    lastLogin: "Yesterday",
    createdAt: "2024-05-10",
  },
  {
    id: "usr-4",
    name: "Bello Danjuma",
    email: "bello.d@lhinigeria.org",
    role: "Field Officer",
    department: "Operations & Logistics",
    state: "Katsina",
    status: "Active",
    lastLogin: "3 days ago",
    createdAt: "2024-06-20",
  },
  {
    id: "usr-5",
    name: "Grace Ene",
    email: "grace.ene@lhinigeria.org",
    role: "Auditor",
    department: "M&E",
    state: "Plateau (Jos)",
    status: "Active",
    lastLogin: "Feb 27, 2025",
    createdAt: "2024-08-01",
  },
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: "log-1",
    timestamp: "2025-03-02 14:22",
    userEmail: "admin@lhinigeria.org",
    action: "Updated Google Analytics GA4 Measurement Tag",
    target: "System Settings",
    category: "System",
  },
  {
    id: "log-2",
    timestamp: "2025-03-02 11:15",
    userEmail: "admin@lhinigeria.org",
    action: "Logged new donation: ₦3,000,000 (Dr. Aminu Tambuwal)",
    target: "CRM Ledger",
    category: "CRM",
  },
  {
    id: "log-3",
    timestamp: "2025-03-01 16:40",
    userEmail: "aisha.mohammed@lhinigeria.org",
    action: "Published blog post: The Tom Brown Revolution",
    target: "Content Management",
    category: "CMS",
  },
  {
    id: "log-4",
    timestamp: "2025-02-28 09:30",
    userEmail: "admin@lhinigeria.org",
    action: "Uploaded new media asset: annual-impact-report-2024.pdf",
    target: "Media Library",
    category: "CMS",
  },
];
