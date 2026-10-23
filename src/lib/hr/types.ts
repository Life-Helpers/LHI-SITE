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
      { id: "audit.view", label: "View audit trail", help: "See the record of account, role and permission changes." },
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
    description: "Everything, including portal accounts, roles, permissions and the audit trail.",
    permissions: [...ALL_HR_PERMISSIONS],
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
  createdAt: string;
  createdBy: string;
  lastLoginAt?: string;
  deactivatedAt?: string;
}

export const LEAVE_TYPES = ["Annual", "Sick", "Compassionate", "Maternity", "Paternity", "Study", "Unpaid", "Other"] as const;
export type LeaveType = (typeof LEAVE_TYPES)[number];

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
  annualLeaveDays: number;
  /** Optional, for the birthdays panel (HR only; the year is never shown). */
  dateOfBirth?: string;
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
  type: LeaveType;
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

export const employeeName = (e: Pick<HrEmployee, "firstName" | "lastName"> | undefined | null) =>
  e ? `${e.firstName} ${e.lastName}`.trim() : "Unknown employee";
