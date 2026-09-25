import { tmpdir } from "node:os";
import path from "node:path";

/**
 * CMS_DATA_DIR when set; on Vercel (read-only project folder) the writable temp folder, which
 * is fine for previews but is wiped regularly; otherwise ./cms-data next to the app.
 */
export const DATA_DIR = process.env.CMS_DATA_DIR?.trim()
  ? path.resolve(process.env.CMS_DATA_DIR.trim())
  : process.env.VERCEL
    ? path.join(tmpdir(), "lhi-cms-data")
    : path.join(process.cwd(), "cms-data");

export const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
