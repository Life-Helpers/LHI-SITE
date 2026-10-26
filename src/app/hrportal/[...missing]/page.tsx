import { notFound } from "next/navigation";

/** Any unknown address under /hrportal shows the portal's own "not found" page. */
export default function MissingHrPage() {
  notFound();
}
