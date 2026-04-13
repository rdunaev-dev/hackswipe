"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AnimatePresence } from "framer-motion";
import SwipeCard from "@/components/SwipeCard";
import DiceRoll from "@/components/DiceRoll";
import ProjectDetails from "@/components/ProjectDetails";
import VaultCounter from "@/components/VaultCounter";
import ProgressBar from "@/components/ProgressBar";
import { Project, DiceResult, SwipeDirection, DiceRarity } from "@/lib/types";

interface FeedResponse {
  status: "active" | "feed_done" | "completed";
  round?: number;
  project?: Project;
  diceRoll?: number;
  rarity?: DiceRarity;
  swipeCount?: number;
  sessionSize?: number;
  bankCount?: number;
  bankIds?: string[];
  bankProjects?: Project[];
}

export default function SwipePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [diceResult, setDiceResult] = useState<DiceResult | null>(null);
  const [showDice, setShowDice] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [sessionSize, setSessionSize] = useState(0);
  const [swipeCount, setSwipeCount] = useState(0);
  const [bankCount, setBankCount] = useState(0);
  const [feedDone, setFeedDone] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [, setPendingDice] = useState<{ roll: number; rarity: DiceRarity } | null>(null);

  const fetchNext = useCallback(async (): Promise<FeedResponse | null> => {
    try {
      const res = await fetch("/api/feed");
      if (!res.ok) {
        if (res.status === 401) {
          router.replace("/");
          return null;
        }
        return null;
      }
      return await res.json();
    } catch {
      return null;
    }
  }, [router]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace("/");
      return;
    }

    fetchNext().then((data) => {
      if (!data) return;
      if (data.round) setCurrentRound(data.round);
      if (data.status === "completed") {
        router.replace("/done");
        return;
      }
      if (data.status === "feed_done") {
        setFeedDone(true);
        setBankCount(data.bankIds?.length ?? 0);
        setSwipeCount(data.swipeCount ?? 0);
        setSessionSize(data.sessionSize ?? 0);
        setIsReady(true);
        return;
      }
      setCurrentProject(data.project ?? null);
      setSwipeCount(data.swipeCount ?? 0);
      setSessionSize(data.sessionSize ?? 0);
      setBankCount(data.bankCount ?? 0);
      setIsReady(true);
    });
  }, [authLoading, isAuthenticated, router, fetchNext]);

  async function handleSwipe(direction: SwipeDirection) {
    if (!currentProject) return;

    const roll = Math.floor(Math.random() * 100) + 1;

    fetch("/api/swipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: currentProject.id,
        direction,
        diceRoll: roll,
      }),
    }).catch(() => {});

    if (direction === "right") {
      setBankCount((c) => c + 1);
    }
    setSwipeCount((c) => c + 1);

    setCurrentProject(null);

    const nextData = await fetchNext();
    if (!nextData) return;

    if (nextData.status === "completed") {
      router.push("/done");
      return;
    }

    if (nextData.status === "feed_done") {
      setFeedDone(true);
      setBankCount(nextData.bankIds?.length ?? 0);
      return;
    }

    if (nextData.project) {
      const nextRoll = nextData.diceRoll ?? roll;
      const nextRarity = nextData.rarity ?? "common";
      setPendingDice({ roll: nextRoll, rarity: nextRarity });
      setDiceResult({ roll: nextRoll, rarity: nextRarity, projectId: nextData.project.id });
      setShowDice(true);
    }
  }

  function handleDiceComplete() {
    setShowDice(false);
    if (!diceResult) return;

    fetchNext().then((data) => {
      if (!data || data.status !== "active") {
        setFeedDone(true);
        return;
      }
      setCurrentProject(data.project ?? null);
      setSwipeCount(data.swipeCount ?? 0);
      setBankCount(data.bankCount ?? 0);
    });
    setDiceResult(null);
    setPendingDice(null);
  }

  if (!isReady || authLoading) return null;

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      <div className="relative z-20 flex items-center justify-between px-4 pt-4 pb-2">
        <VaultCounter count={bankCount} onClick={() => router.push("/bank")} />
        <div className="flex-1 mx-3">
          <ProgressBar current={swipeCount} total={sessionSize} />
        </div>
        {currentRound === 2 && (
          <span className="ml-2 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">
            Финал
          </span>
        )}
      </div>

      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {currentProject && !showDice && (
            <SwipeCard
              key={currentProject.id}
              project={currentProject}
              onSwipe={handleSwipe}
              onDetails={() => setShowDetails(true)}
            />
          )}
        </AnimatePresence>

        {(feedDone || (!currentProject && !showDice)) && !currentProject && (
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center animate-fade-up">
            <span className="text-5xl mb-4">🏦</span>
            <h2 className="text-xl font-bold text-white mb-2">Лента пройдена!</h2>
            <p className="text-sm text-slate-400 mb-6">
              {bankCount > 0
                ? `У тебя ${bankCount} проект${bankCount === 1 ? "" : bankCount < 5 ? "а" : "ов"} в Финальном банке. Пора выбрать победителя.`
                : "Ты не добавил ни одного проекта в банк. Можешь начать заново."}
            </p>
            <button
              onClick={() => router.push(bankCount > 0 ? "/bank" : "/")}
              className="px-8 py-3 rounded-2xl font-bold text-black bg-gradient-to-r from-vault-gold to-yellow-400 active:scale-[0.97] transition-transform"
            >
              {bankCount > 0 ? "Открыть банк" : "На главную"}
            </button>
          </div>
        )}
      </div>

      {currentProject && !showDice && (
        <div className="relative z-20 flex justify-center items-center gap-6 px-8 pb-6 safe-bottom">
          <button
            onClick={() => handleSwipe("left")}
            className="w-14 h-14 rounded-full bg-accent-red/10 border border-accent-red/20 flex items-center justify-center text-accent-red text-2xl active:scale-90 hover:bg-accent-red/20 transition-all"
            aria-label="Пропуск"
          >
            ✕
          </button>
          <span className="text-[10px] text-slate-600 uppercase tracking-widest">или свайпай</span>
          <button
            onClick={() => handleSwipe("right")}
            className="w-14 h-14 rounded-full bg-accent-green/10 border border-accent-green/20 flex items-center justify-center text-accent-green text-2xl active:scale-90 hover:bg-accent-green/20 transition-all"
            aria-label="В банк"
          >
            ♡
          </button>
        </div>
      )}

      <AnimatePresence>
        {showDice && diceResult && (
          <DiceRoll
            roll={diceResult.roll}
            rarity={diceResult.rarity}
            onComplete={handleDiceComplete}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDetails && currentProject && (
          <ProjectDetails
            project={currentProject}
            onClose={() => setShowDetails(false)}
            showBankButton
            onBank={() => {
              setShowDetails(false);
              handleSwipe("right");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
