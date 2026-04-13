import { NextRequest, NextResponse } from "next/server";
import { getEmailFromCookie, isAdmin } from "@/lib/auth";
import { getFullStats } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const email = getEmailFromCookie(req);
  if (!email || !isAdmin(email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const stats = await getFullStats();
  return NextResponse.json(stats);
}
