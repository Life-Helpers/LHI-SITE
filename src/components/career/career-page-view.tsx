"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ShieldAlert,
  Send,
  Upload,
  X,
  UserCheck,
  FileText,
} from "lucide-react";
import { recentJobPostings, type JobPosting } from "@/data/careers-data";
import { siteConfig } from "@/config/site";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";

export function CareerPageView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");
  const [selectedState, setSelectedState] = useState<string>("All");
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  // Application Modal state
  const [applyingJob, setApplyingJob] = useState<JobPosting | null>(null);
  const [applicationSubmitting, setApplicationSubmitting] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [appReferenceCode, setAppReferenceCode] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    yearsExperience: "3-5",
    coverLetter: "",
    pseaAgreed: false,
    fileName: "",
  });

  const departments = [
    "All",
    "Health & Nutrition",
    "Protection & PSEA",
    "Programs & M&E",
    "Operations & Finance",
  ];

  const states = [
    "All",
    "Borno State",
    "Yobe State",
    "Sokoto State",
    "Katsina State",
    "Bauchi State",
    "Federal Capital Territory / Borno",
  ];

  const filteredJobs = useMemo(() => {
    return recentJobPostings.filter((job) => {
      const matchesDept =
        selectedDepartment === "All" || job.department === selectedDepartment;
      const matchesState =
        selectedState === "All" || job.state.includes(selectedState.replace(" State", ""));

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        job.title.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.summary.toLowerCase().includes(query) ||
        job.department.toLowerCase().includes(query);

      return matchesDept && matchesState && matchesSearch;
    });
  }, [searchQuery, selectedDepartment, selectedState]);

  const handleApplyClick = (job: JobPosting) => {
    setApplyingJob(job);
    setApplicationSuccess(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, fileName: e.target.files![0].name }));
    }
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pseaAgreed) {
      alert("Please accept the PSEA & Safeguarding compliance commitment to proceed.");
      return;
    }
    setApplicationSubmitting(true);
    // Simulate brief upload & server processing
    await new Promise((r) => setTimeout(r, 800));
    setApplicationSubmitting(false);
    const ref = `LHI-REC-${Math.floor(100000 + Math.random() * 900000)}`;
    setAppReferenceCode(ref);
    setApplicationSuccess(true);
  };

  const resetApplicationForm = () => {
    setApplyingJob(null);
    setApplicationSuccess(false);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      location: "",
      yearsExperience: "3-5",
      coverLetter: "",
      pseaAgreed: false,
      fileName: "",
    });
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden border-b border-border bg-muted py-20 sm:py-28">
        <Image
          src={africanFulfillmentImages.careersHero.src}
          alt={africanFulfillmentImages.careersHero.alt}
          fill
          priority
          sizes="100vw"
          referrerPolicy="no-referrer"
          className="object-cover object-center brightness-[0.35] dark:brightness-[0.22]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-primary-foreground backdrop-blur-md">
            Join Our Humanitarian Mission
          </span>
          <h1 className="mt-4 font-serif-display text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white">
            Careers at <span className="italic text-primary font-serif">Life Helpers Initiative</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-zinc-200 leading-relaxed">
            Putting a smile on faces across 11 Nigerian states. Discover meaningful opportunities in public health, emergency protection, nutrition, WASH, logistics, and education.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-300">
            <span className="flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-emerald-400" />
              Equal Opportunity Employer
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4 text-amber-400" />
              Zero Tolerance for SEA (PSEA)
            </span>
            <span>•</span>
            <span>Female candidates strongly encouraged</span>
          </div>
        </div>
      </section>

      {/* Main Jobs Section */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Controls: Search and Filters */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search job titles, locations, departments, or keywords (e.g. Nutrition, Sokoto, M&E)..."
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Department Filter Pills */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Filter by Department:
              </label>
              <div className="flex flex-wrap gap-2">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => setSelectedDepartment(dept)}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      selectedDepartment === dept
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-border"
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Selector */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border/60 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-semibold text-foreground">Location Filter:</span>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  {states.map((s) => (
                    <option key={s} value={s}>
                      {s === "All" ? "All Field Locations" : s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-muted-foreground">
                Showing <strong className="text-foreground">{filteredJobs.length}</strong> available position{filteredJobs.length === 1 ? "" : "s"}
              </div>
            </div>
          </div>

          {/* Jobs Listing */}
          <div className="mt-8 space-y-4">
            {filteredJobs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center">
                <Briefcase className="mx-auto h-10 w-10 text-muted-foreground/60" />
                <h3 className="mt-3 text-base font-bold text-foreground">
                  No positions match your search criteria
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Try clearing some filters or sending your general CV to{" "}
                  <a
                    href={`mailto:${siteConfig.contact.recruitmentEmail}`}
                    className="font-bold text-primary underline"
                  >
                    {siteConfig.contact.recruitmentEmail}
                  </a>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedDepartment("All");
                    setSelectedState("All");
                  }}
                  className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const isExpanded = expandedJobId === job.id;
                return (
                  <div
                    key={job.id}
                    className="rounded-2xl border border-border bg-card shadow-xs transition-all hover:border-primary/40"
                  >
                    {/* Header Row */}
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary uppercase">
                              {job.department}
                            </span>
                            <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                              {job.type}
                            </span>
                            <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                              {job.slots} Open Slot{job.slots > 1 ? "s" : ""}
                            </span>
                          </div>

                          <h3 className="text-lg sm:text-xl font-bold text-foreground">
                            {job.title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1 text-foreground font-medium">
                              <MapPin className="h-3.5 w-3.5 text-primary" />
                              {job.location} ({job.state})
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-3.5 w-3.5" />
                              {job.experienceLevel}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              Deadline: {job.deadline}
                            </span>
                          </div>

                          <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {job.summary}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-2 sm:pt-0">
                          <button
                            type="button"
                            onClick={() => handleApplyClick(job)}
                            className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors flex items-center gap-1.5"
                          >
                            <span>Apply Now</span>
                            <Send className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedJobId(isExpanded ? null : job.id)
                            }
                            className="inline-flex items-center gap-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                          >
                            <span>{isExpanded ? "Hide Details" : "View Details"}</span>
                            {isExpanded ? (
                              <ChevronUp className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Job Details */}
                      {isExpanded && (
                        <div className="mt-6 border-t border-border pt-6 space-y-5 animate-in fade-in duration-200">
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                              Key Duties & Responsibilities:
                            </h4>
                            <ul className="mt-2.5 space-y-1.5 pl-4 text-xs text-muted-foreground list-disc marker:text-primary">
                              {job.responsibilities.map((resp, i) => (
                                <li key={i}>{resp}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                              Qualifications & Experience Requirements:
                            </h4>
                            <ul className="mt-2.5 space-y-1.5 pl-4 text-xs text-muted-foreground list-disc marker:text-primary">
                              {job.requirements.map((req, i) => (
                                <li key={i}>{req}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="rounded-xl border border-border/80 bg-muted/30 p-3.5 text-xs text-muted-foreground flex items-center justify-between flex-wrap gap-2">
                            <span>
                              Questions about this vacancy? Write to{" "}
                              <a
                                href={`mailto:${siteConfig.contact.recruitmentEmail}?subject=${encodeURIComponent(
                                  `Inquiry: ${job.title} - ${job.id}`
                                )}`}
                                className="font-semibold text-primary underline"
                              >
                                {siteConfig.contact.recruitmentEmail}
                              </a>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleApplyClick(job)}
                              className="font-bold text-primary hover:underline"
                            >
                              Open Application Form &rarr;
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Safeguarding & PSEA Mandatory Statement */}
          <div className="mt-12 rounded-2xl border border-red-500/30 bg-red-500/5 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <ShieldAlert className="h-6 w-6 text-red-600 dark:text-red-400 shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="text-base font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">
                  Protection Against Sexual Exploitation and Abuse (PSEA) & Child Safeguarding
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Life Helpers Initiative maintains a strict zero-tolerance policy against any form of sexual exploitation, abuse, child labor, or harassment. All recruitment processes include rigorous background checks, referee verifications, and police clearance endorsements.
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  LHI is committed to equal employment opportunities regardless of gender, religion, ethnicity, or disability. Female candidates and qualified persons with disabilities are strongly encouraged to apply.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Modal */}
      {applyingJob && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
        >
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={resetApplicationForm}
              className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            {applicationSuccess ? (
              <div className="py-6 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Application Submitted Successfully!
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{formData.fullName}</strong>. Your application for <strong>{applyingJob.title}</strong> has been logged in our HR recruitment database.
                </p>
                <div className="rounded-xl border border-border bg-muted/40 p-3 text-xs">
                  <span className="text-muted-foreground">Tracking Reference:</span>
                  <div className="font-mono text-base font-bold text-primary mt-0.5">
                    {appReferenceCode}
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Shortlisted candidates will be contacted via email or phone for screening interviews.
                </p>
                <button
                  type="button"
                  onClick={resetApplicationForm}
                  className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Close & View More Jobs
                </button>
              </div>
            ) : (
              <div>
                <div className="border-b border-border pb-4">
                  <span className="text-[11px] font-semibold text-primary uppercase">
                    Application Form
                  </span>
                  <h3 className="text-lg font-bold text-foreground">
                    {applyingJob.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Location: {applyingJob.location} • {applyingJob.state}
                  </p>
                </div>

                <form onSubmit={handleApplicationSubmit} className="mt-4 space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-foreground mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      placeholder="e.g. Aisha Bello / Ibrahim Sani"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-foreground mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="yourname@gmail.com"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-foreground mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+234 800 000 0000"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-foreground mb-1">
                        Current Residential City/State *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        placeholder="e.g. Maiduguri, Borno"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-foreground mb-1">
                        Years of Humanitarian Experience
                      </label>
                      <select
                        value={formData.yearsExperience}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            yearsExperience: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                      >
                        <option value="1-2">1 - 2 Years</option>
                        <option value="3-5">3 - 5 Years</option>
                        <option value="6-10">6 - 10 Years</option>
                        <option value="10+">10+ Years</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-foreground mb-1">
                      Upload CV / Resume (PDF or DOCX) *
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer rounded-lg border border-dashed border-border bg-muted/40 px-4 py-2 hover:bg-muted text-xs font-semibold text-foreground flex items-center gap-2">
                        <Upload className="h-3.5 w-3.5 text-primary" />
                        <span>Choose File</span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="hidden"
                          required={!formData.fileName}
                        />
                      </label>
                      <span className="text-muted-foreground truncate max-w-xs">
                        {formData.fileName ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                            <FileText className="h-3.5 w-3.5" />
                            {formData.fileName}
                          </span>
                        ) : (
                          "No file chosen (PDF, max 5MB)"
                        )}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-foreground mb-1">
                      Brief Motivation / Cover Note
                    </label>
                    <textarea
                      rows={3}
                      value={formData.coverLetter}
                      onChange={(e) =>
                        setFormData({ ...formData, coverLetter: e.target.value })
                      }
                      placeholder="Briefly state your relevant humanitarian background and why you are interested in this position..."
                      className="w-full rounded-lg border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  {/* PSEA Safeguarding Acknowledgment */}
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={formData.pseaAgreed}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pseaAgreed: e.target.checked,
                          })
                        }
                        className="mt-0.5 rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-[11px] leading-relaxed text-muted-foreground">
                        <strong className="text-foreground">PSEA & Safeguarding Declaration:</strong> I certify that I have never been implicated in, investigated for, or sanctioned regarding sexual exploitation, abuse, or child safeguarding violations, and I agree to strictly abide by Life Helpers Initiative&apos;s Zero Tolerance Code of Conduct.
                      </span>
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-border">
                    <button
                      type="button"
                      onClick={resetApplicationForm}
                      className="rounded-lg border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={applicationSubmitting}
                      className="rounded-lg bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
                    >
                      {applicationSubmitting ? (
                        <span>Submitting Application...</span>
                      ) : (
                        <>
                          <span>Submit Application</span>
                          <Send className="h-3 w-3" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
