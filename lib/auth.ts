import crypto from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "host_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

function hostPassword(): string {
  return process.env.HOST_PASSWORD ?? "";
}

function secret(): string {
  // Falls back to the password so a single env var is enough to run the site.
  return process.env.HOST_SESSION_SECRET || hostPassword() || "insecure-dev-secret";
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export function checkPassword(candidate: string): boolean {
  const expected = hostPassword();
  if (!expected) return false;
  return safeEqual(candidate, expected);
}

export function createSessionToken(): string {
  const expires = Date.now() + SESSION_TTL_SECONDS * 1000;
  const payload = String(expires);
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  if (!safeEqual(signature, sign(payload))) return false;
  const expires = Number(payload);
  return Number.isFinite(expires) && expires > Date.now();
}

export async function isHostAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
} as const;
