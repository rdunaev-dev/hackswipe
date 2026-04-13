import { DiceRarity, DiceResult, Project, ProjectStats } from "./types";

export function rollD100(): number {
  return Math.floor(Math.random() * 100) + 1;
}

export function getRarity(roll: number): DiceRarity {
  if (roll >= 98) return "legendary";
  if (roll >= 86) return "rare";
  if (roll >= 61) return "uncommon";
  return "common";
}

export const RARITY_COLORS: Record<DiceRarity, { bg: string; text: string; glow: string }> = {
  common: { bg: "from-slate-600 to-slate-800", text: "text-slate-300", glow: "shadow-slate-500/30" },
  uncommon: { bg: "from-blue-600 to-cyan-700", text: "text-cyan-300", glow: "shadow-cyan-500/40" },
  rare: { bg: "from-purple-600 to-pink-600", text: "text-purple-300", glow: "shadow-purple-500/50" },
  legendary: { bg: "from-amber-500 to-yellow-300", text: "text-yellow-200", glow: "shadow-yellow-400/60" },
};

export const RARITY_LABELS: Record<DiceRarity, string> = {
  common: "",
  uncommon: "",
  rare: "Скрытая жемчужина",
  legendary: "Редкий дроп!",
};

/**
 * Weighted project selection — projects with fewer global views get higher weight.
 * The d100 roll picks a position within the weighted pool.
 */
export function selectNextProject(
  remaining: Project[],
  globalStats: Map<string, ProjectStats>,
  roll: number,
): DiceResult {
  if (remaining.length === 0) {
    throw new Error("No remaining projects");
  }

  if (remaining.length === 1) {
    return { roll, rarity: getRarity(roll), projectId: remaining[0].id };
  }

  const maxShown = Math.max(
    1,
    ...remaining.map((p) => globalStats.get(p.id)?.timesShown ?? 0),
  );

  const weights = remaining.map((p) => {
    const shown = globalStats.get(p.id)?.timesShown ?? 0;
    return maxShown - shown + 1;
  });

  const totalWeight = weights.reduce((a, b) => a + b, 0);

  const normalizedPosition = ((roll - 1) / 99) * totalWeight;

  let cumulative = 0;
  for (let i = 0; i < remaining.length; i++) {
    cumulative += weights[i];
    if (normalizedPosition < cumulative) {
      return { roll, rarity: getRarity(roll), projectId: remaining[i].id };
    }
  }

  return { roll, rarity: getRarity(roll), projectId: remaining[remaining.length - 1].id };
}

export function getSessionSize(totalProjects: number): number {
  if (totalProjects <= 8) return totalProjects;
  if (totalProjects <= 15) return Math.min(totalProjects, 12);
  return Math.min(totalProjects, 20);
}
