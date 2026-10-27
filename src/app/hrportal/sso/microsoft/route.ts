import { cookies } from "next/headers";

import { sessionKey, sign } from "@/lib/cms/auth";
import { authorizeUrl, callbackUrl, microsoftConfig, MS_FLOW_COOKIE, newSignInSecrets } from "@/lib/hr/microsoft-sso";

export const dynamic = "force-dynamic";

/** "Sign in with Microsoft": off to Microsoft's sign-in page for LHI's tenant. */
export async function GET(req: Request) {
  const cfg = microsoftConfig();
  if (!cfg) return new Response("Not found", { status: 404 });
  const secrets = newSignInSecrets();
  const redirectUri = callbackUrl(req, cfg.redirectUri);
  const payload = Buffer.from(JSON.stringify({ state: secrets.state, nonce: secrets.nonce, verifier: secrets.verifier, exp: Date.now() + 10 * 60_000 })).toString("base64url");
  (await cookies()).set(MS_FLOW_COOKIE, `${payload}.${sign(`hr-ms.${payload}`, await sessionKey())}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // Lax so the cookie comes back on Microsoft's redirect to the callback.
    sameSite: "lax",
    path: "/hrportal/sso/microsoft",
    maxAge: 600,
  });
  return Response.redirect(authorizeUrl(cfg, { redirectUri, state: secrets.state, nonce: secrets.nonce, challenge: secrets.challenge }), 302);
}
