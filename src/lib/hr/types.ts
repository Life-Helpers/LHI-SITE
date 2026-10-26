/**
 * LHI HR portal: data model, permission catalogue and built-in roles.
 *
 * Everything a user may see or do in /hrportal is decided on the server from these records,
 * read fresh on every request (see src/lib/hr/session.ts and src/lib/hr/access.ts).
 */

export const HR_PERMISSION_GROUPS = [
  {
    label: "Self-service",
    items: [
      { id: "self.view", label: "View own record", help: "See their own employee record, leave balance and requests." },
      { id: "self.update", label: "Update own contact details", help: "Change their own phone, address and emergency contact." },
      { id: "leave.request", label: "Request leave", help: "Submit and cancel their own leave requests." },
    ],
  },
  {
    label: "Team",
    items: [
      { id: "team.view", label: "View team", help: "See the records of staff who report to them (directly or through others)." },
      { id: "team.leave.approve", label: "Approve team leave", help: "Approve or reject leave for staff who report to them." },
    ],
  },
  {
    label: "HR operations",
    items: [
      { id: "employees.view", label: "View all employees", help: "See every employee record." },
      { id: "employees.manage", label: "Manage employee records", help: "Create and edit employee records and reporting lines." },
      { id: "leave.view_all", label: "View all leave", help: "See leave requests across the organisation." },
      { id: "leave.manage", label: "Decide any leave", help: "Approve or reject any leave request (except their own)." },
    ],
  },
  {
    label: "Administration",
    items: [
      { id: "accounts.manage", label: "Manage portal accounts", help: "Create, deactivate and reactivate accounts, link them to employees and assign roles." },
      { id: "roles.manage", label: "Configure roles & permissions", help: "Create and edit custom roles and give accounts extra permissions." },
      { id: "audit.view", label: "View audit trail (IT team)", help: "IT team only: see the record of account, role and permission changes. Granted by a website administrator, not from inside the portal." },
    ],
  },
  {
    label: "Reports",
    items: [{ id: "reports.view", label: "View reports", help: "See organisation-wide headcount and leave reports." }],
  },
] as const;

export type HrPermission = (typeof HR_PERMISSION_GROUPS)[number]["items"][number]["id"];

export const ALL_HR_PERMISSIONS: HrPermission[] = HR_PERMISSION_GROUPS.flatMap((g) => g.items.map((i) => i.id));

export const isHrPermission = (value: unknown): value is HrPermission =>
  typeof value === "string" && (ALL_HR_PERMISSIONS as string[]).includes(value);

export interface HrRole {
  id: string;
  name: string;
  description: string;
  permissions: HrPermission[];
  /** Built-in roles are defined in code and can't be edited or deleted. */
  builtIn?: boolean;
}

const SELF: HrPermission[] = ["self.view", "self.update", "leave.request"];

export const BUILT_IN_HR_ROLES: HrRole[] = [
  { id: "employee", name: "Employee", description: "Personal self-service: own record and leave.", permissions: [...SELF], builtIn: true },
  {
    id: "manager",
    name: "Manager",
    description: "Self-service plus their team's records and leave approvals.",
    permissions: [...SELF, "team.view", "team.leave.approve"],
    builtIn: true,
  },
  {
    id: "management",
    name: "Management",
    description: "Self-service, their own team, and organisation-wide reports.",
    permissions: [...SELF, "team.view", "team.leave.approve", "reports.view"],
    builtIn: true,
  },
  {
    id: "hr_officer",
    name: "HR Officer",
    description: "Organisation-wide HR operations: employee records, reporting lines and leave.",
    permissions: [...SELF, "employees.view", "employees.manage", "leave.view_all", "leave.manage", "reports.view"],
    builtIn: true,
  },
  {
    id: "hr_admin",
    name: "HR Administrator",
    description: "Everything, including portal accounts, roles and permissions. The audit trail is for the IT team only.",
    permissions: ALL_HR_PERMISSIONS.filter((p) => p !== "audit.view"),
    builtIn: true,
  },
];

export interface HrAccount {
  id: string;
  /** Sign-in email (lower case, unique). */
  email: string;
  /** The employee record this account belongs to. */
  employeeId: string;
  roleId: string;
  /** Permissions on top of the role (least privilege: add only what's needed). */
  extraPermissions: HrPermission[];
  active: boolean;
  /** Unset until the person activates the account from their invite link. */
  passwordHash?: string;
  /** Bumped whenever access changes; sessions carrying an older value stop working. */
  sessionVersion: number;
  /** Set when HR chose the password: the person must pick their own before doing anything else. */
  mustChangePassword?: boolean;
  /** Test record from "Load sample data"; removed by "Remove sample data". */
  sample?: boolean;
  createdAt: string;
  createdBy: string;
  lastLoginAt?: string;
  deactivatedAt?: string;
}

/** The leave types the portal started with; HR can rename, recolour, add and retire types. */
export const LEAVE_TYPES = ["Annual", "Sick", "Compassionate", "Maternity", "Paternity", "Study", "Unpaid", "Other"] as const;

export const LEAVE_COLORS = ["emerald", "rose", "slate", "pink", "blue", "violet", "orange", "cyan", "amber", "teal", "indigo", "lime"] as const;
export type LeaveColor = (typeof LEAVE_COLORS)[number];

/** A kind of leave staff can request. Its id is stored on each request. */
export interface HrLeaveType {
  id: string;
  name: string;
  description: string;
  color: LeaveColor;
  paid: boolean;
  /** Days a year when no policy says otherwise; null means not limited (no balance kept). */
  defaultDays: number | null;
  /** Unused days can roll into the next year, up to the policy's carry-over limit. */
  carryOver: boolean;
  active: boolean;
}

const START_COLORS: LeaveColor[] = ["emerald", "rose", "slate", "pink", "blue", "violet", "orange", "cyan"];

/**
 * Starting leave types. Only Annual leave has a set allowance (20 days, as before); HR sets the
 * others under Leave Types or Leave Policies to match LHI's leave policy.
 */
export const DEFAULT_LEAVE_TYPES: HrLeaveType[] = LEAVE_TYPES.map((id, i) => ({
  id,
  name: `${id} Leave`,
  description: "",
  color: START_COLORS[i],
  paid: id !== "Unpaid",
  defaultDays: id === "Annual" ? 20 : null,
  carryOver: false,
  active: true,
}));

/**
 * Leave allowances for a group of staff. The most specific active policy wins for each leave
 * type: a department's policy, then an employment-type policy, then the all-staff policy.
 */
/** The rules for one leave type, for all staff or a narrower group. */
export interface HrLeavePolicy {
  id: string;
  name: string;
  description: string;
  /** The leave type this policy is for. */
  typeId: string;
  /** Days a year; null = no limit. */
  days: number | null;
  /** Most unused days that roll into next year (0 = none). */
  carryForward: number;
  /** False: requests of this type are approved as soon as they're sent. */
  approvalRequired: boolean;
  scope: "all" | "department" | "employmentType";
  /** Department id or employment type, for the narrower scopes. */
  scopeValue: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/** One all-staff policy per default leave type, served until HR saves its own. */
export const DEFAULT_LEAVE_POLICIES: HrLeavePolicy[] = DEFAULT_LEAVE_TYPES.map((t) => ({
  id: `lp_${t.id.toLowerCase()}`,
  name: `${t.name} Policy`,
  description: "",
  typeId: t.id,
  days: t.defaultDays,
  carryForward: 0,
  approvalRequired: true,
  scope: "all",
  scopeValue: "",
  active: true,
  createdAt: "2026-10-23T00:00:00.000Z",
  updatedAt: "2026-10-23T00:00:00.000Z",
}));

/** A manual change to one person's balance for a year (e.g. days earned for weekend work). */
export interface HrLeaveAdjustment {
  id: string;
  employeeId: string;
  typeId: string;
  year: number;
  /** Positive adds days, negative removes them. */
  days: number;
  reason: string;
  byName: string;
  at: string;
}

export interface HrEmployee {
  id: string;
  staffNumber: string;
  firstName: string;
  lastName: string;
  /** Work email. */
  email: string;
  phone: string;
  jobTitle: string;
  /** Department name, kept in step with the department record (`departmentId`). */
  department: string;
  /** The department this person belongs to (chosen by them or by HR). */
  departmentId?: string;
  /** Duty station. */
  location: string;
  /** The employee this person reports to. */
  managerId: string | null;
  startDate: string;
  /** Active and probation are current staff (portal access); inactive and left (terminated) are not. */
  status: EmployeeStatus;
  /** Annual leave entitlement in working days. */
  /** No longer used: allowances come from leave types and policies. Kept on older records. */
  annualLeaveDays?: number;
  /** Optional, for the birthdays panel (HR only; the year is never shown). */
  dateOfBirth?: string;
  gender?: string;
  employmentType?: string;
  /** Salary account. Visible only to the person and to HR staff who manage records. */
  bankName?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  /** Test record from "Load sample data". */
  sample?: boolean;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * A department. Its head (director) and any extra approvers receive leave requests from the
 * department's staff, alongside each person's line manager.
 */
export interface HrDepartment {
  id: string;
  name: string;
  description: string;
  /** Director / head of department (an employee id). */
  headEmployeeId: string | null;
  /** Others who may approve this department's leave, e.g. a deputy. */
  approverIds: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/** LHI's departments as used on the website's vacancy forms; HR can add them in one step. */
export const STANDARD_DEPARTMENTS = [
  "Programmes",
  "Health & Nutrition",
  "Education",
  "Livelihood & Agriculture",
  "Protection & Gender",
  "MEAL",
  "Finance & Grants",
  "Human Resources & Administration",
  "Logistics & Procurement",
  "Safeguarding & Accountability",
  "Communications",
] as const;

export interface HrLeaveRequest {
  id: string;
  employeeId: string;
  /** Leave type id (see HrLeaveType). */
  type: string;
  startDate: string;
  endDate: string;
  /** Working days (Monday to Friday) in the range. */
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  createdAt: string;
  decidedByAccountId?: string;
  decidedByName?: string;
  decidedAt?: string;
  decisionNote?: string;
  /** Approved leave cancelled before it started, or called off by a recall before it started. */
  cancelledAt?: string;
  cancelledByName?: string;
  cancelReason?: string;
  /** Set when the leave was cut short; the dates and days above are then the leave actually taken. */
  originalEndDate?: string;
  originalDays?: number;
  /** How the leave ended early: the person came back early, or was recalled. */
  endedEarly?: { kind: "returned" | "recalled"; resumeDate: string; reason: string; byName: string; at: string };
  /** The person says they came back early; waits for their approver to confirm. */
  returnRequest?: { resumeDate: string; reason: string; at: string };
  /** The colleague covering this person's work while they're away. */
  relieverId?: string;
  /** The reliever's answer; the leave can only be approved once they've accepted. */
  relieverStatus?: "pending" | "accepted" | "declined";
  relieverRespondedAt?: string;
  relieverNote?: string;
  /** Test record from "Load sample data". */
  sample?: boolean;
}

export interface HrAuditEntry {
  id: string;
  at: string;
  actorAccountId: string;
  actorName: string;
  action: string;
  /** What was changed, e.g. "account amina@lhinigeria.org". */
  target: string;
  details: string;
}

/** Invite and password-reset links. Only a hash of the token is stored. */
export interface HrToken {
  id: string;
  tokenHash: string;
  accountId: string;
  purpose: "invite" | "reset";
  expiresAt: string;
  usedAt?: string;
}

export const EMPLOYEE_STATUSES = [
  { id: "active", label: "Active" },
  { id: "probation", label: "Probation" },
  { id: "inactive", label: "Inactive" },
  { id: "left", label: "Terminated" },
] as const;
export type EmployeeStatus = (typeof EMPLOYEE_STATUSES)[number]["id"];
export const isEmployeeStatus = (v: unknown): v is EmployeeStatus => EMPLOYEE_STATUSES.some((s) => s.id === v);
export const statusLabel = (s: EmployeeStatus) => EMPLOYEE_STATUSES.find((x) => x.id === s)?.label ?? s;

/** Current staff: active or on probation. Only they can use the portal or be chosen as managers and approvers. */
export const isCurrentStaff = (e: Pick<HrEmployee, "status"> | undefined | null) => e?.status === "active" || e?.status === "probation";

export const GENDERS = ["Female", "Male", "Prefer not to say"] as const;
export const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Fixed-term contract", "Consultancy", "Internship", "Volunteer"] as const;

export const employeeName = (e: Pick<HrEmployee, "firstName" | "lastName"> | undefined | null) =>
  e ? `${e.firstName} ${e.lastName}`.trim() : "Unknown employee";
