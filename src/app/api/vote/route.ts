import { NextRequest, NextResponse } from "next/server";
import { getEmailFromCookie } from "@/lib/auth";
import {
  findSessionByEmail,
  hasVoted,
  castVote,
  getProjectById,
  getAllProjects,
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
    return NextResponse.json({ error: "Already voted" }, { status: 409 });
  }

  const body = await req.json();
  const { winnerId, honorableIds = [] } = body as {
    winnerId: string;
    honorableIds?: string[];
  };

  if (!winnerId) {
    return NextResponse.json({ error: "winnerId required" }, { status: 400 });
  }

  const winnerProject = await getProjectById(winnerId);
  if (!winnerProject) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  if (winnerProject.authorEmails.some((e) => e.toLowerCase() === email)) {
    return NextResponse.json({ error: "Cannot vote for your own project" }, { status: 403 });
  }

  const allProjects = await getAllProjects();
  const validHonorable = honorableIds.filter((hId: string) => {
    if (hId === winnerId) return false;
    const proj = allProjects.find((p) => p.id === hId);
    if (!proj) return false;
    if (proj.authorEmails.some((e) => e.toLowerCase() === email)) return false;
    return true;
  }).slice(0, 2);

  try {
    await castVote(dbSession.id, winnerId, validHonorable);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Vote failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const email = getEmailFromCookie(req);
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbSession = await findSessionByEmail(email);
  return NextResponse.json({
    voted: dbSession ? await hasVoted(dbSession.id) : false,
  });
}
