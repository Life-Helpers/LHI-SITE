import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/cms/private-uploads", () => ({ readPrivateUpload: async () => Buffer.from("") }));

const { calendarLink, interviewWhen, isFor } = await import("@/lib/recruitment/applications");

const interview = { at: "2026-11-18T10:00", minutes: 45, mode: "Video call" as const, where: "https://meet.example/abc", message: "", scheduledBy: "HR", scheduledAt: "", emailed: false };

describe("interviews", () => {
  it("writes the date as people read it, in Nigeria time", () => {
    expect(interviewWhen("2026-11-18T10:00")).toBe("Wednesday, 18 November 2026 at 10:00");
  });

  it("links to a Google Calendar event at the same Lagos time", () => {
    const q = new URL(calendarLink(interview, "Interview")).searchParams;
    expect(q.get("dates")).toBe("20261118T100000/20261118T104500");
    expect(q.get("ctz")).toBe("Africa/Lagos");
    expect(q.get("location")).toBe("https://meet.example/abc");
  });
});

describe("isFor", () => {
  const job = { id: "meal-officer", title: "MEAL Officer", reference: "LHI/HR/01" };
  const app = (extra: object) => ({ id: "1", type: "job-application", status: "new", name: "", email: "", subject: "", fields: {}, createdAt: "", ...extra }) as never;
  it("matches by vacancy id, or by title and reference for older applications", () => {
    expect(isFor(app({ jobId: "meal-officer" }), job)).toBe(true);
    expect(isFor(app({ jobId: "driver" }), job)).toBe(false);
    expect(isFor(app({ fields: { vacancy: "MEAL Officer", reference: "LHI/HR/01" } }), job)).toBe(true);
    expect(isFor(app({ fields: { vacancy: "MEAL Officer", reference: "LHI/HR/09" } }), job)).toBe(false);
    expect(isFor(app({ type: "contact", jobId: "meal-officer" }), job)).toBe(false);
  });
});
