"use client";

import { useState } from "react";
import {
  Building2,
  DollarSign,
  Download,
  HeartHandshake,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Trash2,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type CrmContact } from "@/lib/cms-crm-store";

export function AdminCrmSection({
  contacts,
  onAddContact,
  onUpdateContact,
  onDeleteContact,
}: {
  contacts: CrmContact[];
  onAddContact: (contact: CrmContact) => void;
  onUpdateContact: (contact: CrmContact) => void;
  onDeleteContact: (id: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedContact, setSelectedContact] = useState<CrmContact | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  // New contact form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newOrg, setNewOrg] = useState("");
  const [newCategory, setNewCategory] = useState<CrmContact["category"]>("Donor");
  const [newStatus] = useState<CrmContact["status"]>("Active");
  const [newStage, setNewStage] = useState<CrmContact["stage"]>("Engaged");
  const [newState, setNewState] = useState("Sokoto");
  const [newCountry] = useState("Nigeria");
  const [newNotes, setNewNotes] = useState("");

  // New donation form state
  const [donationAmount, setDonationAmount] = useState("");
  const [donationCampaign, setDonationCampaign] = useState("Tom Brown Nutrition");
  const [donationMethod, setDonationMethod] = useState("Bank Transfer");

  // Filtering
  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.state.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // KPI Calculations
  const totalRaised = contacts.reduce((sum, c) => sum + c.totalDonated, 0);
  const activeDonors = contacts.filter((c) => c.category === "Donor" && c.status !== "Inactive").length;
  const partnersCount = contacts.filter((c) => c.category === "Partner").length;
  const volunteersCount = contacts.filter((c) => c.category === "Volunteer").length;

  function handleCreateContact(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newContact: CrmContact = {
      id: `crm-${Date.now()}`,
      name: newName,
      email: newEmail,
      phone: newPhone || "+234 800 000 0000",
      organization: newOrg || "Independent Supporter",
      category: newCategory,
      status: newStatus,
      stage: newStage,
      state: newState,
      country: newCountry,
      totalDonated: 0,
      donationsCount: 0,
      lastInteraction: new Date().toISOString().split("T")[0],
      notes: newNotes,
      donations: [],
    };

    onAddContact(newContact);
    setIsAddModalOpen(false);
    // Reset
    setNewName("");
    setNewEmail("");
    setNewPhone("");
    setNewOrg("");
    setNewNotes("");
  }

  function handleAddDonation(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedContact || !donationAmount) return;

    const amount = parseFloat(donationAmount);
    if (isNaN(amount) || amount <= 0) return;

    const newDonation = {
      id: `don-${Date.now()}`,
      amount,
      currency: "NGN" as const,
      date: new Date().toISOString().split("T")[0],
      campaign: donationCampaign,
      paymentMethod: donationMethod,
      receiptNumber: `LHI-RCP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "Completed" as const,
    };

    const updatedContact: CrmContact = {
      ...selectedContact,
      totalDonated: selectedContact.totalDonated + amount,
      donationsCount: selectedContact.donationsCount + 1,
      lastInteraction: new Date().toISOString().split("T")[0],
      donations: [newDonation, ...selectedContact.donations],
    };

    onUpdateContact(updatedContact);
    setSelectedContact(updatedContact);
    setIsDonationModalOpen(false);
    setDonationAmount("");
  }

  function handleExportCsv() {
    const headers = "ID,Name,Email,Phone,Organization,Category,Status,Stage,State,TotalDonatedNGN,DonationsCount,LastInteraction\n";
    const rows = contacts
      .map(
        (c) =>
          `"${c.id}","${c.name}","${c.email}","${c.phone}","${c.organization}","${c.category}","${c.status}","${c.stage}","${c.state}",${c.totalDonated},${c.donationsCount},"${c.lastInteraction}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `LHI_CRM_Directory_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6">
      {/* KPI Stats Bar */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card/60 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Funds Raised
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">
              ₦{totalRaised.toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Across all humanitarian appeals & boreholes
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/60 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Active Donors
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <HeartHandshake className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">
              {activeDonors}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              High-value & recurring contributors
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/60 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Institutional Partners
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
              <Building2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">
              {partnersCount}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              UN Agencies, USAID & International NGOs
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/60 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Field Champions
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">
              {volunteersCount + 48}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Mobilized across Sokoto, Kebbi & Zamfara
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main CRM Header & Action Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            Constituent & Donor Directory
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage relationships, track donation receipts, and coordinate donor stewardship.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleExportCsv}
            variant="outline"
            size="sm"
            className="text-xs gap-1.5 border-border"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>

          <Button
            onClick={() => setIsAddModalOpen(true)}
            size="sm"
            className="text-xs gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Contact / Donor
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, organization, state, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["All", "Donor", "Partner", "Volunteer", "Government"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Contacts Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Name / Organization</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Stage & Status</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3 text-right">Total Donated</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No contacts found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="transition-colors hover:bg-muted/30 cursor-pointer"
                    onClick={() => setSelectedContact(contact)}
                  >
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-foreground">{contact.name}</div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                        <span>{contact.organization}</span>
                        <span>·</span>
                        <span className="text-primary/90">{contact.email}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          contact.category === "Donor"
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                            : contact.category === "Partner"
                            ? "bg-blue-500/15 text-blue-700 dark:text-blue-300"
                            : contact.category === "Volunteer"
                            ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                            : "bg-purple-500/15 text-purple-700 dark:text-purple-300"
                        }`}
                      >
                        {contact.category}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-medium text-foreground">{contact.stage}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {contact.status}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3 w-3 text-primary shrink-0" />
                        <span>{contact.state}, {contact.country}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-right font-mono font-bold text-foreground">
                      {contact.totalDonated > 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          ₦{contact.totalDonated.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedContact(contact);
                        }}
                        className="h-7 text-xs text-primary hover:text-primary hover:bg-primary/10"
                      >
                        View Profile
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONTACT DETAILS & DONATION LEDGER MODAL / DRAWER */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8">
            <button
              onClick={() => setSelectedContact(null)}
              className="absolute right-5 top-5 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-lg">
                {selectedContact.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-bold text-foreground">{selectedContact.name}</h3>
                  <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                    {selectedContact.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedContact.organization} · {selectedContact.state}, {selectedContact.country}
                </p>
              </div>
            </div>

            {/* Contact Details Grid */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-muted/30 p-4 text-xs border border-border">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{selectedContact.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{selectedContact.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-muted-foreground" />
                <span>Donor Stage: <strong>{selectedContact.stage}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                <span>Total Given: <strong className="text-emerald-600">₦{selectedContact.totalDonated.toLocaleString()}</strong></span>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-4">
              <Label className="text-xs font-semibold text-muted-foreground uppercase">Stewardship Notes</Label>
              <p className="mt-1 rounded-xl bg-card border border-border p-3 text-xs leading-relaxed text-foreground">
                {selectedContact.notes || "No notes recorded yet."}
              </p>
            </div>

            {/* Donations History */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-foreground">Donation Ledger & Receipts</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsDonationModalOpen(true)}
                  className="h-7 text-xs border-primary/30 text-primary hover:bg-primary/10"
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Log Donation
                </Button>
              </div>

              {selectedContact.donations.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                  No recorded donations for this contact.
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedContact.donations.map((don) => (
                    <div
                      key={don.id}
                      className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{don.campaign}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {don.date} · {don.paymentMethod} · Receipt: {don.receiptNumber}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-600 font-mono">
                          ₦{don.amount.toLocaleString()}
                        </span>
                        <span className="block text-[10px] text-muted-foreground">
                          {don.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm(`Remove ${selectedContact.name} from CRM?`)) {
                    onDeleteContact(selectedContact.id);
                    setSelectedContact(null);
                  }
                }}
                className="text-xs text-destructive hover:bg-destructive/10 border-destructive/30"
              >
                <Trash2 className="mr-1 h-3.5 w-3.5" />
                Delete Contact
              </Button>

              <Button
                size="sm"
                onClick={() => setSelectedContact(null)}
                className="text-xs"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW CONTACT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-foreground">Add New Contact / Donor</h3>
            <p className="text-xs text-muted-foreground">Register an individual, partner organization, or field contact.</p>

            <form onSubmit={handleCreateContact} className="mt-5 space-y-3.5">
              <div>
                <Label className="text-xs">Full Name *</Label>
                <Input
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Dr. Aminu Tambuwal"
                  className="mt-1 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Email Address *</Label>
                  <Input
                    required
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="contact@org.ng"
                    className="mt-1 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Phone Number</Label>
                  <Input
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+234 803 000 0000"
                    className="mt-1 text-xs"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs">Organization / Affiliation</Label>
                <Input
                  value={newOrg}
                  onChange={(e) => setNewOrg(e.target.value)}
                  placeholder="e.g. Northern Health Foundation"
                  className="mt-1 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs">Category</Label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as CrmContact["category"])}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                  >
                    <option value="Donor">Donor</option>
                    <option value="Partner">Partner</option>
                    <option value="Volunteer">Volunteer</option>
                    <option value="Beneficiary">Beneficiary</option>
                    <option value="Government">Government</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs">Stage</Label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value as CrmContact["stage"])}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                  >
                    <option value="Inquired">Inquired</option>
                    <option value="Engaged">Engaged</option>
                    <option value="Committed">Committed</option>
                    <option value="Active Supporter">Active Supporter</option>
                    <option value="Champion">Champion</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs">State / Base</Label>
                  <Input
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    placeholder="Sokoto"
                    className="mt-1 text-xs"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs">Relationship Notes</Label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Details regarding pledge, program interests, or liaison..."
                  className="mt-1 w-full rounded-md border border-input bg-background p-2.5 text-xs focus-visible:outline-ring"
                />
              </div>

              <div className="mt-6 flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Save Contact
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOG DONATION MODAL */}
      {isDonationModalOpen && selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <h3 className="text-base font-bold text-foreground">
              Log Donation for {selectedContact.name}
            </h3>
            <form onSubmit={handleAddDonation} className="mt-4 space-y-3 text-xs">
              <div>
                <Label className="text-xs">Donation Amount (NGN) *</Label>
                <Input
                  required
                  type="number"
                  min="1000"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder="e.g. 500000"
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs">Program / Campaign</Label>
                <select
                  value={donationCampaign}
                  onChange={(e) => setDonationCampaign(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                >
                  <option value="Tom Brown Nutrition">Tom Brown Nutrition</option>
                  <option value="NIDAKE Girl-Child Retention">NIDAKE Girl-Child Retention</option>
                  <option value="Solar WASH Boreholes">Solar WASH Boreholes</option>
                  <option value="Emergency Flood Response">Emergency Flood Response</option>
                  <option value="General Humanitarian Fund">General Humanitarian Fund</option>
                </select>
              </div>

              <div>
                <Label className="text-xs">Payment Channel</Label>
                <select
                  value={donationMethod}
                  onChange={(e) => setDonationMethod(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                >
                  <option value="Bank Transfer">Direct Bank Transfer</option>
                  <option value="Paystack / Card">Paystack / Debit Card</option>
                  <option value="SWIFT International Wire">SWIFT International Wire</option>
                  <option value="Cash / Cheque">Cheque / Institutional Draft</option>
                </select>
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDonationModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Confirm & Generate Receipt
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
