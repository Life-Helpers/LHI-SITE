"use client";

import { useState } from "react";
import {
  Building2,
  Download,
  FileSpreadsheet,
  FileText,
  MapPin,
  Plus,
  Search,
  Tag,
  Trash2,
  UserCheck,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ContactCategory, ContactLifecycleStatus, CrmContact } from "@/types/admin";
import { exportCrmContacts } from "@/lib/admin-data";

interface AdminCrmContactsProps {
  contacts: CrmContact[];
  onAddContact: (contact: CrmContact) => void;
  onUpdateContactStatus: (id: string, newStatus: ContactLifecycleStatus) => void;
  onDeleteContact: (id: string) => void;
  onLogAudit: (action: string, target: string, category: "CRM" | "Export & Backup") => void;
}

const CATEGORIES: ContactCategory[] = [
  "Individual Donor",
  "Corporate Donor",
  "Institutional Partner",
  "Grant Officer",
  "Field Coordinator",
  "Volunteer",
  "Community Beneficiary",
];

const STATUSES: ContactLifecycleStatus[] = [
  "Inquired",
  "Engaged",
  "Committed",
  "Active Supporter",
  "Champion",
  "Inactive",
];

export function AdminCrmContacts({
  contacts,
  onAddContact,
  onUpdateContactStatus,
  onDeleteContact,
  onLogAudit,
}: AdminCrmContactsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedState, setSelectedState] = useState<string>("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeContactDetail, setActiveContactDetail] = useState<CrmContact | null>(null);

  // Form State for new contact
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formOrg, setFormOrg] = useState("");
  const [formCategory, setFormCategory] = useState<ContactCategory>("Individual Donor");
  const [formState, setFormState] = useState("Sokoto");
  const [formStatus, setFormStatus] = useState<ContactLifecycleStatus>("Active Supporter");
  const [formAmountNgn, setFormAmountNgn] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formTags, setFormTags] = useState("");

  // Filtering
  const statesList = ["All", ...Array.from(new Set(contacts.map((c) => c.state).filter(Boolean)))];

  const filteredContacts = contacts.filter((c) => {
    if (selectedCategory !== "All" && c.category !== selectedCategory) return false;
    if (selectedStatus !== "All" && c.status !== selectedStatus) return false;
    if (selectedState !== "All" && c.state !== selectedState) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.fullName.toLowerCase().includes(q);
      const matchEmail = c.email.toLowerCase().includes(q);
      const matchOrg = c.organization.toLowerCase().includes(q);
      const matchNotes = c.notes.toLowerCase().includes(q);
      const matchTags = c.tags.some((t) => t.toLowerCase().includes(q));
      return matchName || matchEmail || matchOrg || matchNotes || matchTags;
    }
    return true;
  });

  // Calculate Metrics
  const totalRaisedNgn = contacts.reduce((sum, c) => sum + c.totalContributionsNgn, 0);
  const totalRaisedUsd = contacts.reduce((sum, c) => sum + c.totalContributionsUsd, 0);
  const donorsCount = contacts.filter(
    (c) => c.category === "Individual Donor" || c.category === "Corporate Donor"
  ).length;
  const partnersCount = contacts.filter(
    (c) => c.category === "Institutional Partner" || c.category === "Grant Officer"
  ).length;

  function handleExport(format: "csv" | "json") {
    exportCrmContacts(filteredContacts, format);
    onLogAudit(
      `Exported CRM Contacts (${format.toUpperCase()})`,
      `${filteredContacts.length} contacts exported`,
      "Export & Backup"
    );
  }

  function handleSaveContact(e: React.FormEvent) {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) return;

    const newContact: CrmContact = {
      id: `ct-${Date.now().toString().slice(-4)}`,
      fullName: formName.trim(),
      email: formEmail.trim(),
      phone: formPhone.trim() || "+234 800 000 0000",
      organization: formOrg.trim() || "Independent Constituent",
      category: formCategory,
      state: formState,
      status: formStatus,
      totalContributionsNgn: Number(formAmountNgn) || 0,
      totalContributionsUsd: 0,
      lastInteractionDate: new Date().toISOString().split("T")[0],
      notes: formNotes.trim() || "Added via staff administration console.",
      tags: formTags
        ? formTags.split(",").map((t) => t.trim()).filter(Boolean)
        : ["CRM Added"],
      createdAt: new Date().toISOString().split("T")[0],
    };

    onAddContact(newContact);
    onLogAudit("Created New CRM Contact", `${newContact.fullName} (${newContact.category})`, "CRM");

    // Reset
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormOrg("");
    setFormAmountNgn("");
    setFormNotes("");
    setFormTags("");
    setIsAddModalOpen(false);
  }

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Constituents
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{contacts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Across 11 operational state offices</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Contributions (₦)
            </CardTitle>
            <span className="font-mono text-xs font-bold text-emerald-600">NGN</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              ₦{totalRaisedNgn.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              + ${totalRaisedUsd.toLocaleString()} USD international gifts
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Active Donors
            </CardTitle>
            <UserCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{donorsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Individual & corporate philanthropies</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Partners & Grants
            </CardTitle>
            <Building2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{partnersCount}</div>
            <p className="text-xs text-muted-foreground mt-1">UN agencies, ECHO, & State Ministries</p>
          </CardContent>
        </Card>
      </div>

      {/* Main CRM Workspace */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xl">Constituent Relationship Management (CRM)</CardTitle>
              <CardDescription>
                Unified directory of humanitarian partners, major donors, community leaders, and field volunteers
              </CardDescription>
            </div>

            {/* Action Buttons: Export CSV, Export JSON, Add Contact */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("csv")}
                className="h-8 gap-1.5 text-xs font-semibold"
                title="Export filtered contacts to CSV spreadsheet"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                Export CSV
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("json")}
                className="h-8 gap-1.5 text-xs font-semibold"
                title="Export filtered contacts to JSON backup"
              >
                <FileText className="h-3.5 w-3.5 text-blue-600" />
                Export JSON
              </Button>

              <Button
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
                className="h-8 gap-1.5 bg-primary text-xs font-semibold text-primary-foreground"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Contact
              </Button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search name, org, notes, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs h-9"
              />
            </div>

            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="All">All Categories ({contacts.length})</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="All">All Statuses</option>
                {STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {statesList.map((st) => (
                  <option key={st} value={st}>
                    State: {st}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground uppercase font-semibold text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="px-4 py-3">Constituent</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Lifecycle Status</th>
                  <th className="px-4 py-3 text-right">Contributions</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No constituents found matching your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-foreground">{contact.fullName}</div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <span>{contact.organization}</span>
                          <span>·</span>
                          <span className="font-mono">{contact.email}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                            contact.category.includes("Donor")
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                              : contact.category.includes("Partner") || contact.category.includes("Grant")
                              ? "bg-blue-500/15 text-blue-700 dark:text-blue-300"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {contact.category}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3 w-3 text-primary" />
                          {contact.state}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <select
                          value={contact.status}
                          onChange={(e) =>
                            onUpdateContactStatus(contact.id, e.target.value as ContactLifecycleStatus)
                          }
                          className="rounded border border-border bg-background px-2 py-1 text-[11px] font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="font-mono font-bold text-foreground">
                          {contact.totalContributionsNgn > 0
                            ? `₦${contact.totalContributionsNgn.toLocaleString()}`
                            : contact.totalContributionsUsd > 0
                            ? `$${contact.totalContributionsUsd.toLocaleString()}`
                            : "—"}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          Last: {contact.lastInteractionDate}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveContactDetail(contact)}
                            className="h-7 px-2 text-xs text-primary"
                          >
                            Details
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteContact(contact.id)}
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                            title="Remove contact"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Contact Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">Add New CRM Constituent</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-md p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="mt-4 space-y-4 text-xs">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block font-semibold text-foreground">Full Name *</label>
                  <Input
                    required
                    placeholder="e.g. Dr. Amina Bello"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-foreground">Email Address *</label>
                  <Input
                    type="email"
                    required
                    placeholder="e.g. amina.bello@example.org"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block font-semibold text-foreground">Phone Number</label>
                  <Input
                    placeholder="+234 800 000 0000"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-foreground">Organization / Group</label>
                  <Input
                    placeholder="e.g. Sokoto Health Cooperative"
                    value={formOrg}
                    onChange={(e) => setFormOrg(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block font-semibold text-foreground">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ContactCategory)}
                    className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs text-foreground"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-semibold text-foreground">Operational State</label>
                  <select
                    value={formState}
                    onChange={(e) => setFormState(e.target.value)}
                    className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs text-foreground"
                  >
                    {[
                      "Sokoto",
                      "Borno",
                      "Kebbi",
                      "Zamfara",
                      "Katsina",
                      "Kano",
                      "Adamawa",
                      "Yobe",
                      "Kaduna",
                      "Jigawa",
                      "FCT Abuja",
                    ].map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-semibold text-foreground">Lifecycle Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as ContactLifecycleStatus)}
                    className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs text-foreground"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-foreground">Total Initial Giving (₦ NGN)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formAmountNgn}
                  onChange={(e) => setFormAmountNgn(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-foreground">Tags (comma-separated)</label>
                <Input
                  placeholder="Nutrition, IDP Support, Major Donor"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-foreground">Administrative Notes</label>
                <textarea
                  rows={2}
                  placeholder="Engagement history, preferred contact channel, field notes..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full rounded-md border border-input bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-primary text-primary-foreground">
                  Save Contact
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact Detail Modal */}
      {activeContactDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">{activeContactDetail.fullName}</h3>
                <p className="text-xs text-muted-foreground">{activeContactDetail.organization}</p>
              </div>
              <button
                onClick={() => setActiveContactDetail(null)}
                className="rounded-md p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/40 p-3">
                <div>
                  <span className="text-[11px] text-muted-foreground block">Email</span>
                  <a href={`mailto:${activeContactDetail.email}`} className="font-semibold text-primary hover:underline">
                    {activeContactDetail.email}
                  </a>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block">Phone</span>
                  <span className="font-mono font-semibold text-foreground">{activeContactDetail.phone}</span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block">State / Region</span>
                  <span className="font-semibold text-foreground">{activeContactDetail.state}</span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block">Category</span>
                  <span className="font-semibold text-foreground">{activeContactDetail.category}</span>
                </div>
              </div>

              <div className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Cumulative Contributions:</span>
                  <span className="font-mono font-bold text-emerald-600 text-sm">
                    ₦{activeContactDetail.totalContributionsNgn.toLocaleString()} NGN
                  </span>
                </div>
                {activeContactDetail.totalContributionsUsd > 0 && (
                  <div className="flex items-center justify-between mt-1 text-[11px]">
                    <span className="text-muted-foreground">USD Donations:</span>
                    <span className="font-mono font-semibold text-foreground">
                      ${activeContactDetail.totalContributionsUsd.toLocaleString()} USD
                    </span>
                  </div>
                )}
              </div>

              <div>
                <span className="font-semibold text-foreground block mb-1">Engagement Notes:</span>
                <p className="rounded-lg bg-muted/20 border border-border p-2.5 text-muted-foreground leading-relaxed">
                  {activeContactDetail.notes}
                </p>
              </div>

              <div>
                <span className="font-semibold text-foreground block mb-1">Tags:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeContactDetail.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] text-primary"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-border pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  exportCrmContacts([activeContactDetail], "json");
                }}
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Export Single Record
              </Button>
              <Button size="sm" onClick={() => setActiveContactDetail(null)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
