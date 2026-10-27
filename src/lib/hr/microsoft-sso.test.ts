import { generateKeyPairSync, sign, type JsonWebKey } from "node:crypto";

import { describe, expect, it } from "vitest";

import { authorizeUrl, microsoftConfig, newSignInSecrets, verifyIdToken } from "@/lib/hr/microsoft-sso";

const TENANT = "11111111-2222-3333-4444-555555555555";
const CLIENT = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";
const NOW = 1_800_000_000;

// A stand-in for Microsoft's signing key, and one an attacker might use.
const microsoft = generateKeyPairSync("rsa", { modulusLength: 2048 });
const attacker = generateKeyPairSync("rsa", { modulusLength: 2048 });
const jwks: JsonWebKey[] = [{ ...microsoft.publicKey.export({ format: "jwk" }), kid: "k1", use: "sig" } as JsonWebKey];

const b64 = (o: unknown) => Buffer.from(JSON.stringify(o)).toString("base64url");
function idToken(claims: Record<string, unknown> = {}, { key = microsoft.privateKey, kid = "k1", alg = "RS256" } = {}) {
  const head = b64({ alg, kid, typ: "JWT" });
  const body = b64({
    iss: `https://login.microsoftonline.com/${TENANT}/v2.0`,
    tid: TENANT,
    aud: CLIENT,
    exp: NOW + 3600,
    nbf: NOW - 10,
    iat: NOW - 10,
    nonce: "n-123",
    preferred_username: "Amina.Bello@LHInigeria.org",
    name: "Amina Bello",
    oid: "oid-1",
    ...claims,
  });
  return `${head}.${body}.${sign("RSA-SHA256", Buffer.from(`${head}.${body}`), key).toString("base64url")}`;
}
const expectations = { tenantId: TENANT, clientId: CLIENT, nonce: "n-123", now: NOW };

describe("Microsoft sign-in token check", () => {
  it("accepts a token Microsoft signed for LHI's tenant and this app, and returns the work email", () => {
    expect(verifyIdToken(idToken(), jwks, expectations)).toEqual({ email: "amina.bello@lhinigeria.org", name: "Amina Bello", oid: "oid-1" });
  });

  it("refuses forged, tampered, foreign, expired or replayed tokens", () => {
    const reject = (token: string, reason: RegExp) => expect(() => verifyIdToken(token, jwks, expectations)).toThrow(reason);
    reject(idToken({}, { key: attacker.privateKey }), /bad signature/);
    const [h, , s] = idToken().split(".");
    reject(`${h}.${b64({ preferred_username: "hr.admin@lhinigeria.org" })}.${s}`, /bad signature/);
    reject(idToken({}, { alg: "none" }), /unexpected algorithm/);
    reject(idToken({}, { kid: "other" }), /unknown signing key/);
    reject(idToken({ tid: "99999999-2222-3333-4444-555555555555", iss: "https://login.microsoftonline.com/99999999-2222-3333-4444-555555555555/v2.0" }), /another tenant/);
    reject(idToken({ aud: "ffffffff-bbbb-cccc-dddd-eeeeeeeeeeee" }), /another app/);
    reject(idToken({ exp: NOW - 3600 }), /expired/);
    reject(idToken({ nonce: "someone-elses" }), /nonce/);
    reject(idToken({ preferred_username: "", email: undefined }), /no email/);
  });
});

describe("Microsoft sign-in settings", () => {
  it("is off unless LHI's tenant ID, the app ID and a secret are all set", () => {
    expect(microsoftConfig({})).toBeNull();
    expect(microsoftConfig({ HR_MS_TENANT_ID: "common", HR_MS_CLIENT_ID: CLIENT, HR_MS_CLIENT_SECRET: "x" })).toBeNull();
    expect(microsoftConfig({ HR_MS_TENANT_ID: TENANT, HR_MS_CLIENT_ID: CLIENT, HR_MS_CLIENT_SECRET: "x" })).toEqual({ tenantId: TENANT, clientId: CLIENT, clientSecret: "x", redirectUri: undefined, authority: "https://login.microsoftonline.com" });
  });

  it("sends people to LHI's own tenant with PKCE, state and nonce", () => {
    const cfg = microsoftConfig({ HR_MS_TENANT_ID: TENANT, HR_MS_CLIENT_ID: CLIENT, HR_MS_CLIENT_SECRET: "x" })!;
    const s = newSignInSecrets();
    const url = new URL(authorizeUrl(cfg, { redirectUri: "https://lhinigeria.org/hrportal/sso/microsoft/callback", state: s.state, nonce: s.nonce, challenge: s.challenge }));
    expect(url.pathname).toBe(`/${TENANT}/oauth2/v2.0/authorize`);
    expect(url.searchParams.get("code_challenge_method")).toBe("S256");
    expect(url.searchParams.get("state")).toBe(s.state);
    expect(url.searchParams.get("nonce")).toBe(s.nonce);
    expect(url.searchParams.has("client_secret")).toBe(false);
  });
});
