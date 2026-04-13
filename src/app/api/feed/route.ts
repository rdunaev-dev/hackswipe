import { NextRequest, NextResponse } from "next/server";
import { getEmailFromCookie } from "@/lib/auth";
import {
  findSessionByEmail,
  createDbSession,
  getAllProjects,
  getSeenProjectIds,
  getBankProjectIds,
  getProjectTimesShown,
  hasVoted,
  seedFromJson,
  getCurrentRound,
  getFinalists,
} from "@/lib/db";
import { rollD100, getRarity, getSessionSize } from "@/lib/balancer";
import { v4 as uuid } from "uuid";
import { Project } from "@/lib/types";
import projectsSeed from "@/data/projects.json";

export const dynamic = "force-dynamic";

let _seeded = false;

export async function GET(req: NextRequest) {
  const email = getEmailFromCookie(req);
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!_seeded) {
    await seedFromJson(projectsSeed as Project[]);
    _seeded = true;
  }
  const allProjects = await getAllProjects();

  const currentRound = await getCurrentRound();

  let pool: Project[];
  if (currentRound === 2) {
    const finalistIds = await getFinalists();
    const finalistSet = new Set(finalistIds);
    pool = allProjects.filter((p) => finalistSet.has(p.id));
  } else {
    pool = allProjects;
  }

  const ownProjectIds = new Set(
    pool
      .filter((p) => p.authorEmails.some((e) => e.toLowerCase() === email))
      .map((p) => p.id),
  );

  const eligibleCount = pool.length - ownProjectIds.size;
  const sessionSize =
    currentRound === 2 ? eligibleCount : getSessionSize(eligibleCount);

  let dbSession = await findSessionByEmail(email, currentRound);
  if (!dbSession) {
    dbSession = await createDbSession(
      uuid(),
      email,
      null,
      null,
      null,
      sessionSize,
      currentRound,
    );
  }

  if (await hasVoted(dbSession.id)) {
    const r1Completed = currentRound === 2
      ? true
      : await hasVotedR1(email);
    return NextResponse.json({ status: "completed", round: currentRound, r1Completed });
  }

  const seenIds = await getSeenProjectIds(dbSession.id);
  const swipeCount = seenIds.size;
  const bankIds = await getBankProjectIds(dbSession.id);

  if (swipeCount >= sessionSize) {
    return NextResponse.json({
      status: "feed_done",
      round: currentRound,
      bankIds,
      bankProjects: bankIds
        .map((id) => pool.find((p) => p.id === id))
        .filter(Boolean),
      swipeCount,
      sessionSize,
    });
  }

  const remaining = pool.filter(
    (p) => !seenIds.has(p.id) && !ownProjectIds.has(p.id),
  );

  if (remaining.length === 0) {
    return NextResponse.json({
      status: "feed_done",
      round: currentRound,
      bankIds,
      bankProjects: bankIds
        .map((id) => pool.find((p) => p.id === id))
        .filter(Boolean),
      swipeCount,
      sessionSize,
    });
  }

  const globalShown = await getProjectTimesShown(currentRound);
  const roll = rollD100();
  const nextProject = selectWeighted(remaining, globalShown, roll);
  const rarity = getRarity(roll);

  return NextResponse.json({
    status: "active",
    round: currentRound,
    project: nextProject,
    diceRoll: roll,
    rarity,
    swipeCount,
    sessionSize,
    bankCount: bankIds.length,
    bankIds,
  });
}

async function hasVotedR1(email: string): Promise<boolean> {
  const s = await findSessionByEmail(email, 1);
  if (!s) return false;
  return await hasVoted(s.id);
}

function selectWeighted(
  remaining: Project[],
  globalShown: Map<string, number>,
  roll: number,
): Project {
  if (remaining.length === 1) return remaining[0];

  const maxShown = Math.max(1, ...remaining.map((p) => globalShown.get(p.id) ?? 0));
  const weights = remaining.map((p) => maxShown - (globalShown.get(p.id) ?? 0) + 1);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const pos = ((roll - 1) / 99) * totalWeight;

  let cumulative = 0;
  for (let i = 0; i < remaining.length; i++) {
    cumulative += weights[i];
    if (pos < cumulative) return remaining[i];
  }
  return remaining[remaining.length - 1];
}
