export interface Project {
  id: string;
  title: string;
  oneLiner: string;
  coverUrl: string;
  forWhom: string[];
  whoAffected: string[];
  whatImproves: string[];
  fullDescription: string;
  demoUrl?: string;
  repoUrl?: string;
  youtrackUrl?: string;
  authors: string[];
  authorEmails: string[];
  epicId?: string;
}

export type SwipeDirection = "left" | "right";

export interface SwipeRecord {
  projectId: string;
  direction: SwipeDirection;
  diceRoll: number;
  timestamp: number;
}

export interface UserSession {
  sessionId: string;
  email: string;
  swipes: SwipeRecord[];
  bank: string[];
  finalVote: string | null;
  honorable: string[];
  completedAt: number | null;
}

export type DiceRarity = "common" | "uncommon" | "rare" | "legendary";

export interface DiceResult {
  roll: number;
  rarity: DiceRarity;
  projectId: string;
}

export interface ProjectStats {
  projectId: string;
  timesShown: number;
  timesBank: number;
  timesSkipped: number;
  finalVotes: number;
}
