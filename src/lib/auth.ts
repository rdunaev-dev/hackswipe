import { NextRequest } from "next/server";
import crypto from "crypto";

const COOKIE_NAME = "hackswipe_session";
const ALLOWED_DOMAIN = process.env.ALLOWED_EMAIL_DOMAIN || "";
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function getSecret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET env var is required");
  return s;
}

function sign(data: string): string {
  return crypto.createHmac("sha256", getSecret()).update(data).digest("hex");
}

function toBase64(str: string): string {
  return Buffer.from(str, "utf-8").toString("base64url");
}

function fromBase64(b64: string): string {
  return Buffer.from(b64, "base64url").toString("utf-8");
}

export function createSessionCookie(email: string): {
  name: string;
  value: string;
  options: Record<string, unknown>;
} {
  const payload = toBase64(email.toLowerCase());
  const signature = sign(payload);
  const value = `${payload}.${signature}`;
  return {
    name: COOKIE_NAME,
    value,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    },
  };
}

export function getEmailFromCookie(req: NextRequest): string | null {
  const raw = req.cookies.get(COOKIE_NAME)?.value;
  if (!raw) return null;

  const dotIdx = raw.indexOf(".");
  if (dotIdx === -1) return null;

  const payload = raw.slice(0, dotIdx);
  const sig = raw.slice(dotIdx + 1);

  const expected = sign(payload);
  if (sig.length !== expected.length) return null;

  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
      return null;
    }
  } catch {
    return null;
  }

  try {
    return fromBase64(payload);
  } catch {
    return null;
  }
}

export function isValidDomain(email: string): boolean {
  if (!ALLOWED_DOMAIN) return true;
  return email.toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`);
}

export function isAdmin(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export { COOKIE_NAME };
