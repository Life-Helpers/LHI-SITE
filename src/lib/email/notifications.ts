import "server-only";

import { createHmac } from "node:crypto";

import { siteConfig } from "@/config/site";
import type { Submission, SubmissionType } from "@/lib/cms/schema";
import { SUBMISSION_TYPE_LABELS } from "@/lib/cms/schema";
import { readSecret, readSettings } from "@/lib/cms/store";
import { sendEmail } from "@/lib/email/send";
import { absoluteUrl } from "@/lib/email/template";

const firstName = (name: string) => (name.includes("@") ? "" : name.trim().split(/\s+/)[0] ?? "");
const greet = (name: string) => (firstName(name) ? `Hello ${firstName(name)},` : "Hello,");

/** Signed unsubscribe link, so nobody can unsubscribe someone else. */
export async function unsubscribeToken(email: string) {
  const key = await readSecret("unsubscribe_key", () => crypto.randomUUID() + crypto.randomUUID());
  return createHmac("sha256", key).update(email.trim().toLowerCase()).digest("base64url").slice(0, 32);
}

export async function unsubscribeUrl(email: string) {
  const e = email.trim().toLowerCase();
  return absoluteUrl(`/unsubscribe?e=${encodeURIComponent(e)}&t=${await unsubscribeToken(e)}`);
}

const ACKNOWLEDGEMENTS: Record<SubmissionType, (s: Submission) => { subject: string; heading: string; paragraphs: string[] }> = {
  contact: (s) => ({
    subject: "We've received your message",
    heading: "Thank you for contacting us.",
    paragraphs: [
      `Your message about "${s.subject}" has reached the ${siteConfig.shortName} team. We will reply as soon as we can.`,
      `To report a safeguarding concern confidentially, please email ${siteConfig.contact.pseaEmail} or call ${siteConfig.contact.feedbackLine} instead of replying to this email.`,
    ],
  }),
  volunteer: () => ({
    subject: "Thank you for offering to volunteer",
    heading: "Thank you for offering your time.",
    paragraphs: [
      "We have received your volunteer application. Our team will review it and contact you when there is a suitable opportunity near you.",
    ],
  }),
  "consortium-eoi": (s) => ({
    subject: "Your partnership request has been received",
    heading: "Thank you for reaching out to partner with us.",
    paragraphs: [`We have received your request (${s.subject}). Our partnerships team will review it and respond.`],
  }),
  "job-application": (s) => ({
    subject: `Application received: ${s.subject.replace(/^Application:\s*/, "")}`,
    heading: "Your application has been received.",
    paragraphs: [
      `Thank you for applying for ${s.subject.replace(/^Application:\s*/, "")}. Only shortlisted candidates will be contacted.`,
      "LHI never asks for money at any stage of recruitment. Please report any such request to us.",
    ],
  }),
  "vendor-registration": () => ({
    subject: "Vendor registration received",
    heading: "Thank you for registering as a vendor.",
    paragraphs: [
      "Your company details have been added to our vendor register. We will contact you when a suitable procurement opportunity comes up.",
      "LHI never charges fees for vendor registration or tenders.",
    ],
  }),
  "tender-response": (s) => ({
    subject: `Bid received: ${s.subject.replace(/^Bid:\s*/, "")}`,
    heading: "Your bid has been received.",
    paragraphs: [
      `Your submission for ${s.subject.replace(/^Bid:\s*/, "")} has been recorded. Bids are evaluated after the closing date and successful vendors will be contacted.`,
      "LHI never charges fees for tenders.",
    ],
  }),
  newsletter: () => ({
    subject: `Welcome to the ${siteConfig.name} newsletter`,
    heading: "Thank you for subscribing.",
    paragraphs: [
      "You will now receive news, stories, project magazines and reports from our work across Nigeria.",
      "You can unsubscribe at any time using the link at the bottom of every email.",
    ],
  }),
};

/** Acknowledge a form submission to the sender and alert the team. Never throws. */
export async function notifySubmission(submission: Submission) {
  try {
    const ack = ACKNOWLEDGEMENTS[submission.type](submission);
    await sendEmail({
      to: submission.email,
      subject: ack.subject,
      kind: "confirmation",
      content: {
        greeting: greet(submission.name),
        heading: ack.heading,
        paragraphs: ack.paragraphs,
        ...(submission.type === "newsletter"
          ? {
              cta: { label: "Read our latest stories", url: absoluteUrl("/news-updates") },
              footer: { text: "Don't want these emails?", url: await unsubscribeUrl(submission.email), linkLabel: "Unsubscribe" },
            }
          : {}),
      },
    });

    if (submission.type === "newsletter") return;
    const { engagement } = await readSettings();
    if (!engagement.alertEmail) return;
    await sendEmail({
      to: engagement.alertEmail,
      subject: `New ${SUBMISSION_TYPE_LABELS[submission.type].toLowerCase()}: ${submission.subject}`,
      kind: "team-alert",
      content: {
        heading: `New ${SUBMISSION_TYPE_LABELS[submission.type].toLowerCase()} submission`,
        paragraphs: [
          `${submission.name} <${submission.email}>${submission.organization ? ` — ${submission.organization}` : ""}`,
          submission.subject,
        ],
        cta: { label: "Open in admin", url: absoluteUrl(`/admin/submissions/${submission.id}`) },
      },
    });
  } catch (err) {
    console.error("[email] notifySubmission", err);
  }
}

/** Tell moderators a comment is waiting. */
export async function notifyPendingComment(input: { postTitle: string; name: string; body: string }) {
  try {
    const { engagement } = await readSettings();
    if (!engagement.alertEmail) return;
    await sendEmail({
      to: engagement.alertEmail,
      subject: `Comment awaiting approval: ${input.postTitle}`,
      kind: "team-alert",
      content: {
        heading: "A new comment is waiting for approval.",
        paragraphs: [`${input.name} on "${input.postTitle}":`, input.body.slice(0, 600)],
        cta: { label: "Moderate comments", url: absoluteUrl("/admin/comments") },
      },
    });
  } catch (err) {
    console.error("[email] notifyPendingComment", err);
  }
}

export async function sendCertificateEmail(input: { name: string; email: string; courseTitle: string; code: string }) {
  try {
    await sendEmail({
      to: input.email,
      subject: `Your certificate: ${input.courseTitle}`,
      kind: "certificate",
      content: {
        greeting: greet(input.name),
        heading: "Congratulations on completing your course.",
        paragraphs: [
          `You have completed ${input.courseTitle} with a score of 100%.`,
          `Your certificate code is ${input.code}. Anyone can confirm it on our verification page.`,
        ],
        cta: { label: "Verify or download your certificate", url: absoluteUrl(`/get-involved/training/verify/${encodeURIComponent(input.code)}`) },
      },
    });
  } catch (err) {
    console.error("[email] sendCertificateEmail", err);
  }
}

export async function sendPasswordResetEmail(input: { name: string; email: string; url: string; team: boolean }) {
  await sendEmail({
    to: input.email,
    subject: input.team ? "Reset your LHI team password" : "Reset your LHI training password",
    kind: "password-reset",
    wait: true,
    content: {
      greeting: greet(input.name),
      heading: "Reset your password",
      paragraphs: [
        "We received a request to reset your password. The link below works once and expires in one hour.",
        "If you didn't ask for this, you can ignore this email; your password won't change.",
      ],
      cta: { label: "Choose a new password", url: input.url },
    },
  });
}
