import { NextRequest, NextResponse } from "next/server";
import { getEmailFromCookie } from "@/lib/auth";
import {
  findSessionByEmail,
  recordSwipe,
  hasVoted,
  getProjectById,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const email = getEmailFromCookie(req);
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbSession = await findSessionByEmail(email);
  if (!dbSession) {
    return NextResponse.json({ error: "No session found" }, { status: 400 });
  }

  if (await hasVoted(dbSession.id)) {
    return NextResponse.json({ error: "Already completed" }, { status: 409 });
  }

  const { projectId, direction, diceRoll } = (await req.json()) as {
    projectId: string;
    direction: "left" | "right";
    diceRoll: number;
  };

  if (!projectId || !direction) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const project = await getProjectById(projectId);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  if (project.authorEmails.some((e) => e.toLowerCase() === email)) {
    return NextResponse.json({ error: "Cannot interact with own project" }, { status: 403 });
  }

  await recordSwipe(dbSession.id, projectId, direction, diceRoll || 0);

  return NextResponse.json({ ok: true });
}
