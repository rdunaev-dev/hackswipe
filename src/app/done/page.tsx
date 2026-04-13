"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

type RoundState = "r1_done" | "r2_available" | "r2_done" | "loading";

export default function DonePage() {
  const router = useRouter();
  const { email, isAuthenticated, isLoading, logout } = useAuth();
  const [roundState, setRoundState] = useState<RoundState>("loading");

  const checkRound = useCallback(async () => {
    try {
      const res = await fetch("/api/feed");
      if (!res.ok) return;
      const data = await res.json();

      if (data.status === "completed" && data.round === 2) {
        setRoundState("r2_done");
      } else if (data.status === "completed" && data.round === 1) {
        setRoundState("r1_done");
      } else if (
        (data.status === "active" || data.status === "feed_done") &&
        data.round === 2
      ) {
        setRoundState("r2_available");
      } else {
        setRoundState("r1_done");
      }
    } catch {
      setRoundState("r1_done");
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
      return;
    }
    if (isAuthenticated) {
      checkRound();
      const interval = setInterval(checkRound, 15_000);
      return () => clearInterval(interval);
    }
  }, [isLoading, isAuthenticated, router, checkRound]);

  if (isLoading || !isAuthenticated || roundState === "loading") return null;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 safe-bottom text-center">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: "-5%",
              backgroundColor: ["#F5A623", "#00F0FF", "#FF3D71", "#00E676", "#a78bfa"][i % 5],
            }}
            animate={{ y: "110vh", rotate: Math.random() * 720, opacity: [1, 1, 0] }}
            transition={{
              duration: 3 + Math.random() * 3,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "easeIn",
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {roundState === "r2_available" && (
          <>
            <motion.div
              className="text-6xl mb-6"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              &#x1f525;
            </motion.div>
            <h1 className="text-2xl font-black text-white mb-2">Финал открыт!</h1>
            <p className="text-sm text-slate-400 mb-6">
              10 лучших проектов прошли в финал.
              <br />
              Оцени финалистов и выбери победителя!
            </p>
            <button
              onClick={() => router.push("/swipe")}
              className="px-8 py-3 rounded-2xl font-bold text-black bg-gradient-to-r from-amber-400 to-yellow-300 active:scale-[0.97] transition-transform"
            >
              Голосовать в финале
            </button>
          </>
        )}

        {roundState === "r2_done" && (
          <>
            <motion.div
              className="text-6xl mb-6"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              &#x1f3c6;
            </motion.div>
            <h1 className="text-2xl font-black text-white mb-2">Финальный голос принят!</h1>
            <p className="text-sm text-slate-400 mb-8">
              Спасибо, {email}! Ты проголосовал в обоих раундах.
            </p>
            <div className="glass rounded-2xl p-4 max-w-xs mx-auto mb-6">
              <p className="text-xs text-slate-500 leading-relaxed">
                Победитель будет объявлен после закрытия финального голосования.
              </p>
            </div>
          </>
        )}

        {roundState === "r1_done" && (
          <>
            <motion.div
              className="text-6xl mb-6"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              &#x1f389;
            </motion.div>
            <h1 className="text-2xl font-black text-white mb-2">Голос принят!</h1>
            <p className="text-sm text-slate-400 mb-8">
              Спасибо, {email}
            </p>
            <div className="glass rounded-2xl p-4 max-w-xs mx-auto mb-6">
              <p className="text-xs text-slate-500 leading-relaxed">
                Результаты будут объявлены после закрытия голосования.
                Каждый голос одинаково важен.
              </p>
            </div>
          </>
        )}

        <button
          onClick={async () => {
            await logout();
            router.push("/");
          }}
          className="text-xs text-slate-600 hover:text-slate-400 transition-colors mt-4"
        >
          Выйти из аккаунта
        </button>
      </motion.div>
    </div>
  );
}
