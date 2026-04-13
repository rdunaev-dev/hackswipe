import { Project, ProjectStats, UserSession } from "./types";
import projectsData from "@/data/projects.json";

export type { UserSession } from "./types";

const STORAGE_KEY = "hackswipe_session";

export function getProjects(): Project[] {
  return projectsData as Project[];
}

export function getProjectById(id: string): Project | undefined {
  return getProjects().find((p) => p.id === id);
}

export function loadSession(): UserSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
}

export function saveSession(session: UserSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function createSession(email: string, sessionId: string): UserSession {
  return {
    sessionId,
    email,
    swipes: [],
    bank: [],
    finalVote: null,
    honorable: [],
    completedAt: null,
  };
}

const STATS_KEY = "hackswipe_stats";

export function loadGlobalStats(): Map<string, ProjectStats> {
  if (typeof window === "undefined") return new Map();
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return new Map();
    const arr = JSON.parse(raw) as ProjectStats[];
    return new Map(arr.map((s) => [s.projectId, s]));
  } catch {
    return new Map();
  }
}

export function saveGlobalStats(stats: Map<string, ProjectStats>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STATS_KEY, JSON.stringify([...stats.values()]));
}

export function incrementStat(
  stats: Map<string, ProjectStats>,
  projectId: string,
  field: "timesShown" | "timesBank" | "timesSkipped" | "finalVotes",
): Map<string, ProjectStats> {
  const existing = stats.get(projectId) ?? {
    projectId,
    timesShown: 0,
    timesBank: 0,
    timesSkipped: 0,
    finalVotes: 0,
  };
  existing[field]++;
  stats.set(projectId, existing);
  return stats;
}
