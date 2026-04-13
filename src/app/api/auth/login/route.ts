import { NextRequest, NextResponse } from "next/server";
import { createSessionCookie, isValidDomain } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email } = (await req.json()) as { email?: string };

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const normalized = email.trim().toLowerCase();

  if (!normalized.includes("@") || !isValidDomain(normalized)) {
    return NextResponse.json(
      { error: "Only corporate email allowed" },
      { status: 403 },
    );
  }

  const cookie = createSessionCookie(normalized);
  const res = NextResponse.json({ ok: true, email: normalized });
  res.cookies.set(cookie.name, cookie.value, cookie.options as Parameters<typeof res.cookies.set>[2]);
  return res;
}
