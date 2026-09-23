import { permanentRedirect } from "next/navigation";

/** News & newsletter now live on the blog. */
export default function Page() {
  permanentRedirect("/blog");
}
