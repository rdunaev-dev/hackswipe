import { NextRequest, NextResponse } from "next/server";
import { getEmailFromCookie, isAdmin } from "@/lib/auth";
import {
  getFullStats,
  getCurrentRound,
  setCurrentRound,
  setFinalists,
  getFinalists,
  resetUserData,
  seedFromJson,
} from "@/lib/db";
import { Project } from "@/lib/types";
import projectsSeed from "@/data/projects.json";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const email = getEmailFromCookie(req);
  if (!email || !isAdmin(email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const roundParam = req.nextUrl.searchParams.get("round");
  const currentRound = await getCurrentRound();
  const finalists = await getFinalists();

  const roundFilter = roundParam ? Number(roundParam) : undefined;
  const stats = await getFullStats(roundFilter);

  return NextResponse.json({
    ...stats,
    currentRound,
    finalists,
  });
}

export async function POST(req: NextRequest) {
  const email = getEmailFromCookie(req);
  if (!email || !isAdmin(email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json()) as { action: string; email?: string };
  const { action } = body;

  if (action === "start_round_2") {
    const currentRound = await getCurrentRound();
    if (currentRound === 2) {
      return NextResponse.json({ error: "Round 2 already active" }, { status: 409 });
    }

    const stats = await getFullStats(1);

    const ranked = stats.projects
      .filter((p) => p.timesShown > 0)
      .map((p) => {
        const voteScore = p.timesShown > 0 ? p.finalVotes / p.timesShown : 0;
        const bankScore = p.timesShown > 0 ? p.timesInBank / p.timesShown : 0;
        return {
          ...p,
          score: voteScore * 0.7 + bankScore * 0.3,
        };
      })
      .sort((a, b) => b.score - a.score);

    const top10 = ranked.slice(0, 10).map((p) => p.projectId);

    await setFinalists(top10);
    await setCurrentRound(2);

    return NextResponse.json({
      ok: true,
      finalists: top10,
      rankedPreview: ranked.slice(0, 15).map((p) => ({
        id: p.projectId,
        title: p.title,
        score: Math.round(p.score * 1000) / 1000,
        votes: p.finalVotes,
        bankRate: p.bankRate,
        timesShown: p.timesShown,
      })),
    });
  }

  if (action === "reset_to_round_1") {
    await setCurrentRound(1);
    await setFinalists([]);
    return NextResponse.json({ ok: true });
  }

  if (action === "reseed_projects") {
    await seedFromJson(projectsSeed as Project[]);
    return NextResponse.json({ ok: true, count: projectsSeed.length });
  }

  if (action === "reset_user") {
    const targetEmail = body.email;
    if (!targetEmail) {
      return NextResponse.json({ error: "email required" }, { status: 400 });
    }
    const result = await resetUserData(targetEmail);
    return NextResponse.json({ ok: true, ...result });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
