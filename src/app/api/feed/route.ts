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
} from "@/lib/db";
import { rollD100, getRarity, getSessionSize } from "@/lib/balancer";
import { v4 as uuid } from "uuid";
import { Project } from "@/lib/types";
import projectsSeed from "@/data/projects.json";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const email = getEmailFromCookie(req);
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let allProjects = await getAllProjects();
  if (allProjects.length === 0) {
    await seedFromJson(projectsSeed as Project[]);
    allProjects = await getAllProjects();
  }

  const ownProjectIds = new Set(
    allProjects
      .filter((p) => p.authorEmails.some((e) => e.toLowerCase() === email))
      .map((p) => p.id),
  );

  const eligibleCount = allProjects.length - ownProjectIds.size;
  const sessionSize = getSessionSize(eligibleCount);

  let dbSession = await findSessionByEmail(email);
  if (!dbSession) {
    dbSession = await createDbSession(uuid(), email, null, null, null, sessionSize);
  }

  if (await hasVoted(dbSession.id)) {
    return NextResponse.json({ status: "completed" });
  }

  const seenIds = await getSeenProjectIds(dbSession.id);
  const swipeCount = seenIds.size;
  const bankIds = await getBankProjectIds(dbSession.id);

  if (swipeCount >= sessionSize) {
    return NextResponse.json({
      status: "feed_done",
      bankIds,
      bankProjects: bankIds.map((id) => allProjects.find((p) => p.id === id)).filter(Boolean),
      swipeCount,
      sessionSize,
    });
  }

  const remaining = allProjects.filter(
    (p) => !seenIds.has(p.id) && !ownProjectIds.has(p.id),
  );

  if (remaining.length === 0) {
    return NextResponse.json({
      status: "feed_done",
      bankIds,
      bankProjects: bankIds.map((id) => allProjects.find((p) => p.id === id)).filter(Boolean),
      swipeCount,
      sessionSize,
    });
  }

  const globalShown = await getProjectTimesShown();
  const roll = rollD100();
  const nextProject = selectWeighted(remaining, globalShown, roll);
  const rarity = getRarity(roll);

  return NextResponse.json({
    status: "active",
    project: nextProject,
    diceRoll: roll,
    rarity,
    swipeCount,
    sessionSize,
    bankCount: bankIds.length,
    bankIds,
  });
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
