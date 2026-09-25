import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const put = vi.fn();
const del = vi.fn().mockResolvedValue(undefined);
const head = vi.fn();
const get = vi.fn();
vi.mock("@vercel/blob", () => ({ put, del, head, get }));

describe("file storage with Vercel Blob", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("stores uploads and private files as private blobs under fixed names", async () => {
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "token");
    const { putFile } = await import("./files");
    await putFile("uploads/photo-1a2b3c4d.jpg", Buffer.from("x"), "image/jpeg");
    await putFile("private/cvs/abc.pdf", Buffer.from("x"), "application/pdf");
    expect(put).toHaveBeenCalledTimes(2);
    expect(put.mock.calls[0][0]).toBe("uploads/photo-1a2b3c4d.jpg");
    expect(put.mock.calls[0][2]).toMatchObject({ access: "private", addRandomSuffix: false, contentType: "image/jpeg" });
    expect(put.mock.calls[1][0]).toBe("private/cvs/abc.pdf");
  });

  it("refuses paths outside uploads/ and private/", async () => {
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "token");
    const { putFile } = await import("./files");
    await expect(putFile("../secrets.json", Buffer.from("x"), "text/plain")).rejects.toThrow("Invalid file key");
    await expect(putFile("settings.json", Buffer.from("x"), "text/plain")).rejects.toThrow("Invalid file key");
    expect(put).not.toHaveBeenCalled();
  });

  it("reports missing files as null and reads byte ranges", async () => {
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "token");
    const { fileInfo, readFileRange } = await import("./files");
    head.mockRejectedValueOnce(new Error("not found"));
    expect(await fileInfo("uploads/missing-00000000.jpg")).toBeNull();
    head.mockResolvedValueOnce({ size: 10, etag: "abc", uploadedAt: new Date("2026-01-01") });
    expect(await fileInfo("uploads/a-00000000.jpg")).toMatchObject({ size: 10, etag: '"abc"' });
    get.mockResolvedValueOnce({ stream: new ReadableStream() });
    await readFileRange("uploads/a-00000000.jpg", 0, 4);
    expect(get.mock.calls[0][1]).toMatchObject({ access: "private", headers: { Range: "bytes=0-4" } });
  });
});
