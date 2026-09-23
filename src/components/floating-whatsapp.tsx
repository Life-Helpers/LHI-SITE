"use client";

import { useState, useEffect } from "react";
import { siWhatsapp } from "simple-icons";
import { MessageCircle, ShieldAlert, X, Phone, Mail, CheckCircle2, ChevronRight, ExternalLink } from "lucide-react";
import { siteConfig } from "@/config/site";

export function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "psea">("general");

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const cleanPhone = siteConfig.contact.feedbackLine.replace(/[^0-9]/g, "");

  const generalWhatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    "Hello Life Helpers Initiative, I would like to make an enquiry regarding your programs, activities, or partnerships."
  )}`;

  const pseaWhatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    "CONFIDENTIAL SAFEGUARDING / PSEA REPORT: I would like to report a protection, safeguarding, or abuse matter in strict confidence to Life Helpers Initiative."
  )}`;

  return (
    <aside aria-label="WhatsApp and Confidential Safeguarding Hotline" className="fixed bottom-5 right-5 z-50">
      {/* Popover Card */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="whatsapp-dialog-title"
          className="mb-3 w-[min(92vw,380px)] rounded-2xl border border-border bg-card text-card-foreground shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl bg-emerald-600 px-4 py-3.5 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
                <MessageCircle className="h-6 w-6 fill-white text-emerald-600" />
              </div>
              <div>
                <h2 id="whatsapp-dialog-title" className="text-sm font-bold leading-tight">Life Helpers Initiative</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-200"></span>
                  </span>
                  <span className="text-[11px] font-medium text-emerald-100">Helpdesk & PSEA Hotline</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Close WhatsApp options"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-border bg-muted/30 p-1.5 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={`flex-1 rounded-lg py-2 font-medium transition-all ${
                activeTab === "general"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              General Chat
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("psea")}
              className={`flex-1 rounded-lg py-2 font-medium transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "psea"
                  ? "bg-red-500/10 text-red-700 dark:text-red-400 shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              Report Abuse (PSEA)
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4">
            {activeTab === "general" ? (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Connect instantly with our humanitarian communications and field liaison desk.
                </p>

                <a
                  href={generalWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="h-4 w-4 shrink-0" />
                    <span>Chat on WhatsApp</span>
                  </div>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>

                <div className="pt-2 border-t border-border/60 space-y-2 text-[11px]">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Phone:</span>
                    <a href={`tel:${cleanPhone}`} className="font-semibold text-foreground hover:text-primary">
                      {siteConfig.contact.feedbackLine}
                    </a>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Email:</span>
                    <a href={`mailto:${siteConfig.contact.email}`} className="font-semibold text-foreground hover:text-primary">
                      {siteConfig.contact.email}
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
                  <div className="flex items-start gap-2">
                    <ShieldAlert className="h-4 w-4 shrink-0 text-red-700 dark:text-red-400 mt-0.5" />
                    <div>
                      <h3 className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wide">
                        Confidential PSEA Reporting
                      </h3>
                      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                        Protection from Sexual Exploitation, Abuse and Harassment (PSEAH). You have the right to report any concern safely, securely, and anonymously.
                      </p>
                    </div>
                  </div>
                </div>

                <a
                  href={pseaWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-xl bg-red-600 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition-all shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 shrink-0" />
                    <span>Send Confidential WhatsApp Report</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                </a>

                <div className="rounded-xl border border-border bg-muted/40 p-2.5 space-y-2 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Phone className="h-3 w-3 text-red-500" />
                      Hotline:
                    </span>
                    <a href={`tel:${cleanPhone}`} className="font-bold text-foreground hover:underline">
                      {siteConfig.contact.feedbackLine}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Mail className="h-3 w-3 text-red-500" />
                      PSEA Email:
                    </span>
                    <a href={`mailto:psea@lhinigeria.org`} className="font-bold text-foreground hover:underline">
                      psea@lhinigeria.org
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>Strict zero-tolerance policy. Survivor-centered support.</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="rounded-b-2xl border-t border-border bg-muted/20 px-4 py-2 text-center text-[10px] text-muted-foreground">
            LHI PSEA & Accountability to Affected Populations (AAP)
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        type="button"
        id="floating-whatsapp-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative isolate flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-[#25D366] text-white opacity-100 shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all hover:scale-105 hover:bg-[#1ebe5b] active:scale-95 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-emerald-500 dark:border-[#25D366]"
        aria-label="Open WhatsApp Chat and PSEA abuse reporting options"
        aria-expanded={isOpen}
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] font-bold text-white items-center justify-center">
            !
          </span>
        </span>
        {isOpen ? (
          <X className="h-7 w-7" />
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7" fill="#ffffff">
            <path d={siWhatsapp.path} />
          </svg>
        )}
      </button>
    </aside>
  );
}
