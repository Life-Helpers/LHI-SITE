/**
 * "Sign in with Microsoft" for the HR portal: LHI staff use their work Microsoft 365 account
 * (Microsoft Entra ID) instead of a portal password. Standard OpenID Connect authorization-code
 * flow with PKCE. Microsoft's signed ID token is checked here with Node's own crypto: signature
 * against Microsoft's published keys, LHI's tenant, this app, expiry and the one-time nonce.
 *
 * Only people HR has already given a portal account can get in: the token's email must match an
 * active account. Signing in with Microsoft never creates an account or changes anyone's role.
 *
 * Switched on by three environment variables (from the app registration in Microsoft Entra):
 * HR_MS_TENANT_ID (the directory/tenant ID), HR_MS_CLIENT_ID (application ID) and
 * HR_MS_CLIENT_SECRET. Optional HR_MS_REDIRECT_URI if the site sits behind a proxy that hides
 * its public address.
 */
import { createHash, createPublicKey, randomBytes, verify, type JsonWebKey } from "node:crypto";

export interface MicrosoftConfig {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  redirectUri?: string;
  /** Microsoft's sign-in service. Only automated tests point this at a stand-in. */
  authority: string;
}

const GUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** The settings, or null when Microsoft sign-in isn't set up (the button is then hidden). */
export function microsoftConfig(env: Record<string, string | undefined> = process.env): MicrosoftConfig | null {
  const tenantId = env.HR_MS_TENANT_ID?.trim().toLowerCase();
  const clientId = env.HR_MS_CLIENT_ID?.trim().toLowerCase();
  const clientSecret = env.HR_MS_CLIENT_SECRET?.trim();
  // The tenant must be LHI's directory ID (not "common"), so only LHI's own Microsoft accounts work.
  if (!tenantId || !clientId || !clientSecret || !GUID.test(tenantId) || !GUID.test(clientId)) return null;
  return {
    tenantId,
    clientId,
    clientSecret,
    redirectUri: env.HR_MS_REDIRECT_URI?.trim() || undefined,
    authority: (env.HR_MS_AUTHORITY?.trim() || "https://login.microsoftonline.com").replace(/\/$/, ""),
  };
}

/** The cookie that carries one sign-in's secrets from the start to the callback (signed, 10 minutes). */
export const MS_FLOW_COOKIE = "lhi_hr_ms";

/** Where Microsoft sends people back: the configured address, or this site's own. */
export const callbackUrl = (req: Request, configured?: string) => configured ?? new URL("/hrportal/sso/microsoft/callback", req.url).toString();

const b64url = (buf: Buffer) => buf.toString("base64url");

/** A fresh PKCE verifier and its S256 challenge, plus the state and nonce for one sign-in. */
export function newSignInSecrets() {
  const verifier = b64url(randomBytes(32));
  return {
    verifier,
    challenge: b64url(createHash("sha256").update(verifier).digest()),
    state: b64url(randomBytes(16)),
    nonce: b64url(randomBytes(16)),
  };
}

export function authorizeUrl(cfg: MicrosoftConfig, p: { redirectUri: string; state: string; nonce: string; challenge: string }): string {
  const url = new URL(`${cfg.authority}/${cfg.tenantId}/oauth2/v2.0/authorize`);
  url.search = new URLSearchParams({
    client_id: cfg.clientId,
    response_type: "code",
    redirect_uri: p.redirectUri,
    response_mode: "query",
    scope: "openid profile email",
    state: p.state,
    nonce: p.nonce,
    code_challenge: p.challenge,
    code_challenge_method: "S256",
    prompt: "select_account",
  }).toString();
  return url.toString();
}

/** Swap the one-time code from Microsoft for the person's ID token. */
export async function exchangeCode(cfg: MicrosoftConfig, p: { code: string; redirectUri: string; verifier: string }, fetchImpl: typeof fetch = fetch): Promise<string> {
  const res = await fetchImpl(`${cfg.authority}/${cfg.tenantId}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
      grant_type: "authorization_code",
      code: p.code,
      redirect_uri: p.redirectUri,
      code_verifier: p.verifier,
      scope: "openid profile email",
    }),
  });
  const body = (await res.json().catch(() => ({}))) as { id_token?: string; error?: string; error_description?: string };
  if (!res.ok || !body.id_token) throw new Error(`token exchange failed: ${body.error ?? res.status} ${body.error_description?.split("\n")[0] ?? ""}`.trim());
  return body.id_token;
}

let keyCache: { tenantId: string; keys: JsonWebKey[]; until: number } | null = null;

/** Microsoft's current signing keys for the tenant (cached for an hour; refetched on an unknown key). */
export async function microsoftKeys(cfg: MicrosoftConfig, { refresh = false, fetchImpl = fetch }: { refresh?: boolean; fetchImpl?: typeof fetch } = {}): Promise<JsonWebKey[]> {
  if (!refresh && keyCache && keyCache.tenantId === cfg.tenantId && keyCache.until > Date.now()) return keyCache.keys;
  const res = await fetchImpl(`${cfg.authority}/${cfg.tenantId}/discovery/v2.0/keys`);
  if (!res.ok) throw new Error(`could not fetch Microsoft signing keys: ${res.status}`);
  const { keys } = (await res.json()) as { keys: JsonWebKey[] };
  keyCache = { tenantId: cfg.tenantId, keys, until: Date.now() + 3600_000 };
  return keys;
}

export interface MicrosoftIdentity {
  email: string;
  name: string;
  /** The person's permanent object id in LHI's directory. */
  oid: string;
}

/** The key id an ID token was signed with (to refetch keys when Microsoft rotates them). */
export function tokenKeyId(token: string): string | undefined {
  try {
    return (JSON.parse(Buffer.from(token.split(".")[0], "base64url").toString()) as { kid?: string }).kid;
  } catch {
    return undefined;
  }
}

/**
 * Check an ID token and return who it's for. Throws with the reason when anything is off: wrong
 * algorithm or key, bad signature, another tenant or app, expired, or a nonce that doesn't match.
 */
export function verifyIdToken(
  token: string,
  keys: JsonWebKey[],
  expect: { tenantId: string; clientId: string; nonce: string; now?: number; authority?: string },
): MicrosoftIdentity {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("not a JWT");
  const [h, p, sig] = parts;
  const header = JSON.parse(Buffer.from(h, "base64url").toString()) as { alg?: string; kid?: string };
  if (header.alg !== "RS256") throw new Error(`unexpected algorithm ${header.alg}`);
  const jwk = keys.find((k) => (k as { kid?: string }).kid === header.kid);
  if (!jwk) throw new Error("unknown signing key");
  const ok = verify("RSA-SHA256", Buffer.from(`${h}.${p}`), createPublicKey({ key: jwk, format: "jwk" }), Buffer.from(sig, "base64url"));
  if (!ok) throw new Error("bad signature");
  const c = JSON.parse(Buffer.from(p, "base64url").toString()) as Record<string, unknown>;
  const now = expect.now ?? Math.floor(Date.now() / 1000);
  const skew = 300;
  if (c.iss !== `${expect.authority ?? "https://login.microsoftonline.com"}/${expect.tenantId}/v2.0`) throw new Error("issued by another tenant");
  if (String(c.tid).toLowerCase() !== expect.tenantId) throw new Error("another tenant");
  if (c.aud !== expect.clientId) throw new Error("issued for another app");
  if (typeof c.exp !== "number" || c.exp < now - skew) throw new Error("expired");
  if (typeof c.nbf === "number" && c.nbf > now + skew) throw new Error("not valid yet");
  if (c.nonce !== expect.nonce) throw new Error("nonce mismatch");
  const email = String(c.email ?? c.preferred_username ?? c.upn ?? "").trim().toLowerCase();
  if (!email.includes("@")) throw new Error("no email in token");
  return { email, name: String(c.name ?? ""), oid: String(c.oid ?? "") };
}
